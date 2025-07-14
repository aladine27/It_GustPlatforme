import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISprint } from './interfaces/sprint.interface';
import { IProject } from 'src/projects/interfaces/project.interface';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { ITask } from 'src/tasks/interfaces/task.interface';

@Injectable()
export class SprintService {
  constructor(
    @InjectModel('sprints') private sprintModel: Model<ISprint>,
    @InjectModel('projects') private projectModel: Model<IProject>,

  ) {}

  async create(createSprintDto: CreateSprintDto): Promise<ISprint> {
    const newSprint = new this.sprintModel(createSprintDto);
    await this.projectModel.updateOne(
      { _id: createSprintDto.project },
      { $push: { sprints: newSprint._id } }
    );
    return newSprint.save();
  }

  async findAll(): Promise<ISprint[]> {
    return this.sprintModel.find().populate('project');
  }

  async findByProject(projectId: string): Promise<ISprint[]> {
    return this.sprintModel.find({ project: projectId }).populate('project');
  }

  async findOne(id: string): Promise<ISprint> {
    const sprint = await this.sprintModel.findById(id).populate('project');
    if (!sprint) throw new NotFoundException('Sprint not found');
    return sprint;
  }

  async update(id: string, updateSprintDto: UpdateSprintDto): Promise<ISprint> {
    const sprint = await this.sprintModel.findByIdAndUpdate(id, updateSprintDto, { new: true });
    if (!sprint) throw new NotFoundException('Sprint not found');
    return sprint;
  }

  async remove(id: string): Promise<ISprint> {
    const sprint = await this.sprintModel.findByIdAndDelete(id);
    if (!sprint) throw new NotFoundException('Sprint not found');
    await this.projectModel.updateOne(
      { _id: sprint.project },
      { $pull: { sprints: sprint._id } }
    );
    return sprint;
  }


}
