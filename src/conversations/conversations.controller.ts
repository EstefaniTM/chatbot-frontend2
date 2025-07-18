import {
  Controller,
  Post as HttpPost,
  Get,
  Param,
  Body,
  Query,
  NotFoundException,
  InternalServerErrorException,
  Delete,
  Post
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { Conversation } from './conversation.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  async create(
  @Body() createConversationDto: CreateConversationDto,
  @Request() req
  ): Promise<SuccessResponseDto<Conversation>> {
    const conversation = await this.conversationsService.create(
      createConversationDto,
      req.user
    );
    if (!conversation)
      throw new NotFoundException('Error creating conversation');
    return new SuccessResponseDto(
      'Conversation created successfully',
      conversation,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<SuccessResponseDto<{ data: Conversation[]; total: number }>> {
    const conversations = await this.conversationsService.findAll(Number(page), Number(limit));

    if (!conversations) {
      throw new InternalServerErrorException('Error retrieving conversations');
    }

    return new SuccessResponseDto(
      'Conversations retrieved successfully',
      conversations,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<Conversation>> {
    const conversation = await this.conversationsService.findOne(id);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return new SuccessResponseDto(
      'Conversation retrieved successfully',
      conversation,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<null>> {
    const deleted = await this.conversationsService.delete(id);
    if (!deleted) throw new NotFoundException('Conversation not found');
    return new SuccessResponseDto('Conversation deleted successfully', null);
  }
}