import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Get('sessions')
  async getAllSessions() {
    return this.chatService.getAllSessions();
  }

  
  @UseGuards(JwtGuard, AdminGuard)
  @Get('analytics')
  async getAnalytics() {
    return this.chatService.getAnalytics();
  }

  @Get('session/:id')
  async getMessagesBySession(@Param('id') id: string) {
    return this.chatService.getMessagesBySession(id);
  }
}
