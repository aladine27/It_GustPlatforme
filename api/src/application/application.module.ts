import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { applicationSchema } from './entities/application.entity';
import { JobOffreSchema } from 'src/job-offre/entities/job-offre.entity';

@Module({
   imports: [MongooseModule.forFeature([{ name: 'applications', schema: applicationSchema }]),
  MongooseModule.forFeature([{ name: 'jobOffres', schema: JobOffreSchema }])],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
