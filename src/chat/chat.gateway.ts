import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket, sessionId: string) {
    client.join(sessionId);
    console.log(`Client ${client.id} joined room ${sessionId}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    client: Socket,
    payload: { sessionId: string; sender: 'customer' | 'admin'; message: string; type?: string; customerName?: string; customerEmail?: string },
  ) {
    const savedMessage = await this.chatService.saveMessage(
      payload.sessionId,
      payload.sender,
      payload.message,
      payload.type,
      payload.customerName,
      payload.customerEmail,
    );

    // Broadcast to the specific session room
    this.server.to(payload.sessionId).emit('receive_message', savedMessage);
    
    // Also broadcast to a special 'admin' room so the admin dashboard updates instantly
    this.server.to('admin').emit('new_session_activity', {
      sessionId: payload.sessionId,
      lastMessage: payload.message,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
    });
  }

  @SubscribeMessage('join_admin')
  handleJoinAdmin(client: Socket) {
    client.join('admin');
    console.log(`Client ${client.id} joined admin room`);
  }
}
