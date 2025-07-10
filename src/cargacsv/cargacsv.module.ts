import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CargacsvService } from './cargacsv.service';
import { CargacsvController } from './cargacsv.controller';
import { Cargacsv, CargacsvSchema } from './cargacsv.entity';
import { Message, MessageSchema } from '../messages/message.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cargacsv.name, schema: CargacsvSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [CargacsvController],
  providers: [CargacsvService],
})
export class CargacsvModule {}