import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

 
   @Post('')
   async create(@Body() createCategoryDto: CreateCategoryDto, @Res() res) {
     try {
       const newCategory = await this.categoriesService.create(createCategoryDto);
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
       const categories = await this.categoriesService.findAll();
       return res.status(HttpStatus.OK).json({message: 'categories retrieved successfully',
        data:categories, 
        status: HttpStatus.OK
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
        const categorie = await this.categoriesService.findOne(id);
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
   async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Res() res) {
     try {
       const categorie = await this.categoriesService.update(id, updateCategoryDto);
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
       const categorie = await this.categoriesService.remove(id);
        return res.status(HttpStatus.OK).json({message: 'categorie deleted successfully',data:categorie, status: HttpStatus.OK
       
     });} catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({
         data:null, 
         status: HttpStatus.BAD_REQUEST,
         message: error.message} );
       
     }
    
   }
   
}

