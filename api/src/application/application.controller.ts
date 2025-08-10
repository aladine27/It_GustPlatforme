import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/decorators/public.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('application')
@ApiBearerAuth("access-token")
@UseGuards(AccessTokenGuard) 
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
     @UseGuards( RolesGuard)
   @Public()
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
   @UseGuards( RolesGuard)
  @Roles('Admin','Rh')
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
     @UseGuards( RolesGuard)
  @Roles('Admin','Rh')
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
     @UseGuards( RolesGuard)
  @Roles('Admin','Rh')
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
     @UseGuards( RolesGuard)
  @Roles('Admin','Rh')
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
  @Get('by-offer/:jobOffre')
@UseGuards(RolesGuard)
@Roles('Admin','Rh')
async findByOffer(@Param('jobOffre') jobOffre: string, @Res() res) {
  try {
    const applications = await this.applicationService.findByOffer(jobOffre);
    return res.status(HttpStatus.OK).json({
      message: 'Applications retrieved successfully',
      data: applications,
      status: HttpStatus.OK
    });
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      data: null,
      status: HttpStatus.BAD_REQUEST,
      message: error.message
    });
  }
}
}
