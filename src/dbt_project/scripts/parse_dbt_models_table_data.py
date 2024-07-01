import json
import sys
from collections import defaultdict

# Load the data from the JSON file
with open('dbt_model_data.json', 'r') as f:
    data = json.load(f)

# Create a dictionary to store the dependencies
dependency_dict = {item['name']: item['depends_on'] for item in data}

# Create a reverse dependency dictionary to find children
reverse_dependency_dict = defaultdict(list)
for parent, children in dependency_dict.items():
    for child in children:
        reverse_dependency_dict[child].append(parent)

def find_parents(node, visited=None):
    if visited is None:
        visited = set()
    if node in visited:
        return []
    visited.add(node)
    parents = dependency_dict.get(node, [])
    all_parents = set(parents)
    for parent in parents:
        all_parents.update(find_parents(parent, visited))
    return list(all_parents)

def find_children(node, visited=None):
    if visited is None:
        visited = set()
    if node in visited:
        return []
    visited.add(node)
    children = reverse_dependency_dict.get(node, [])
    all_children = set(children)
    for child in children:
        all_children.update(find_children(child, visited))
    return list(all_children)

def print_tree(node, indent='', is_last=True, bold=False, visited=None):
    if visited is None:
        visited = set()
    if node in visited:
        return
    visited.add(node)
    node_label = f"\033[1m{node}\033[0m" if bold else node
    print(f"{indent}{'└── ' if is_last else '├── '}{node_label}")
    children = reverse_dependency_dict.get(node, [])
    for i, child in enumerate(children):
        is_last_child = i == len(children) - 1
        print_tree(child, indent + ('    ' if is_last else '│   '), is_last_child, False, visited)

def build_full_tree(node, bold_node):
    parents = find_parents(node)
    children = find_children(node)
    all_nodes = parents + [node] + children
    all_nodes = list(set(all_nodes))

    seen = set()
    for root in all_nodes:
        if not any(root in children for children in reverse_dependency_dict.values()):
            print_tree(root, visited=seen)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python parse_dbt_models_table_data.py <node>")
        sys.exit(1)

    node = sys.argv[1]
    build_full_tree(node, node)
