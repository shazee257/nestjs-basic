import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AUTH_PROVIDER, ROLES } from 'src/common/constants';

const aggregateMongoosePaginate = require('mongoose-aggregate-paginate-v2');

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop()
  googleId: string;

  @Prop()
  facebookId: string;

  @Prop({ type: String, enum: Object.values(AUTH_PROVIDER), default: AUTH_PROVIDER.LOCAL })
  provider: AUTH_PROVIDER;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  fullName: string;

  @Prop()
  dob: Date;

  @Prop()
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop()
  image: string;

  @Prop({ type: String, enum: Object.values(ROLES), required: true })
  role: ROLES;

  @Prop({ required: true })
  deviceToken: string;
}

export type UserDocument = User & Document;

export const USER_MODEL = User.name;

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(aggregateMongoosePaginate);
