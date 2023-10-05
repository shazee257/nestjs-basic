import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LOGGING_MODEL, Logging, LoggingDocument } from '../schemas/logging.schema ';
import { Model } from 'mongoose';
import { logging } from 'src/common/interfaces';

@Injectable()
export class LoggingService {
    constructor(@InjectModel(LOGGING_MODEL) private readonly loggingModel: Model<LoggingDocument>) { }

    async create(logging: logging): Promise<Logging> {
        return await this.loggingModel.create(logging);
    }

    async logErrorToDatabase(error: any, statusCode: number): Promise<void> {
        const errorLog = new this.loggingModel({
            statusCode,
            message: error.message,
            error: error.name,
            stack: error.stack,
        });

        await errorLog.save();
    }

}
