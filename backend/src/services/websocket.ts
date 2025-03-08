import WebSocket from 'ws';
import http from 'http';

export class WebSocketService {
  private wss: WebSocket.Server;

  constructor(server: http.Server) {
    this.wss = new WebSocket.Server({ server });
    this.initialize();
  }

  private initialize(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      ws.on('message', (message: string) => {
        const data = JSON.parse(message);
        // Handle incoming messages
      });

      ws.on('error', (error: Error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  broadcastProgress(taskId: string, progress: number): void {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'progress',
          taskId,
          progress,
        }));
      }
    });
  }
}