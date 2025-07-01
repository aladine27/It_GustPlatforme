import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  Res, HttpStatus, UseGuards, UseInterceptors, UploadedFile
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Roles } from 'src/decorators/roles.decorators';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Response } from 'express';
import {
  ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiConsumes,
  ApiResponse
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiBearerAuth("access-token")
@ApiTags('Document')
@UseGuards(AccessTokenGuard)
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Titre du document' },
        delevryDate: { type: 'string', format: 'date', description: 'Date de livraison' },
        traitementDateLimite: { type: 'string', format: 'date', description: 'Date limite de traitement' },
        status: { type: 'string', description: 'Statut du document' },
        reason: { type: 'string', description: 'Raison' },
        user: { type: 'string', description: 'ID utilisateur associé' },
        // Ajoute ici un champ fichier si tu veux permettre l'upload d'un document (PDF, image, etc)
        file: { type: 'string', format: 'binary', description: 'Fichier du document (optionnel)' }
      },
      required: ['title', 'delevryDate', 'traitementDateLimite', 'status', 'reason', 'user']
    }
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
      })
    })
  )
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Rh')
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @Res() res,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      // Si tu veux stocker le nom du fichier :
      if (file) createDocumentDto['file'] = file.filename;
      const newDocument = await this.documentService.create(createDocumentDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'Document created successfully',
        status: HttpStatus.CREATED,
        data: newDocument
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      });
    }
  }

  @Get('/findDocumentByUserId/:user')
  @ApiOperation({ summary: 'Trouver les documents par userId' })
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Rh', 'Employe', 'Manager')
  async findDocumentbyUserId(@Param('user') user: string, @Res() res) {
    try {
      const userDocument = await this.documentService.findDocumentByuserId(user);
      return res.status(HttpStatus.OK).json({
        message: 'Document Associated to user retrieved successfully',
        data: userDocument,
        status: HttpStatus.OK
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        data: null,
        status: HttpStatus.OK
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les documents' })
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Rh', 'Employe', 'Manager')
  async findAll(@Res() res) {
    try {
      const documents = await this.documentService.findAll();
      return res.status(HttpStatus.OK).json({
        message: 'Documents retrieved successfully',
        data: documents,
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

  @Get(':id')
  @ApiOperation({ summary: 'Trouver un document par id' })
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Rh', 'Employe', 'Manager')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const document = await this.documentService.findOne(id);
      return res.status(HttpStatus.OK).json({
        message: 'Document retrieved successfully',
        data: document,
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
  @ApiOperation({ summary: 'Mettre à jour un document' })
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Rh')
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Res() res
  ) {
    try {
      const document = await this.documentService.update(id, updateDocumentDto);
      return res.status(HttpStatus.OK).json({
        message: 'Document updated successfully',
        data: document,
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

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un document' })
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Rh')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const document = await this.documentService.remove(id);
      return res.status(HttpStatus.OK).json({
        message: 'Document deleted successfully',
        data: document,
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
  @Get(':id/template')
  @ApiOperation({ summary: 'Générer le template HTML fusionné du document (pour édition WYSIWYG)' })
  @ApiResponse({ status: 200, description: 'Le HTML prêt à être édité.' })
  @UseGuards(RolesGuard)
  @Roles('Admin', 'Rh', 'Employe', 'Manager')
  async getTemplate(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const { html } = await this.documentService.getDocumentTemplate(id);
      return res.status(HttpStatus.OK).json({
        message: 'Document HTML template generated',
        data: html,
        status: HttpStatus.OK
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
        data: null,
        status: HttpStatus.BAD_REQUEST
      });
    }
  }
  @Post(':id/generate-pdf')
@ApiOperation({ summary: 'Générer un PDF à partir du HTML personnalisé (WYSIWYG)' })
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      html: { type: 'string', description: 'Contenu HTML du document édité' }
    },
    required: ['html']
  }
})
@ApiResponse({ status: 201, description: 'Le document PDF généré et stocké.' })
@UseGuards(RolesGuard)
@Roles('Admin', 'Rh')
async generatePdfFromHtml(
  @Param('id') id: string,
  @Body('html') html: string,
  @Res() res: Response,
) {
  try {
    const doc = await this.documentService.generatePdfFromHtml(id, html);
    return res.status(HttpStatus.CREATED).json({
      message: 'Document PDF généré et stocké.',
      data: doc,
      status: HttpStatus.CREATED
    });
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
      data: null,
      status: HttpStatus.BAD_REQUEST
    });
  }
}
}
