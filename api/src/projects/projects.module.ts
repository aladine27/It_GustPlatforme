import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { projectSchema } from './entities/project.entity';

import { userSchema } from 'src/users/entities/user.entity';

@Module({
   imports: [MongooseModule.forFeature([{ name: 'projects', schema: projectSchema }]), 
   MongooseModule.forFeature([{ name: 'users', schema: userSchema }])  
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
