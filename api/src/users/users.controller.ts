import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseInterceptors, UploadedFile, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorators';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Response } from 'express'; // Ensure explicit import
@ApiBearerAuth("access-token")
@UseGuards(AccessTokenGuard) 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @UseGuards( RolesGuard)
  @Roles('Admin')
  //config swager for file
  @ApiBody({
    schema: { 
      type: 'object',
      properties: {
      fullName:{ type: 'string'},
      email:{ type: 'string'},
      address:{type: 'string'},
      phone:{type: 'string'},
      password:{type: 'string'},
      role:{type: 'string'},
      image:{type: 'string', format: 'binary'},
      }
    }
  })
  @ApiConsumes('multipart/form-data')
  //filConfig
  @UseInterceptors(
    FileInterceptor('image', {
        storage: diskStorage({
        destination: './uploads/users',
        filename: (_request,image, callback) => 
        callback(null, `${new Date().getTime()}-${image.originalname}`)
        })
    })
  )
 
  async create(@Body() createUserDto: CreateUserDto, @Res() res,@UploadedFile()image: Express.Multer.File) {
    try {
      createUserDto.image = image?.filename
      const newUser = await this.usersService.create(createUserDto);
      return res.status(HttpStatus.CREATED).json({message: 'User created successfully',
         status: HttpStatus.CREATED,
         data: newUser});
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null,
         status: HttpStatus.BAD_REQUEST,
         message: error.message});
      
    }
  }

  @UseGuards( RolesGuard)
  @Roles('Admin')
  @Get('/getbyEmail/:email')
  async findByEmail(@Param('email') email: string, @Res() res) {
    try {
      const userEmail = await this.usersService.findbyEmail(email);
      return res.status(HttpStatus.OK).json(
        {message: 'UsersByEmail retrieved successfully',
          data:userEmail,
          status: HttpStatus.OK
        });
    
      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
  }
  
  @Get('search')
@UseGuards(RolesGuard) // Ensure RolesGuard is applied
@Roles('Admin')
  @ApiOperation({ summary: 'Search users by query (name, email, etc)' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search term for user (name, email, address, phone or role)',
  })
  async searchUsers(@Query('q') query: string, @Res() res: Response) {
    try {
      const users = await this.usersService.searchUsers(query);
      return res.status(HttpStatus.OK).json({
        message: 'Users found',
        status: HttpStatus.OK,
        data: users,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: error.message,
        status: HttpStatus.NOT_FOUND,
        data: null,
      });
    }
  }
  @Get('/getbyRole/:role')
  @UseGuards( RolesGuard)
  @Roles('Admin')
  async finduserByRole(@Param('role') role: string, @Res() res) {
    try {
      const usersrole = await this.usersService.findUserByRole(role);
      return res.status(HttpStatus.OK).json(
        { message: 'UsersByRole retrieved successfully',
          data:usersrole,
          status: HttpStatus.OK
        });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message
      
      } );
      
    }
  }

 @Get() 
 @UseGuards( RolesGuard)
 @Roles('Admin')
async findAll( @Res() res) {
    try {
      const users = await this.usersService.findAll();
      return res.status(HttpStatus.OK).json({message: 'Users retrieved successfully',data:users, status: HttpStatus.OK
    });
    }
      catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} 
       
      );
    }
  }
  

  @Get(':id')
  @UseGuards( RolesGuard)
  @Roles('Admin')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
       const user = await this.usersService.findOne(id);
      return res.status(HttpStatus.OK).json({message: 'Users retrieved successfully',data:user, status: HttpStatus.OK
    });
      
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
  }

  
    //config swager for file
  @ApiBody({
    schema: { 
      type: 'object',
      properties: {
      fullName:{ type: 'string'},
      email:{ type: 'string'},
      address:{type: 'string'},
      phone:{type: 'string'},
      password:{type: 'string'},
      role:{type: 'string'},
      image:{type: 'string', format: 'binary'},
      }
    }
  })

  @ApiConsumes('multipart/form-data')
  //filConfig
  @UseInterceptors(
    FileInterceptor('image', {
        storage: diskStorage({
        destination: './uploads/users',
        filename: (_request,image, callback) => 
        callback(null, `${new Date().getTime()}-${image.originalname}`)
        })
    }),
    

  )

  @Patch(':id')
  @UseGuards( RolesGuard)
  @Roles('Admin')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res,@UploadedFile()image: Express.Multer.File) {
    try {
      updateUserDto.image = image?.filename
      const user = await this.usersService.update(id, updateUserDto);
      return res.status(HttpStatus.OK).json({message: 'Users updated successfully',data:user, status: HttpStatus.OK
      
    });} catch (error) {
       return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
    
  }

  @Delete(':id')
  @UseGuards( RolesGuard)
  @Roles('Admin')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const user = await this.usersService.remove(id);
       return res.status(HttpStatus.OK).json({message: 'Users deleted successfully',data:user, status: HttpStatus.OK
      
    });} catch (error) {
       return res.status(HttpStatus.BAD_REQUEST).json({
        data:null, 
        status: HttpStatus.BAD_REQUEST,
        message: error.message} );
      
    }
   
  }


@Get('export/excel/:start/:end')
@UseGuards(RolesGuard)
@Roles('Admin')
async exportExcel(
  @Param('start') start: string,
  @Param('end') end: string,
  @Res() res: Response, // Explicitly type Response
) {
  let startDate: Date;
  let endDate: Date;

  try {
    startDate = new Date(start);
    endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid date format (expected YYYY-MM-DD)',
        data: null,
      });
    }

    const buffer = await this.usersService.exportUsersToExcel(startDate, endDate);

    // Set response headers for Excel file
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="users_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.xlsx`,
    });

    return res.status(HttpStatus.OK).send(buffer);
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `Failed to export Excel: ${error.message}`,
      data: null,
    });
  }
}

/** Export PDF with URL parameters */
@Get('export/pdf/:start/:end')
@UseGuards(RolesGuard) // Ensure RolesGuard is applied
@Roles('Admin')
async exportPdf(
  @Param('start') start: string,
  @Param('end') end: string,
  @Res() res: Response, // Explicitly type Response
) {
  let startDate: Date;
  let endDate: Date;

  try {
    startDate = new Date(start);
    endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid date format (expected YYYY-MM-DD)',
        data: null,
      });
    }

    const buffer = await this.usersService.exportUsersToPdf(startDate, endDate);

    // Set response headers for PDF file
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="users_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.pdf`,
    });

    return res.status(HttpStatus.OK).send(buffer);
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `Failed to export PDF: ${error.message}`,
      data: null,
    });
  }
}

@Post('import/excel')
@UseGuards(RolesGuard)
@Roles('Admin')
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: { type: 'string', format: 'binary', description: 'Fichier Excel à importer' },
    }
  }
})
@UseInterceptors(
  FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2Mo max
  })
)
async importExcel(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
  try {
    if (!file || !file.buffer) {
      return res.status(HttpStatus.BAD_REQUEST).json({ status: 400, message: "Aucun fichier reçu" });
    }
    const result = await this.usersService.importUsersFromExcel(file.buffer);
    return res.status(HttpStatus.OK).json({
      status: 200,
      message: `Import terminé  utilisateurs créés`,
      data: result,
    });
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 500,
      message: e.message,
      data: null,
    });
  }
}


}
