import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server,Socket } from 'socket.io';

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
  
  private connectedUsers= new Map<string, string>();
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
 @SubscribeMessage('register')  
  handleRegister(@ConnectedSocket() client: Socket, @MessageBody() message: { userId: string }) {
    if (message && message.userId) {
      this.connectedUsers.set(message.userId, client.id);
    }
  }
  //supprimé les utilisateurs qui sont deconnecté (notification n'est pas en temp réel dans ce cas)
  handleDisconnect(client: Socket){
    for (const [userId,socketId] of this.connectedUsers.entries()){
      if(socketId === client.id){
        this.connectedUsers.delete(userId);
        break;
      }
    }
  }
  handleEmitEventToUsers(userId: string, message: string,title:string) {
    this.server.emit(userId, message,title);
  }
  handleEmitEventToUser(userId: string, message: string,title:string) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(message,title);
    }
  }

  




 
  
}
