import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { applicationSchema } from './entities/application.entity';

@Module({
   imports: [MongooseModule.forFeature([{ name: 'applications', schema: applicationSchema }])],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
