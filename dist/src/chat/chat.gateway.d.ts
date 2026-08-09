import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, sessionId: string): void;
    handleSendMessage(client: Socket, payload: {
        sessionId: string;
        sender: 'customer' | 'admin';
        message: string;
        type?: string;
        customerName?: string;
        customerEmail?: string;
    }): Promise<void>;
    handleJoinAdmin(client: Socket): void;
}
