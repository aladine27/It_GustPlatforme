import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Roles } from 'src/decorators/roles.decorators';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Employe } from 'src/employe/entities/employe.entity';

@ApiBearerAuth("access-token")
@UseGuards(AccessTokenGuard) 
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()  
  @UseGuards( RolesGuard)
  @Roles('Admin','Rh')
  async create(@Body() createEventDto: CreateEventDto, @Res() res) {
    try {
      
      const newEvent = await this.eventService.create(createEventDto);
      
      return res.status(HttpStatus.CREATED).json({
        message: 'Event created successfully',
        status: HttpStatus.CREATED,
        data: newEvent
      });
    } catch (error) { 
      
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      });
    }
    
  }
  @UseGuards( RolesGuard)
   @Roles('Admin','Rh','Employe','Manager')
  @Get('/geteventbyUserID/:user')
  async findEventByUser(@Param('user') user: string, @Res() res) {
    try {
      const userEvents = await this.eventService.getEventByUserID(user);
      return res.status(HttpStatus.OK).json({
        message: 'EventsByUser retrieved successfully',
        data: userEvents,
        status: HttpStatus.OK
      });      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      });
      
    }
  }
  @UseGuards( RolesGuard)
  @Roles('Admin','Rh','Employe','Manager')
  @Get()
  async findAll(@Req() req, @Res() res) {
   
    try {
      const events = await this.eventService.findAll();
      
      return res.status(HttpStatus.OK).json({
        message: 'Events retrieved successfully',
        data: events,
        status: HttpStatus.OK
      });
    } catch (error) {
     
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      });
    }
  }

  @UseGuards( RolesGuard)
  @Roles('Admin','Rh','Employe','Manager')
  @Get(':id')
  async findOne(@Param('id') id: string,@Res() res) {
    try {
      const event = await this.eventService.findOne(id);
      return res.status(HttpStatus.OK).json({
        message: 'Event retrieved successfully',
        data: event,
        status: HttpStatus.OK
      });
      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      });
      
    }
  }

  @Patch(':id')
  @UseGuards(RolesGuard) // Ensure RolesGuard is applied
  @Roles('Admin','Rh')
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto,@Res() res) {
   try {
    const event = await this.eventService.update(id, updateEventDto);
    return res.status(HttpStatus.OK).json({
      message: 'Event updated successfully',
      data: event,
      status: HttpStatus.OK
    });
    
   } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      });
      
    }
    
   }
  
   @UseGuards(RolesGuard) // Ensure RolesGuard is applied
   @Roles('Admin','Rh')
  @Delete(':id')
  async remove(@Param('id') id: string,@Res() res) {
    try {
      const event = await this.eventService.remove(id);
      return res.status(HttpStatus.OK).json({ 
        message: 'Event deleted successfully',
        data: event,
        status: HttpStatus.OK
      });
        
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      });
      
    }
  }

}
