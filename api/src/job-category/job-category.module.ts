import { Module } from '@nestjs/common';
import { JobCategoryService } from './job-category.service';
import { JobCategoryController } from './job-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobCategorySchema } from './entities/job-category.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'jobCategories', schema: JobCategorySchema }])],
  controllers: [JobCategoryController],
  providers: [JobCategoryService],
})
export class JobCategoryModule {}
