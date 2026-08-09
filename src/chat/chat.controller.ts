import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('sessions')
  async getAllSessions() {
    return this.chatService.getAllSessions();
  }

  
  @Get('analytics')
  async getAnalytics() {
    return this.chatService.getAnalytics();
  }

  @Get('session/:id')
  async getMessagesBySession(@Param('id') id: string) {
    return this.chatService.getMessagesBySession(id);
  }
}
