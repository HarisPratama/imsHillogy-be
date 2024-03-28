import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ default: '' })
  name: string;

  @Prop({ default: '' })
  profileImage: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'staff' })
  role: string;

  @Prop({ default: '' })
  gender: string;

  @Prop({ default: Date.now() })
  birthDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
