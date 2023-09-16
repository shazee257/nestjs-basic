import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLES } from 'src/utils/constants';
const aggregateMongoosePaginate = require('mongoose-aggregate-paginate-v2');

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true, select: false })
  password?: string;

  @Prop({ type: String, enum: Object.values(ROLES), required: true })
  role: ROLES;

  @Prop({ required: true })
  deviceToken: string;
}

export type UserDocument = User & Document;

export const USER_MODEL = User.name;

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(aggregateMongoosePaginate);
