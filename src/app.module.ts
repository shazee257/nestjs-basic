import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { MongooseModelsModule } from './schemas/mongoose-model.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true // like PRODUCT=app.${APP_NAME} in environment variables
    }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'uploads') }),
    MulterModule.registerAsync({ useFactory: () => ({ dest: './uploads' }) }),
    DatabaseModule,
    MongooseModelsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
