import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { taskSchema } from './entities/task.entity';
import { projectSchema } from 'src/projects/entities/project.entity';
import { SprintSchema } from 'src/sprints/entities/sprint.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'tasks', schema: taskSchema }])
    ,MongooseModule.forFeature([{ name: 'projects', schema: projectSchema }])
    ,MongooseModule.forFeature([{ name: 'users', schema: projectSchema }]),
    MongooseModule.forFeature([{ name: 'sprints', schema: SprintSchema }]) 
],
 exports: [MongooseModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
