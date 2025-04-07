import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { FraiTypeService } from './frai-type.service';
import { CreateFraiTypeDto } from './dto/create-frai-type.dto';
import { UpdateFraiTypeDto } from './dto/update-frai-type.dto';

@Controller('frai-type')
export class FraiTypeController {
  constructor(private readonly fraiTypeService: FraiTypeService) {}

  @Post()
  async create(@Body() createFraiTypeDto: CreateFraiTypeDto, @Res() res) {
    try {
      const newFraiType = await this.fraiTypeService.create(createFraiTypeDto);
      return res.status(HttpStatus.CREATED).json({message: 'newFraiType created successfully',
         status: HttpStatus.CREATED,
         data: newFraiType});
      
    } catch (error)  {
           return res.status(HttpStatus.BAD_REQUEST).json({
             data:null,
              status: HttpStatus.BAD_REQUEST,
              message: error.message});
           
         }
  }

  @Get()
  async findAll( @Res() res) {
   try {
     const fraiTypes = await this.fraiTypeService.findAll();
     return res.status(HttpStatus.OK).json({message: 'fraiTypes retrieved successfully',
      data:fraiTypes, 
      status: HttpStatus.OK
   });
   } catch (error)  {
       return res.status(HttpStatus.BAD_REQUEST).json({
         data:null,
          status: HttpStatus.BAD_REQUEST,
          message: error.message});
       
     }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const fraiType = await this.fraiTypeService.findOne(id);
      
    } catch (error)  {
       return res.status(HttpStatus.BAD_REQUEST).json({
         data:null,
          status: HttpStatus.BAD_REQUEST,
          message: error.message});
       
     }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFraiTypeDto: UpdateFraiTypeDto, @Res() res) {
    try {
      const fraiType = await this.fraiTypeService.update(id, updateFraiTypeDto);
      return res.status(HttpStatus.OK).json({message: 'fraiType updated successfully',data:fraiType, status: HttpStatus.OK
      
    });} 
     catch (error) {
       return res.status(HttpStatus.BAD_REQUEST).json({
         data:null,
          status: HttpStatus.BAD_REQUEST,
          message: error.message});
       
     }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const fraiType = await this.fraiTypeService.remove(id);
      return res.status(HttpStatus.OK).json({message: 'fraiType deleted successfully',
        data:fraiType, 
        status: HttpStatus.OK
      
    });} 
     catch (error) {
       return res.status(HttpStatus.BAD_REQUEST).json({
         data:null,
          status: HttpStatus.BAD_REQUEST,
          message: error.message});
       
     }
  }
}
