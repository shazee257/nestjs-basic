import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { MongooseModelsModule } from './schemas/mongoose-model.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MongooseModelsModule,
    UsersModule,
    JobsModule,
  ],
})
export class AppModule {}
