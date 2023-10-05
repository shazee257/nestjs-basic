import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODEL, UserSchema } from './user.schema';
import { LOGGING_MODEL, LoggingSchema } from './logging.schema ';

const MODELS = [
  { name: USER_MODEL, schema: UserSchema },
  { name: LOGGING_MODEL, schema: LoggingSchema },
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  exports: [MongooseModule],
})
export class MongooseModelsModule { }
