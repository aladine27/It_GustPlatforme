import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}
   //config swager for file
      @ApiBody({
        schema: { 
          type: 'object',
          properties: {
          cvFile:{ type: 'string',format: 'binary'},
          jobOffre:{ type: 'string'},
          }
        }
      })
      @ApiConsumes('multipart/form-data')
      //filConfig
      @UseInterceptors(
        FileInterceptor('cvFile', {
            storage: diskStorage({
            destination: './uploads/applications',
            filename: (_request,cvFile, callback) => 
            callback(null, `${new Date().getTime()}-${cvFile.originalname}`)
            })
        })
      )

  @Post()
  async create(@Body() createApplicationDto: CreateApplicationDto,@Res() res,@UploadedFile()file: Express.Multer.File) {
    try {
      createApplicationDto.cvFile = file?.filename
      const newApplication = await this.applicationService.create(createApplicationDto);
      return res.status(HttpStatus.CREATED).json({message: 'Application created successfully',
         status: HttpStatus.CREATED,
         data: newApplication});
      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null,
         status: HttpStatus.BAD_REQUEST,
         message: error.message});
      
      
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      const applications = await this.applicationService.findAll();
      return res.status(HttpStatus.OK).json({
        message: 'Applications retrieved successfully',
        data:applications, 
        status: HttpStatus.OK
      });
      

    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} 
       
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string,@Res() res) {
    try {
      const application = await this.applicationService.findOne(id);
      return res.status(HttpStatus.OK).json({
        message: 'Application retrieved successfully',
        data:application, 
        status: HttpStatus.OK
      });
      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
  }
     //config swager for file
      @ApiBody({
        schema: { 
          type: 'object',
          properties: {
          cvFile:{ type: 'string',format: 'binary'},
          jobOffre:{ type: 'string'},
          }
        }
      })
      @ApiConsumes('multipart/form-data')
      //filConfig
      @UseInterceptors(
        FileInterceptor('cvFile', {
            storage: diskStorage({
            destination: './uploads/applications',
            filename: (_request,cvFile, callback) => 
            callback(null, `${new Date().getTime()}-${cvFile.originalname}`)
            })
        })
      )

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto, @Res() res,
@UploadedFile()file: Express.Multer.File) {
    try {
      updateApplicationDto.cvFile = file?.filename
      const application = await this.applicationService.update(id, updateApplicationDto);
      return res.status(HttpStatus.OK).json({message: 'Application updated successfully',
        data:application,
        status: HttpStatus.OK
      
    });
      
    } catch (error) {
       return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string,@Res() res) {
    try {
      const application = await this.applicationService.remove(id);
      return res.status(HttpStatus.OK).json({message: 'Application deleted successfully',
        data:application,
        status: HttpStatus.OK
         });

      
    } catch (error) {
       return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
  }
}
