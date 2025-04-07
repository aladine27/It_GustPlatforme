import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { LeaveTypeService } from './leave-type.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';

@Controller('leave-type')
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) {}

  @Post()
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
