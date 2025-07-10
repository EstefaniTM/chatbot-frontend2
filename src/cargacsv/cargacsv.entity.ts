import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'csv_uploads' })
export class Cargacsv extends Document {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalname: string;

  @Prop({ required: true })
  uploadedBy: string; // userId o username

  @Prop({ default: Date.now })
  uploadedAt: Date;

  @Prop({ default: 'pending' })
  status: 'pending' | 'processed' | 'error';

  @Prop()
  errorMessage?: string;
}

export const CargacsvSchema = SchemaFactory.createForClass(Cargacsv);