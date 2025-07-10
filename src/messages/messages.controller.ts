import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { MessagesService } from './menssages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() dto: CreateMessageDto) {
    const message = await this.messagesService.create(dto);
    if (!message)
      throw new InternalServerErrorException('Failed to create message');
    return new SuccessResponseDto('Message created successfully', message);
  }
}
