import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FraisAdvantageService } from './frais-advantage.service';
import { CreateFraisAdvantageDto } from './dto/create-frais-advantage.dto';
import { UpdateFraisAdvantageDto } from './dto/update-frais-advantage.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Controller('frais-advantage')
export class FraisAdvantageController {
  constructor(private readonly fraisAdvantageService: FraisAdvantageService) {}
      //config swager for file
      @ApiBody({
        schema: { 
          type: 'object',
          properties: {
          raison:{ type: 'string'},
          status:{type: 'string'},
          fraiType:{type: 'string'},
          user:{type: 'string'},
          file:{type: 'string', format: 'binary'},
       
        
          }
        }
      })
      @ApiConsumes('multipart/form-data')
      //filConfig
      @UseInterceptors (
        FileInterceptor('file', {
            storage: diskStorage({
            destination: './uploads/fraisAdvantage',
            filename: (_request,file, callback) => 
            callback(null, `${new Date().getTime()}-${file.originalname}`)
            })
        })
      )
  

  @Post()
  async create(@Body() createFraisAdvantageDto: CreateFraisAdvantageDto,@Res() res,
  @UploadedFile()file: Express.Multer.File) {
    try {
      createFraisAdvantageDto.file = file?.filename
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
    //config swager for file
      @ApiBody({
        schema: { 
          type: 'object',
          properties: {
          raison:{ type: 'string'},
          status:{type: 'string'},
          fraiType:{type: 'string'},
          user:{type: 'string'},
          file:{type: 'string', format: 'binary'},
       
        
          }
        }
      })
      @ApiConsumes('multipart/form-data')
      //filConfig
      @UseInterceptors (
        FileInterceptor('file', {
            storage: diskStorage({
            destination: './uploads/fraisAdvantage',
            filename: (_request,file, callback) => 
            callback(null, `${new Date().getTime()}-${file.originalname}`)
            })
        })
      )
  

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFraisAdvantageDto: UpdateFraisAdvantageDto, @Res() res,
 @UploadedFile()file: Express.Multer.File) {
    try {
      updateFraisAdvantageDto.file = file?.filename
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
