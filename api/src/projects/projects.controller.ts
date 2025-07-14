import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/decorators/roles.decorators';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth("access-token")
@UseGuards(AccessTokenGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

    //config swager for file
    @ApiBody({
      schema: { 
        type: 'object',
        properties: {
        title:{ type: 'string'},
        description:{ type: 'string'},
        duration:{type: 'string'},
        startDate:{type: 'Date'},
        endDate:{type: 'Date'},
        status:{type: 'string'},
        user:{type: 'string'},
        file:{type: 'string', format: 'binary'},
        }
      }
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
      FileInterceptor('file', {
          storage: diskStorage({
          destination: './uploads/projects',
          filename: (_request,file, callback) => 
          callback(null, `${new Date().getTime()}-${file.originalname}`)
          })
      })
    )

  @Post()
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Rh')
  async create(@Body() createProjectDto: CreateProjectDto, @Res() res,@UploadedFile()file: Express.Multer.File) {
    try {
      createProjectDto.file = file?.filename
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
   @Get('/findProjectByUserId/:user')
  async findProjectbyUserId(@Param('user') user: string, @Res() res) {
    try {
       const userProject = await this.projectsService.findProjectByuserId(user);
      return res.status(HttpStatus.OK).json({message: 'Project Associated to user retrieved successfully',
        data:userProject, 
        status: HttpStatus.OK
    });
      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
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
  //config swager for file  
    //config swager for file
      @ApiBody({
        schema: { 
          type: 'object',
          properties: {
          title:{ type: 'string'},
          description:{ type: 'string'},
          duration:{type: 'string'},
          file:{ type: 'string',format: 'binary'},
          startDate:{type: 'Date'},
          endDate:{type: 'Date'},
          status:{type: 'string'},
          user:{type: 'string'},
          }
        }
      })
      @ApiConsumes('multipart/form-data')
      //filConfig
      @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
            destination: './uploads/applications',
            filename: (_request,file, callback) => 
            callback(null, `${new Date().getTime()}-${file.originalname}`)
            })
        })
      )

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Res() res,@UploadedFile()file: Express.Multer.File) {
    try {
      updateProjectDto.file = file?.filename
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
