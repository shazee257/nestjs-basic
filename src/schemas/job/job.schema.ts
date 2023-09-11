import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { JOB_TYPE } from 'src/utils/constants';
import { Address, AddressSchema } from '../common/address.schema';
import { Types } from 'mongoose';
import { USER_MODEL, User } from '../user/user.schema';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Job {
  @Prop({
    type: Types.ObjectId,
    ref: USER_MODEL,
    required: true,
  })
  employer: Types.ObjectId | User;

  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  experience: number;

  @Prop({ default: [] })
  tags?: string[];

  @Prop()
  salary?: string;

  @Prop({
    type: String,
    enum: Object.keys(JOB_TYPE),
    default: JOB_TYPE.FULL_TIME,
  })
  type: JOB_TYPE;

  @Prop({ type: AddressSchema, required: true })
  location: Address;
}

export type JobDocument = Job & Document;

export const JOB_MODEL = Job.name;

export const JobSchema = SchemaFactory.createForClass(Job);
