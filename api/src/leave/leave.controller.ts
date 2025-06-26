import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, UseInterceptors, UploadedFile, UseGuards, Req  } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/decorators/roles.decorators';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth("access-token")
@UseGuards(AccessTokenGuard) 
@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}
      //config swager for file
      @Post()
      @ApiConsumes('multipart/form-data')
      @ApiBody({
        schema: {
          type: 'object',
          properties: {
            title:       { type: 'string', description: 'The title of the leave' },
            duration:    { type: 'string', description: 'The duration of the leave' },
            status:      { type: 'string', description: 'The status of the leave' },
            startDate:   { type: 'string', format: 'date-time', description: 'The start date of the leave' },
            endDate:     { type: 'string', format: 'date-time', description: 'The end date of the leave' },
            user:        { type: 'string', description: 'The user of the leave' },
            reason:      { type: 'string', description: 'The reason of the leave' },
            leaveType:   { type: 'string', description: 'The type of the leave' },
            reasonFile:  { type: 'string', format: 'binary', description: 'The reason file of the leave (optional)' },
          },
          required: [
            'title',
            'duration',
            'status',
            'startDate',
            'endDate',
            'user',
            'reason',
            'leaveType'
            // NE PAS inclure reasonFile ici !
          ]
        }
      })
      @UseInterceptors(
        FileInterceptor('reasonFile', {
          storage: diskStorage({
            destination: './uploads/leaves',
            filename: (_request, file, callback) =>
              callback(null, `${new Date().getTime()}-${file.originalname}`)
          })
        })
      )
      @UseGuards(RolesGuard)
      @Roles('Admin', 'Rh', 'Employee', 'Manager')
      async create(
        @Body() createLeaveDto: CreateLeaveDto,
        @Res() res,
        @UploadedFile() reasonFile: Express.Multer.File
      ) {
        try {
          createLeaveDto.reasonFile = reasonFile?.filename;
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
   @UseGuards( RolesGuard)
   @Roles('Admin','Rh','Employee','Manager')
   @Get('/findLeaveByUserId/:user')
   async findLeaveByUserId(@Param('user') user: string, @Res() res) {
  try {
    const userLeave = await this.leaveService.findLeaveByUserId(user);
    return res.status(HttpStatus.OK).json({
      message: 'Leave Associated to user retrieved successfully',
      data: userLeave,
      status: HttpStatus.OK,
    });

    
  } catch (error) {
     return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      });

    
  } 
  }
  @UseGuards( RolesGuard)
  @Roles('Admin','Rh','Employee','Manager')
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
  @UseGuards( RolesGuard)
  @Roles('Admin','Rh','Employee','Manager')
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
  @UseGuards( RolesGuard)
  @Roles('Admin','Rh','Employee','Manager')
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
  @UseGuards( RolesGuard)
  @Roles('Admin','Rh','Employee','Manager')
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
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Rh', 'Employee', 'Manager')
  @Get('/leave-balance/:userId')
  async getLeaveBalance(@Param('userId') userId: string, @Res() res) {
    try {
      const balance = await this.leaveService.getLeaveBalanceForUser(userId);
      return res.status(HttpStatus.OK).json({
        message: 'Leave balance retrieved successfully',
        status: HttpStatus.OK,
        data: balance,
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
