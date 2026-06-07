import { useState, useEffect } from 'react';

const WS_URL = 'ws://localhost:8000/ws/live-data';

export function useRealTimeData(initialData = null) {
  const [data, setData] = useState(initialData);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // We only connect if we are trying to use real-time data
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('Connected to live data stream');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const liveData = JSON.parse(event.data);
        setData(liveData);
      } catch (e) {
        console.error('Error parsing live data', e);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from live data stream');
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { liveData: data, isConnected };
}
