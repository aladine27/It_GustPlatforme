import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
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
  @Post('')
  
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
  
  @Get('/getbyRole/:role')
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
}
