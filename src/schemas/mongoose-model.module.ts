import { Global, Module } from '@nestjs/common';
import { USER_MODEL, UserSchema } from './user/user.schema';
import { JOB_MODEL, JobSchema } from './job/job.schema';
import { MongooseModule } from '@nestjs/mongoose';

const MODELS = [
  { name: USER_MODEL, schema: UserSchema },
  { name: JOB_MODEL, schema: JobSchema },
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  exports: [MongooseModule],
})
export class MongooseModelsModule {}
