import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus,UseGuards } from '@nestjs/common';
import { LeaveTypeService } from './leave-type.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { Roles } from 'src/decorators/roles.decorators';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth("access-token")
@UseGuards(AccessTokenGuard) 
@Controller('leave-type')
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) {}

  @Post()
  @UseGuards( RolesGuard)
  @Roles('Admin','Rh')
  async create(@Body() createLeaveTypeDto: CreateLeaveTypeDto, @Res() res) {
    try {
      const newLeaveType = await this.leaveTypeService.create(createLeaveTypeDto);
      return res.status(HttpStatus.CREATED).json({message: 'newLeaveType created successfully',
         status: HttpStatus.CREATED,
         data: newLeaveType});  
      
    } catch (error) {
           return res.status(HttpStatus.BAD_REQUEST).json({
             data:null,
              status: HttpStatus.BAD_REQUEST,
              message: error.message});
           
         }
  }

  @Get()
  @UseGuards( RolesGuard)
  @Roles('Admin','Rh','Employe','Manager')
  async findAll( @Res() res) {
    try {
      const leaveTypes = await this.leaveTypeService.findAll();
      return res.status(HttpStatus.OK).json({message: 'leaveTypes retrieved successfully'
        ,data:leaveTypes,
        status: HttpStatus.OK});
       
    } catch (error)  {
       return res.status(HttpStatus.BAD_REQUEST).json({
         data:null, 
         status: HttpStatus.BAD_REQUEST,
         message: error.message} 
        
       );
     }
  }

  @Get(':id')
  @UseGuards( RolesGuard)
  @Roles('Admin','Rh','Employe','Manager')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const leaveType = await this.leaveTypeService.findOne(id);
      return res.status(HttpStatus.OK).json({message: 'leaveType retrieved successfully',
        data:leaveType,
       status: HttpStatus.OK
    });

      
    } catch (error){
       return res.status(HttpStatus.BAD_REQUEST).json({
         data:null, 
         status: HttpStatus.BAD_REQUEST,
         message: error.message} );
       
     }
  }

  @Patch(':id')
  @UseGuards( RolesGuard)
  @Roles('Admin','Rh')
  async update(@Param('id') id: string, @Body() updateLeaveTypeDto: UpdateLeaveTypeDto, @Res() res) {
    try {
      const leaveType = await this.leaveTypeService.update(id, updateLeaveTypeDto);
      return res.status(HttpStatus.OK).json({message: 'leaveType updated successfully',data:leaveType, status: HttpStatus.OK
      
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
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const leaveType = await this.leaveTypeService.remove(id);
      return res.status(HttpStatus.OK).json({message: 'leaveType deleted successfully',
        data:leaveType, 
        status: HttpStatus.OK
      
    });
      
    } catch (error){
        return res.status(HttpStatus.BAD_REQUEST).json({
         data:null, 
         status: HttpStatus.BAD_REQUEST,
         message: error.message} );
       
     }
  }
}
