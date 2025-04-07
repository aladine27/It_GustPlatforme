import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { projectSchema } from './entities/project.entity';
import { categorySchema } from 'src/categories/entities/category.entity';

@Module({
   imports: [MongooseModule.forFeature([{ name: 'projects', schema: projectSchema }]), 

   
   MongooseModule.forFeature([{ name: 'categories', schema: categorySchema }])
  
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
