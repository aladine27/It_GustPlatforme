import { Module } from '@nestjs/common';
import { JobOffreService } from './job-offre.service';
import { JobOffreController } from './job-offre.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobOffreSchema } from './entities/job-offre.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'jobOffres', schema: JobOffreSchema }])],
  controllers: [JobOffreController],
  providers: [JobOffreService],
})
export class JobOffreModule {}
