import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { EventTypeService } from './event-type.service';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';

@Controller('event-type')
export class EventTypeController {
  constructor(private readonly eventTypeService: EventTypeService) {}

  @Post()
  async create(@Body() createEventTypeDto: CreateEventTypeDto, @Res() res) {
   try {
    const newEventType = await this.eventTypeService.create(createEventTypeDto);
    return res.status(HttpStatus.CREATED).json({message: 'EventType created successfully',
       status: HttpStatus.CREATED,
       data: newEventType});
    
   } catch (error){
         return res.status(HttpStatus.BAD_REQUEST).json({
           data:null,
            status: HttpStatus.BAD_REQUEST,
            message: error.message});
         
       }
  }

  @Get()
  async findAll( @Res() res) {
    try {
      const eventTypes = await this.eventTypeService.findAll();
      return res.status(HttpStatus.OK).json({message: 'EventTypes retrieved successfully',data:eventTypes, status: HttpStatus.OK
    });
      
    } catch (error){
         return res.status(HttpStatus.BAD_REQUEST).json({
           data:null,
            status: HttpStatus.BAD_REQUEST,
            message: error.message});
         
       }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const eventType = await this.eventTypeService.findOne(id);
      return res.status(HttpStatus.OK).json({message: 'EventType retrieved successfully',data:eventType, status: HttpStatus.OK
    });
      
    } catch (error) {
         return res.status(HttpStatus.BAD_REQUEST).json({
           data:null,
            status: HttpStatus.BAD_REQUEST,
            message: error.message});
         
       }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEventTypeDto: UpdateEventTypeDto, @Res() res) {
    try {
      const eventType = await this.eventTypeService.update(id, updateEventTypeDto);
      return res.status(HttpStatus.OK).json({message: 'EventType updated successfully',
        data:eventType, 
        status: HttpStatus.OK
      
    });
      
    } catch (error) {
         return res.status(HttpStatus.BAD_REQUEST).json({
           data:null,
            status: HttpStatus.BAD_REQUEST,
            message: error.message});
         
       }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
   try {
    const eventType = await this.eventTypeService.remove(id);
    return res.status(HttpStatus.OK).json({message: 'EventType deleted successfully',
      data:eventType, 
      status: HttpStatus.OK
    
    });
    
   } catch (error) {
         return res.status(HttpStatus.BAD_REQUEST).json({
           data:null,
            status: HttpStatus.BAD_REQUEST,
            message: error.message});
         
       }
  }
}
