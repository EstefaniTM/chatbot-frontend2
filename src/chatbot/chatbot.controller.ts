import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('ask')
  async ask(@Body() body: { question: string; conversationId: string; csvId: string }) {
    return this.chatbotService.ask(body.question, body.conversationId, body.csvId);
  }
}