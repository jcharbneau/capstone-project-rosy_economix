import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  MiniMap,
  Position,
} from 'react-flow-renderer';
import dagre from 'dagre';
import axios from 'axios';

const nodeWidth = 172;
const nodeHeight = 36;

const getLayedOutElements = (nodes, edges, direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, nodesep: 80, ranksep: 180 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    node.targetPosition = Position.Left;
    node.sourcePosition = Position.Right;
  });

  return { nodes, edges };
};

const CustomNode = ({ data, selected }) => (
  <div style={{
    padding: '10px',
    backgroundColor: selected ? '#e3f2fd' : '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    width: 'auto',
    display: 'inline-block',
    whiteSpace: 'nowrap',
  }}>
    <Handle type="target" position={Position.Left} />
    {data.label}
    <Handle type="source" position={Position.Right} />
    {selected && data.fields && (
      <div style={{
        marginTop: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
        padding: '5px',
      }}>
        {data.fields.map(field => (
          <div key={field.name} style={{ marginBottom: '5px' }}>
            <strong>{field.name}</strong> ({field.type})
          </div>
        ))}
      </div>
    )}
  </div>
);

const nodeTypes = { customNode: CustomNode };

const DesignDataModel = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [tableList, setTableList] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [dbtModels, setDbtModels] = useState([]);

  const clearCanvas = () => {
    console.log("Clearing canvas");
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setExpandedNodes({});
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modelsResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/get_dbt_metadata`);
        const tablesResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/get_design_tables`);
        const { nodes: models, edges: modelEdges } = modelsResponse.data;
        const tables = tablesResponse.data.tables;

        setDbtModels({ nodes: models, edges: modelEdges });
        const uniqueTables = tables.map((name) => ({ id: name, label: name }));
        setTableList(uniqueTables);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const fetchTableFields = async (tableName) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/get_table_fields?table_name=${tableName}`);
      return response.data.fields;
    } catch (error) {
      console.error('Error fetching table fields', error);
      return [];
    }
  };

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const expandDependencies = async (tableId, positionX, positionY, newNodes = [], newEdges = [], direction = 'down') => {
    const dependencies = dbtModels.edges.filter((edge) => (direction === 'down' ? edge.source === tableId : edge.target === tableId));
    console.log(dependencies);

    for (const dependency of dependencies) {
      const depId = direction === 'down' ? dependency.target : dependency.source;
      if (!newNodes.find((node) => node.id === depId)) {
        const depFields = await fetchTableFields(depId);
        const depNode = {
          id: depId,
          type: 'customNode',
          data: { label: depId, fields: depFields },
          position: { x: positionX + 300, y: positionY + (newNodes.length * 100) },
        };
        newNodes.push(depNode);
        newEdges.push({
          id: `e${tableId}-${depId}`,
          source: direction === 'down' ? tableId : depId,
          target: direction === 'down' ? depId : tableId,
          animated: true,
        });
        await expandDependencies(depId, positionX + 200, positionY + (newNodes.length * 100), newNodes, newEdges, direction);
      }
    }
    return { newNodes, newEdges };
  };

  const addTable = async (table) => {
    console.log("Adding table:", table.label);

    clearCanvas();

    const fields = await fetchTableFields(table.label);
    const newNode = {
      id: table.label,
      type: 'customNode',
      data: { label: table.label, fields },
      position: { x: 0, y: 0 },
    };

    let { newNodes: downstreamNodes, newEdges: downstreamEdges } = await expandDependencies(table.label, 300, 0, [], [], 'down');
    let { newNodes: upstreamNodes, newEdges: upstreamEdges } = await expandDependencies(table.label, 0, 0, [], [], 'up');

    const allNewNodes = [newNode, ...downstreamNodes, ...upstreamNodes];
    const allNewEdges = [...downstreamEdges, ...upstreamEdges];

    const sourceNode = {
      id: 'source',
      type: 'customNode',
      data: { label: 'source', fields: [] },
      position: { x: -300, y: 0 },
    };

    allNewNodes.unshift(sourceNode);
    allNewEdges.push(
      ...allNewNodes
        .filter((node) => node.id !== 'source' && node.id.startsWith('raw_'))
        .map((node) => ({
          id: `e_source_${node.id}`,
          source: 'source',
          target: node.id,
          animated: true,
        }))
    );

    const layedOutElements = getLayedOutElements(allNewNodes, allNewEdges);
    setNodes(layedOutElements.nodes);
    setEdges(layedOutElements.edges);

    // Highlight the selected node
    setNodes((nds) => nds.map((n) => {
      if (n.id === table.label) {
        return { ...n, data: { ...n.data, highlight: true }, style: { border: '2px solid red' } };
      }
      return n;
    }));
  };

  const onNodeClick = async (event, node) => {
    console.log("Node clicked:", node);

    if (expandedNodes[node.id]) {
      console.log("Node already expanded");
      return;
    }

    setExpandedNodes((prev) => ({ ...prev, [node.id]: true }));

    if (!node.data.fields) {
      const fields = await fetchTableFields(node.data.label);
      setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, fields } } : n)));
    }

    await addTable({ id: node.id, label: node.data.label });
  };

  const onTableClick = async (tableId) => {
    console.log(`Table ${tableId} clicked`);
    const table = tableList.find((t) => t.id === tableId);

    clearCanvas();

    await addTable(table);

    setSelectedNodeId(tableId);
  };

  return (
    <div style={{ display: 'flex', height: '80vh', marginTop: '110px' }}>
      <div style={{ width: '20%', padding: '10px', background: '#f0f0f0', overflowY: 'auto' }}>
        <h3>Available Tables</h3>
        <div style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'scroll', marginBottom: '30px' }}>
          {tableList.map((table) => (
            <div key={table.id} style={{ margin: '5px 0', padding: '5px', background: selectedNodeId === table.id ? '#e3f2fd' : '#ffffff', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
              <button
                onClick={() => onTableClick(table.id)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '5px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {table.label}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: '80%', height: '100%' }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            deleteKeyCode={46} // 'delete'-key
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: 0.2 }}
          >
            <Controls />
            <MiniMap nodeColor={(n) => (n.data?.highlight ? 'red' : '#ddd')} position="bottom-left" />
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default DesignDataModel;
