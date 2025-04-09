import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}
      //config swager for file
      @ApiBody({
        schema: { 
          type: 'object',
          properties: {
          title:{ type: 'string'},
          duration:{type: 'string'},
          status:{type: 'string'},
          startDate:{type: 'Date'},
          endDate:{type: 'Date'},
          user:{type: 'string'},
          reason:{type: 'string'},
          reasonFile:{type: 'string', format: 'binary'},
          }
        }
      })
      @ApiConsumes('multipart/form-data')
      //filConfig
      @UseInterceptors(
        FileInterceptor('reasonFile', {
            storage: diskStorage({
            destination: './uploads/leaves',
            filename: (_request,reasonFile, callback) => 
            callback(null, `${new Date().getTime()}-${reasonFile.originalname}`)
            })
        })
      )

  @Post()
  async create(@Body() createLeaveDto: CreateLeaveDto, @Res() res,@UploadedFile()reasonFile: Express.Multer.File) {
   try {
      createLeaveDto.reasonFile = reasonFile?.filename
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
         //config swager for file
      @ApiBody({
        schema: { 
          type: 'object',
          properties: {
          title:{ type: 'string'},
          duration:{type: 'string'},
          status:{type: 'string'},
          startDate:{type: 'Date'},
          endDate:{type: 'Date'},
          user:{type: 'string'},
          reason:{type: 'string'},
          reasonFile:{type: 'string', format: 'binary'},
          }
        }
      })
      @ApiConsumes('multipart/form-data')
      //filConfig
      @UseInterceptors(
        FileInterceptor('reasonFile', {
            storage: diskStorage({
            destination: './uploads/leaves',
            filename: (_request,reasonFile, callback) => 
            callback(null, `${new Date().getTime()}-${reasonFile.originalname}`)
            })
        })
      )
  

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLeaveDto: UpdateLeaveDto , @Res() res,@UploadedFile()reasonFile: Express.Multer.File) {
    try {
      updateLeaveDto.reasonFile = reasonFile?.filename
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
