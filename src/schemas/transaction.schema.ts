import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop()
  itemId: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  revenue: number;

  @Prop()
  quantity: number;

  @Prop()
  price: number;

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
