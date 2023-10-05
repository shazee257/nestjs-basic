import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { DatabaseModule } from './modules/database/database.module';
import { MongooseModelsModule } from './modules/schemas/mongoose-model.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggingModule } from './modules/logging/logging.module';
import { APP_FILTER } from '@nestjs/core';
import { ErrorLoggingFilter } from './common/exception-filters/error-logging.filter';

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
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorLoggingFilter, // Register the custom error logging filter globally
    },
  ]
})
export class AppModule { }
