import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  async create(@Body() createLeaveDto: CreateLeaveDto, @Res() res) {
   try {
      const newLeave = await this.leaveService.create(createLeaveDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'Leave created successfully',
        status: HttpStatus.CREATED,
        data: newLeave,
      });
    
   } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
    
   }
  

  @Get()
  async findAll(@Res() res) {
    try {
      const leaves = await this.leaveService.findAll();
      return res.status(HttpStatus.OK).json({
        message: 'Leaves retrieved successfully',
        status: HttpStatus.OK,
        data: leaves,
      });

      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
      
    }
  } 

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
   try {
      const leave = await this.leaveService.findOne(id);
      return res.status(HttpStatus.OK).json({
        message: 'Leave retrieved successfully',
        status: HttpStatus.OK,
        data: leave,
      });
    
   } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
    
   }
  

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLeaveDto: UpdateLeaveDto , @Res() res) {
    try {
      const leave = await this.leaveService.update(id, updateLeaveDto);
      return res.status(HttpStatus.OK).json({
        message: 'Leave updated successfully',
        status: HttpStatus.OK,
        data: leave,
      });

      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
      
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string,@Res() res) {
    try {
      const leave = await this.leaveService.remove(id);
      return res.status(HttpStatus.OK).json({
        message: 'Leave deleted successfully',
        status: HttpStatus.OK,
        data: leave,
      });

      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
      
    }
  }
}
