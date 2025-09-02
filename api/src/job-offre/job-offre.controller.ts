import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { JobOffreService } from './job-offre.service';
import { CreateJobOffreDto } from './dto/create-job-offre.dto';
import { UpdateJobOffreDto } from './dto/update-job-offre.dto';
import { Roles } from 'src/decorators/roles.decorators';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
@ApiBearerAuth("access-token")
@UseGuards(AccessTokenGuard) 
@Controller('joboffre')
export class JobOffreController {
  constructor(private readonly jobOffreService: JobOffreService) {}

  @Post()
  @UseGuards( RolesGuard)
  @Roles('Admin','Rh')
  async create(@Body() createJobOffreDto: CreateJobOffreDto,@Res() res) {
    try {
      const newJobOffre = await this.jobOffreService.create(createJobOffreDto);

      return res.status(HttpStatus.CREATED).json({
        message: 'JobOffre created successfully',
        status: HttpStatus.CREATED,
        data: newJobOffre});

      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null,
         status: HttpStatus.BAD_REQUEST,
         message: error.message});

      
    }
  }
  @Get('/findJobOffreByUserId/:user')
  @UseGuards( RolesGuard)
  @Roles('Admin','Rh')
  async findJobOffrebyUserId(@Param('user') user: string, @Res() res) {
  try {
    const userJobOffre = await this.jobOffreService.findJobOffreByuserId(user);
    return res.status(HttpStatus.OK).json({
      message:'JobOffre Associated to user retreived successfully',
      data:userJobOffre,
      status: HttpStatus.OK
    });
    
    
  }
  catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message:error.message,
      data:null, 
      status: HttpStatus.OK
    });
  }
  }
  
  @Get('/getJobOffreByjobCategory/:jobCategory')
  @UseGuards( RolesGuard)
    @Public()
  async findJobOffreByJobCategory(@Param('jobCategory') jobCategory: string, @Res() res) {
    try {
      const jobOffre = await this.jobOffreService.getJobOffreByjobCategory(jobCategory);
      return res.status(HttpStatus.OK).json({
        message:'JobOffre Associated to jobCategory retreived successfully',
        data:jobOffre,
        status: HttpStatus.OK
      });
    }
    catch(error){
      return res.status(HttpStatus.BAD_REQUEST).json(
        {
          data: null,
          status: HttpStatus.BAD_REQUEST,
          message: error.message
        }
      )

    }

  }



  @Get()
  @UseGuards( RolesGuard)
     @Public()
  async findAll(@Res() res) {
    try {
      const jobOffres = await this.jobOffreService.findAll();
      return res.status(HttpStatus.OK).json({message: 'JobOffres retrieved successfully',data:jobOffres, status: HttpStatus.OK
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
  @UseGuards( RolesGuard)
     @Public()
  async findOne(@Param('id') id: string,@Res() res) {
  try {
    const jobOffre = await this.jobOffreService.findOne(id);
    return res.status(HttpStatus.OK).json({message: 'JobOffre retrieved successfully',data:jobOffre, status: HttpStatus.OK
  });
    
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      data:null, 
      status: HttpStatus.BAD_REQUEST,
      message: error.message} );
    
  }
  }

  @Patch(':id')
  @UseGuards( RolesGuard)
  @Roles('Admin','Rh')
  async update(@Param('id') id: string, @Body() updateJobOffreDto: UpdateJobOffreDto,@Res() res) {
  try {
    const jobOffre = await this.jobOffreService.update(id, updateJobOffreDto);
    return res.status(HttpStatus.OK).json({message: 'JobOffre updated successfully',data:jobOffre, status: HttpStatus.OK
    
  });} catch (error) {
     return res.status(HttpStatus.BAD_REQUEST).json({     
    
      data:null, 
      status: HttpStatus.BAD_REQUEST,
      message: error.message} );
  }
}

  @Delete(':id')
  @UseGuards( RolesGuard)
  @Roles('Admin','Rh')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const jobOffre = await this.jobOffreService.remove(id); 
      return res.status(HttpStatus.OK).json({message: 'JobOffre deleted successfully',data:jobOffre, status: HttpStatus.OK  });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
  }
}
