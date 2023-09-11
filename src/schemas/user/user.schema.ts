import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ACCOUNT_TYPE, ACCOUNT_STATUS } from 'src/utils/constants';
import { Address, AddressSchema } from '../common/address.schema';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, select: false })
  password?: string;

  @Prop()
  age?: number;

  @Prop()
  phone?: string;

  @Prop({
    type: String,
    enum: Object.keys(ACCOUNT_STATUS),
    default: ACCOUNT_STATUS.ACTIVE,
  })
  status?: ACCOUNT_STATUS;

  @Prop({
    type: String,
    enum: Object.keys(ACCOUNT_TYPE),
    required: true,
    immutable: true, // Immutable means it can not be changed in future once created
  })
  accountType: ACCOUNT_TYPE;

  @Prop({ default: [] })
  social?: string[];

  @Prop({ default: false })
  isEmailVerified?: boolean;

  @Prop({ type: AddressSchema, required: true })
  address: Address;

  @Prop(
    raw({
      reference: { type: String },
      beta: { type: Boolean },
    }),
  )
  metadata: Record<string, any> | any;
}

export type UserDocument = User & Document;

export const USER_MODEL = User.name;

export const UserSchema = SchemaFactory.createForClass(User);
