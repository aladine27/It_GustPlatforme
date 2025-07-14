import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITeam } from './interfaces/team.interface';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { IProject } from '../projects/interfaces/project.interface';
import { IUser } from 'src/users/interfaces/user.interface';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel('teams') private teamModel: Model<ITeam>,
    @InjectModel('projects') private projectModel: Model<IProject>,
    @InjectModel('users') private userModel: Model<IUser>
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<ITeam> {
    const newTeam = new this.teamModel(createTeamDto);
    await this.projectModel.updateOne(
      { _id: createTeamDto.project },
      { $push: { teams: newTeam._id } }
    );
     if (createTeamDto.employeeList && createTeamDto.employeeList.length) {
    await this.userModel.updateMany(
      { _id: { $in: createTeamDto.employeeList } },
      { $push: { teams: newTeam._id } }
    );
  }
    return newTeam.save();
  }

  async findAll(): Promise<ITeam[]> {
    return this.teamModel.find().populate('employeeList project');
  }

  async findByProject(projectId: string): Promise<ITeam[]> {
    return this.teamModel.find({ project: projectId }).populate('employeeList project');
  }

  async findOne(id: string): Promise<ITeam> {
    const team = await this.teamModel.findById(id).populate('employeeList project');
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<ITeam> {
    const team = await this.teamModel.findByIdAndUpdate(id, updateTeamDto, { new: true });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async remove(id: string): Promise<ITeam> {
    const team = await this.teamModel.findByIdAndDelete(id);
    if (!team) throw new NotFoundException('Team not found');
    await this.projectModel.updateOne(
      { _id: team.project },
      { $pull: { teams: team._id } }
    );
    if (team.employeeList && team.employeeList.length) {
    await this.userModel.updateMany(
      { _id: { $in: team.employeeList } },
      { $pull: { teams: team._id } }
    );
  }
    return team;
  }
}
