import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createLoginDto } from './dto/creat-login.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request,Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

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
    @Get('github')
    @UseGuards(AuthGuard('github'))
  githubLogin(){

  }
@Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any; // Cast to any to access properties
    const token = await this.authService.generateToken(user._id, user.email);
    return res.status(HttpStatus.OK).json({
      message: 'GitHub login successful',
      data: user,
      status: HttpStatus.OK,
      token,
    });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async  googleCallback(@Req() req: Request, @Res() res: Response) {
    const user =req.user as any; // Cast to any to access properties
    const token = await this.authService.generateToken(user._id,user.email);
    return res.status(HttpStatus.OK).json({
      message: 'Google login successful',
      data: user,
      status: HttpStatus.OK,
      token,
    });

  }


  



  }
