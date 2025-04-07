import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('')
  async create(@Body() createProjectDto: CreateProjectDto, @Res() res) {
    try {
      const newProject = await this.projectsService.create(createProjectDto);
      return res.status(HttpStatus.CREATED).json({message: 'Project created successfully',
         status: HttpStatus.CREATED,
         data: newProject});
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null,
         status: HttpStatus.BAD_REQUEST,
         message: error.message});
      
    }
  }
 @Get() 
async findAll( @Res() res) {
    try {
      const newProject = await this.projectsService.findAll();
      return res.status(HttpStatus.OK).json({message: 'Projects retrieved successfully',data:newProject, status: HttpStatus.OK
    });
    }
      catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} 
       
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
       const Project = await this.projectsService.findOne(id);
      return res.status(HttpStatus.OK).json({message: 'Project retrieved successfully',data:Project, status: HttpStatus.OK
    });
      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Res() res) {
    try {
      const Project = await this.projectsService.update(id, updateProjectDto);
      return res.status(HttpStatus.OK).json({message: 'Projects updated successfully',data:Project, status: HttpStatus.OK
      
    });} catch (error) {
       return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
    
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const project = await this.projectsService.remove(id);
       return res.status(HttpStatus.OK).json({message: 'project deleted successfully',data:project, status: HttpStatus.OK
      
    });} catch (error) {
       return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
   
  }
}
