import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
})
@Injectable()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private connectedUsers = new Map<string, string>();

  constructor(private readonly jwtService: JwtService) {}
  
  //Vérifie le token lors de la connexion WebSocket
  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    if (!token) {
      console.log('Pas de token → déconnexion');
      client.disconnect();
      return;
    }

    try {
      // Vérifie le JWT
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET, 
      });
      console.log('Connexion WebSocket validée pour userId:', payload.sub);

      // Associe le userId au socket
      this.connectedUsers.set(payload.sub, client.id);
    } catch (err) {
      console.log('Token invalide → déconnexion', err.message);
      client.disconnect();
    }
  }

   //Supprime l’utilisateur déconnecté 
  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        console.log(`Utilisateur ${userId} déconnecté`);
        break;
      }
    }
  }

  //Réception d’un message générique
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    console.log(` Message reçu de ${client.id}`, payload);
    return 'Hello world!';
  }
   //Enregistre un utilisateur (optionnel si handleConnection gère déjà le token)
    @SubscribeMessage('register')
    handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: { userId: string },
  ) {
    if (message.userId) {
      this.connectedUsers.set(message.userId, client.id);
      console.log( ` Utilisateur ${message.userId} enregistré avec socket ${client.id}`,);
    } else {console.log(' Aucun userId reçu dans register !');}
  }
  //Envoi d’une notification à plusieurs utilisateurs
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
  //Envoi d’une notification à un seul utilisateur
  handleEmitEventToUser(userId: string, title: string, message: string) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('newNotification', {
        title,
        message,
        createdAt: new Date(),
      });
    }
  }
}
