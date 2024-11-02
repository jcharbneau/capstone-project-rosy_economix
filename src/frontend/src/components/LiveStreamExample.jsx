import { useEffect, useState } from 'react';

function LiveDataStream() {
  const [data, setData] = useState([]);

  // Fetch initial data with StreamingResponse
  useEffect(() => {
    fetch("http://localhost:8500/api/combined-chart-initial")
      .then((response) => {
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                const text = new TextDecoder("utf-8").decode(value);
                const entries = text.trim().split("\n").map(JSON.parse);
                setData((prevData) => [...prevData, ...entries]);
                return pump();
              });
            }
          },
        });
      });
  }, []);

  // Connect to WebSocket for live updates
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8500/api/combined-chart-stream-ws");
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setData((prevData) => [...prevData, message]);
    };
    return () => ws.close();
  }, []);

  return (
    <div>
      <h2>Live Data Stream</h2>
      {data.map((entry, index) => (
        <div key={index}>
          <p><strong>Year:</strong> {entry.year}</p>
          <p><strong>Event:</strong> {entry.event}</p>
          <p><strong>Amount:</strong> {entry.amount}</p>
        </div>
      ))}
    </div>
  );
}

export default LiveDataStream;
