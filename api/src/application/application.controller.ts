import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  async create(@Body() createApplicationDto: CreateApplicationDto,@Res() res) {
    try {
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

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto, @Res() res) {
    try {
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
