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
    if ( message.userId) {
      this.connectedUsers.set(message.userId, client.id);
       console.log(`✅ Utilisateur ${message.userId} connecté avec socket ${client.id}`);
    }else {
    console.log("⚠️ Aucun userId reçu dans register !");
  }
  }
  //supprimé les utilisateurs qui sont deconnecté (notification n'est pas en temp réel dans ce cas)
  handleDisconnect(client: Socket){
    for (const [userId,socketId] of this.connectedUsers.entries()){
      if(socketId === client.id){
        this.connectedUsers.delete(userId);
        console.log(`utilisateur ${userId} déconnecté`);
        break;
      }
    }
  }
 handleEmitEventToUsers(userIds: string[], title: string, message: string) {
    userIds.forEach((userId) => {
      const socketId = this.connectedUsers.get(userId);
      if (socketId) {
        this.server.to(socketId).emit('newNotification', {
          title,
          message,
          createdAt: new Date(),
        });
      }
    });
  }

  handleEmitEventToUser(userId: string, message: string, title: string) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      // Corrected line: emit a structured object with a fixed event name
      this.server.to(socketId).emit('newNotification', {
        title,
        message,
        createdAt: new Date(), // It's good practice to send the timestamp from the server
      });
    }
  }

  




 
  
}
