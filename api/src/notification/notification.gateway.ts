import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server:Server;



  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';

  }
  handleEmitEvent(userId: string, message: string,title:string) {
    this.server.emit(userId, message,title);
  }
}
