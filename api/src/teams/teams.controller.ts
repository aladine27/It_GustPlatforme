import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Roles } from 'src/decorators/roles.decorators';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth("access-token")
@UseGuards(AccessTokenGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamService: TeamsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager')
  async create(@Body() createTeamDto: CreateTeamDto, @Res() res) {
    try {
      const team = await this.teamService.create(createTeamDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'Team created successfully',
        data: team,
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
      const teams = await this.teamService.findAll();
      return res.status(HttpStatus.OK).json({
        message: 'Teams retrieved successfully',
        data: teams,
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

  @Get('/by-project/:projectId')
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Manager', 'Employe')
  async findByProject(@Param('projectId') projectId: string, @Res() res) {
    try {
      const teams = await this.teamService.findByProject(projectId);
      return res.status(HttpStatus.OK).json({
        message: 'Teams by project retrieved successfully',
        data: teams,
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
      const team = await this.teamService.findOne(id);
      return res.status(HttpStatus.OK).json({
        message: 'Team retrieved successfully',
        data: team,
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
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto, @Res() res) {
    try {
      const team = await this.teamService.update(id, updateTeamDto);
      return res.status(HttpStatus.OK).json({
        message: 'Team updated successfully',
        data: team,
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
      const team = await this.teamService.remove(id);
      return res.status(HttpStatus.OK).json({
        message: 'Team deleted successfully',
        data: team,
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
