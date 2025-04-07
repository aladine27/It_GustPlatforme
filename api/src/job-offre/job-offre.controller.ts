import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { JobOffreService } from './job-offre.service';
import { CreateJobOffreDto } from './dto/create-job-offre.dto';
import { UpdateJobOffreDto } from './dto/update-job-offre.dto';

@Controller('joboffre')
export class JobOffreController {
  constructor(private readonly jobOffreService: JobOffreService) {}

  @Post()
  async create(@Body() createJobOffreDto: CreateJobOffreDto,@Res() res) {
    try {
      const newJobOffre = await this.jobOffreService.create(createJobOffreDto);
      return res.status(HttpStatus.CREATED).json({message: 'JobOffre created successfully',
         status: HttpStatus.CREATED,
         data: newJobOffre});

      
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
