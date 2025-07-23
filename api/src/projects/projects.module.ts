import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { projectSchema } from './entities/project.entity';

import { userSchema } from 'src/users/entities/user.entity';
import { SprintSchema } from 'src/sprints/entities/sprint.entity';
import { TeamSchema } from 'src/teams/entities/team.entity';
import { taskSchema } from 'src/tasks/entities/task.entity';

@Module({
   imports: [
   MongooseModule.forFeature([
      { name: 'projects', schema: projectSchema },
      { name: 'users', schema: userSchema },
      { name: 'sprints', schema: SprintSchema },
      { name: 'teams', schema: TeamSchema },
      {name: 'tasks', schema: taskSchema },
    ]),
  ],
  exports: [MongooseModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
