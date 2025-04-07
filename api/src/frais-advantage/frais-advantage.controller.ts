import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { FraisAdvantageService } from './frais-advantage.service';
import { CreateFraisAdvantageDto } from './dto/create-frais-advantage.dto';
import { UpdateFraisAdvantageDto } from './dto/update-frais-advantage.dto';

@Controller('frais-advantage')
export class FraisAdvantageController {
  constructor(private readonly fraisAdvantageService: FraisAdvantageService) {}

  @Post()
  async create(@Body() createFraisAdvantageDto: CreateFraisAdvantageDto,@Res() res) {
    try {
      const newFraisAdvantage = await this.fraisAdvantageService.create(createFraisAdvantageDto);
      return res.status(HttpStatus.CREATED).json({message: 'FraisAdvantage created successfully',
         status: HttpStatus.CREATED,
         data: newFraisAdvantage});

      
    } catch (error) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            data:null,
             status: HttpStatus.BAD_REQUEST,
             message: error.message});
          
        }
  }

  @Get()
  async findAll(@Res() res) {
   try {
    const fraisAdvantages = await this.fraisAdvantageService.findAll();
    return res.status(HttpStatus.OK).json({message: 'FraisAdvantages retrieved successfully',
      data:fraisAdvantages,
      status: HttpStatus.OK });
    
    
   } catch (error) {
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
      const fraisAdvantage = await this.fraisAdvantageService.findOne(id);
      return res.status(HttpStatus.OK).json({message: 'FraisAdvantage retrieved successfully',
        data:fraisAdvantage,
        status: HttpStatus.OK });
      
    } catch (error) {
      {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
      
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFraisAdvantageDto: UpdateFraisAdvantageDto, @Res() res) {
    try {
      const fraisAdvantage = await this.fraisAdvantageService.update(id, updateFraisAdvantageDto);
      return res.status(HttpStatus.OK).json({message: 'FraisAdvantage updated successfully',
        data:fraisAdvantage,
        status: HttpStatus.OK })

      
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
      const fraisAdvantage = await this.fraisAdvantageService.remove(id);
      return res.status(HttpStatus.OK).json({
        data:fraisAdvantage,
        message: 'FraisAdvantage deleted successfully',
        status: HttpStatus.OK
      })
      
    } catch (error)  {
       return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
  }
}
