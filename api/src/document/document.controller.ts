import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  async create(@Body() createDocumentDto: CreateDocumentDto, @Res() res) {
    try {
      const newDocument = await this.documentService.create(createDocumentDto);
      return res.status(HttpStatus.CREATED).json({message: 'Document created successfully',
         status: HttpStatus.CREATED,
         data: newDocument});

      
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
    const documents = await this.documentService.findAll();
    return res.status(HttpStatus.OK).json({
      message: 'Documents retrieved successfully',
      data:documents,
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
      const document = await this.documentService.findOne(id);
      return res.status(HttpStatus.OK).json({message: 'Document retrieved successfully',
        data:document,
        status: HttpStatus.OK
    });
      
    } catch (error)  {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto, @Res() res) {
    try {
      const document = await this.documentService.update(id, updateDocumentDto);
      return res.status(HttpStatus.OK).json({message: 'Document updated successfully',
        data:document,
        status: HttpStatus.OK
    });

      
    } catch (error) {
       return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string,@Res() res) {
   try {
    const document = await this.documentService.remove(id);
    return res.status(HttpStatus.OK).json({message: 'Document deleted successfully',
      data:document,
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
