import React, { useEffect, useState } from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';

interface ProgressMonitorProps {
  taskId: string;
  onComplete?: () => void;
}

const ProgressMonitor: React.FC<ProgressMonitorProps> = ({ 
  taskId, 
  onComplete 
}) => {
  const [progress, setProgress] = useState(0);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:3000');

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'progress' && data.taskId === taskId) {
        setProgress(data.progress);
        if (data.progress === 100 && onComplete) {
          onComplete();
        }
      }
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [taskId, onComplete]);

  return (
    <Box sx={{ width: '100%', my: 2 }}>
      <LinearProgress variant="determinate" value={progress} />
      <Typography variant="body2" color="text.secondary" align="center">
        {progress}%
      </Typography>
    </Box>
  );
};

export default ProgressMonitor;