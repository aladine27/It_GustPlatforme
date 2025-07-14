import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamSchema } from './entities/team.entity';
import { projectSchema } from 'src/projects/entities/project.entity';
import { userSchema } from 'src/users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'teams', schema: TeamSchema }]),
     MongooseModule.forFeature([{ name: 'projects', schema: projectSchema }]),
     MongooseModule.forFeature([{ name: 'users', schema: userSchema }])
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
