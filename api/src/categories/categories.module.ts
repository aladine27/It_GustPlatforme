import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { categorySchema } from './entities/category.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'categories', schema: categorySchema }])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}



