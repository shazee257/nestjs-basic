import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { MongooseModelsModule } from './schemas/mongoose-model.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'uploads') }),
    MulterModule.registerAsync({ useFactory: () => ({ dest: './uploads' }) }),
    DatabaseModule,
    MongooseModelsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
