// src/sprints/sprints.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { SprintService } from './sprints.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { Roles } from 'src/decorators/roles.decorators';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth("access-token")
@UseGuards(AccessTokenGuard)
@Controller('sprints')
export class SprintsController {
  constructor(private readonly sprintsService: SprintService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  async create(@Body() createSprintDto: CreateSprintDto, @Res() res) {
    try {
      const sprint = await this.sprintsService.create(createSprintDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'Sprint created successfully',
        data: sprint,
        status: HttpStatus.CREATED,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager', 'Employe')
  async findAll(@Res() res) {
    try {
      const sprints = await this.sprintsService.findAll();
      return res.status(HttpStatus.OK).json({
        message: 'Sprints retrieved successfully',
        data: sprints,
        status: HttpStatus.OK,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Get('by-project/:projectId')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager', 'Employe')
  async findByProject(@Param('projectId') projectId: string, @Res() res) {
    try {
      const sprints = await this.sprintsService.findByProject(projectId);
      return res.status(HttpStatus.OK).json({
        message: 'Sprints by project retrieved successfully',
        data: sprints,
        status: HttpStatus.OK,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager', 'Employe')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const sprint = await this.sprintsService.findOne(id);
      return res.status(HttpStatus.OK).json({
        message: 'Sprint retrieved successfully',
        data: sprint,
        status: HttpStatus.OK,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  async update(@Param('id') id: string, @Body() updateSprintDto: UpdateSprintDto, @Res() res) {
    try {
      const sprint = await this.sprintsService.update(id, updateSprintDto);
      return res.status(HttpStatus.OK).json({
        message: 'Sprint updated successfully',
        data: sprint,
        status: HttpStatus.OK,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const sprint = await this.sprintsService.remove(id);
      return res.status(HttpStatus.OK).json({
        message: 'Sprint deleted successfully',
        data: sprint,
        status: HttpStatus.OK,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  }
}
