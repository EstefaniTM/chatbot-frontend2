import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { ConversationsModule } from '../conversations/conversations.module';
import { CargacsvModule } from '../cargacsv/cargacsv.module';
import { HuggingFaceModule } from '../huggingface/huggingface.module';


@Module({
  imports: [ConversationsModule, CargacsvModule, HuggingFaceModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}