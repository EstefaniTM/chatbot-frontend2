import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '¡Hola, mundo! Bienvenido al chatbot de Tipantuna Estefani.';
  }
}
