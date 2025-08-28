import { Module } from '@nestjs/common';
import { ApplicationAnalysisService } from './application-analysis.service';
import { ApplicationAnalysisController } from './application-analysis.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { applicationAnalysisSchema } from './entities/application-analysis.entity';
import { applicationSchema } from '../application/entities/application.entity';
import { JobOffreSchema } from 'src/job-offre/entities/job-offre.entity';

@Module({
    imports: [
    MongooseModule.forFeature([
      { name: 'applicationAnalyses', schema: applicationAnalysisSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'applications', schema: applicationSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'jobOffres', schema: JobOffreSchema },
    ]),
  ],
  controllers: [ApplicationAnalysisController],
  providers: [ApplicationAnalysisService],
})
export class ApplicationAnalysisModule {}
