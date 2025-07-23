import { Module } from '@nestjs/common';
import { SprintService } from './sprints.service';
import { SprintsController } from './sprints.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SprintSchema } from './entities/sprint.entity';
import { projectSchema } from 'src/projects/entities/project.entity';
import { taskSchema } from 'src/tasks/entities/task.entity';

@Module({
   imports: [
    MongooseModule.forFeature([{ name: 'sprints', schema: SprintSchema }]),
     MongooseModule.forFeature([{ name: 'projects', schema: projectSchema }]),
     MongooseModule.forFeature([{ name: 'tasks', schema: taskSchema }]),

  ],
  controllers: [SprintsController],
  providers: [SprintService],
})
export class SprintsModule {}
