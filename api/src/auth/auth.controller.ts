import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createLoginDto } from './dto/creat-login.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
@Controller('auth')
@ApiBearerAuth("access-token")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('SignIn')
  signIn(@Body() createLoginDto: createLoginDto){
    return this.authService.signIn(createLoginDto)

    }
  @UseGuards(AccessTokenGuard)
  @Get('Logout')
  logout(@Req() req: Request) {
    const user = req.user as {sub: string};
    return this.authService.logout(user.sub);

    }
  
    @ApiBody({
      schema: { 
        type: 'object',
        properties: {
        fullName:{ type: 'string'},
        email:{ type: 'string'},
        address:{type: 'string'},
        phone:{type: 'string'},
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
  @UseGuards(AccessTokenGuard)
  @Patch('updateprofile/:id')
    async updateprofile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res,@UploadedFile()image: Express.Multer.File) {
      try {
        updateUserDto.image = image?.filename
        const user = await this.authService.updateprofile(id, updateUserDto);
        return res.status(HttpStatus.OK).json({message: 'Users updated successfully',data:user, status: HttpStatus.OK
        
      });} catch (error) {
         return res.status(HttpStatus.BAD_REQUEST).json({
          data:null, 
          status: HttpStatus.BAD_REQUEST,
          message: error.message} );
        
      }

  
 
  

}
@Patch('updatepassword/:id')
 async updatepassword(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res) {
      try {
        const user = await this.authService.updatePassword(id, updateUserDto);
        return res.status(HttpStatus.OK).json({message: 'Users updated successfully',data:user, status: HttpStatus.OK
      });} catch (error) {
         return res.status(HttpStatus.BAD_REQUEST).json({
          data:null, 
          status: HttpStatus.BAD_REQUEST,
          message: error.message} );
        
      }
    }
}
