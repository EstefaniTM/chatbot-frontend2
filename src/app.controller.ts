import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { HuggingFaceService } from './huggingface/huggingface.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly hfService: HuggingFaceService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('chat')
  async chat(@Query('q') query: string) {
    if (!query) {
      return { error: 'Parámetro "q" es requerido' };
    }

    const response = await this.hfService.generate(query);
    return { 
      question: query,
      response: response,
      timestamp: new Date().toISOString()
    };
  }

  @Get('hf-status')
  getHuggingFaceStatus() {
    return this.hfService.getStatus();
  }
}
