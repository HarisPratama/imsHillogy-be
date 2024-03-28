import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ItemThresholdDocument = HydratedDocument<Threshold>;

@Schema()
export class Threshold {
  @Prop()
  value: number;
}

export const ThresholdSchema = SchemaFactory.createForClass(Threshold);
