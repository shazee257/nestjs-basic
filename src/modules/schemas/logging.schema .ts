import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Logging {
  @Prop()
  statusCode: number;

  @Prop()
  message: string;

  @Prop()
  error: string;

  @Prop()
  stack: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export type LoggingDocument = Logging & Document;
export const LOGGING_MODEL = Logging.name;
export const LoggingSchema = SchemaFactory.createForClass(Logging);
