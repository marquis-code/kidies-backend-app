import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  sender: 'customer' | 'admin';

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'text' })
  type: string;

  @Prop()
  attachment?: string;

  @Prop()
  customerName?: string;

  @Prop()
  customerEmail?: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
