import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { JobCategoryService } from './job-category.service';
import { CreateJobCategoryDto } from './dto/create-job-category.dto';
import { UpdateJobCategoryDto } from './dto/update-job-category.dto';

@Controller('job-category')
export class JobCategoryController {
  constructor(private readonly jobCategoryService: JobCategoryService) {}

 
    @Post('')
    async create(@Body() createCategoryDto: CreateJobCategoryDto, @Res() res) {
      try {
        const newCategory = await this.jobCategoryService.create(createCategoryDto);
        return res.status(HttpStatus.CREATED).json({message: 'newCategory created successfully',
           status: HttpStatus.CREATED,
           data: newCategory});
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
        const categories = await this.jobCategoryService.findAll();
        return res.status(HttpStatus.OK).json({message: 'categories retrieved successfully',data:categories, status: HttpStatus.OK
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
         const categorie = await this.jobCategoryService.findOne(id);
        return res.status(HttpStatus.OK).json({message: 'categorie retrieved successfully',data:categorie, status: HttpStatus.OK
      });
        
      } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          data:null, 
          status: HttpStatus.BAD_REQUEST,
          message: error.message} );
        
      }
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateJobCategoryDto, @Res() res) {
      try {
        const categorie = await this.jobCategoryService.update(id, updateCategoryDto);
        return res.status(HttpStatus.OK).json({message: 'categorie updated successfully',data:categorie, status: HttpStatus.OK
        
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
        const categorie = await this.jobCategoryService.remove(id);
         return res.status(HttpStatus.OK).json({message: 'categorie deleted successfully',data:categorie, status: HttpStatus.OK
        
      });} catch (error) {
         return res.status(HttpStatus.BAD_REQUEST).json({
          data:null, 
          status: HttpStatus.BAD_REQUEST,
          message: error.message} );
        
      }
     
    }
    
}
