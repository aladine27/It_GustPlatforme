import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  

  @Post('')
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
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

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res) {
    try {
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
