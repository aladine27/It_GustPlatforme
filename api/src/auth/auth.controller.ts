import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createLoginDto } from './dto/creat-login.dto';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request,Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/decorators/public.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
@ApiBearerAuth("access-token")
@UseGuards(AccessTokenGuard) 
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}

  @Post('SignIn')
   @UseGuards( RolesGuard)
   @Public()
  signIn(@Body() createLoginDto: createLoginDto){
    console.log("[BACKEND] Reçu dans signIn :", createLoginDto);
    return this.authService.signIn(createLoginDto)

    }
  @Get('Logout')
  @UseGuards(RolesGuard)
  @Roles('Admin','Rh','Employe','Manager')
  logout(@Req() req: Request) {
    const user = req.user as {userId: string};
    return this.authService.logout(user.userId);
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
  @Roles('Admin','Rh','Employe','Manager')
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
@UseGuards(AccessTokenGuard)
@Roles('Admin','Rh','Employe','Manager')
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
    @Public()
  githubLogin(){

  }
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @Public()   
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const token = await this.authService.generateToken(user._id, user.email, user.role);
  
    const redirectUrl = `http://localhost:5173/auth/github-redirect?token=${token.accessToken}&user=${encodeURIComponent(Buffer.from(JSON.stringify({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      address: user.address,
      phone: user.phone,
      domain: user.domain,
      image: user.image,
      role: user.role,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken
    })).toString("base64"))}`;

    return res.redirect(redirectUrl);
  }
  

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @Public() 
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @Public()
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user as any;
      const token = await this.authService.generateToken(user._id, user.email, user.role);
  
      // Encodage base64 + encodeURIComponent
      const userEncoded = encodeURIComponent(Buffer.from(JSON.stringify(user)).toString("base64"));
  
    const redirectUrl = `http://localhost:5173/google-redirect?token=${token.accessToken}&user=${encodeURIComponent(Buffer.from(JSON.stringify({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    address: user.address,
    phone: user.phone,
    domain: user.domain,
    image: user.image,
    role: user.role,
    accessToken: token.accessToken,
    refreshToken: token.refreshToken
  })).toString("base64"))}`;

  return res.redirect(redirectUrl);
    } catch (err) {
      console.error("[Google Callback Error]", err);
      return res.status(500).json({ statusCode: 500, message: 'Internal server error' });
    }
  }
  
  @Post('forgot-password')
  @Public()
  @ApiOperation({ summary: 'Réinitialisation du mot de passe' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', example: 'user@example.com' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Mot de passe réinitialisé avec succès' })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable' })
  async forgotPassword(@Body('email') email: string, @Res() res: Response) {
    try {
      const result = await this.authService.forgotPassword(email);
      return res.status(HttpStatus.OK).json({
        status: result.status,
        message: result.message,
      });
    } catch (err) {
      return res.status(err.getStatus?.() || 400).json({
        status: err.getStatus?.() || 400,
        message: err.message,
      });
    }
  }
  @Get('profile')
@UseGuards(RolesGuard)
@Roles('Admin','Rh','Employe','Manager')
async getProfile(@Req() req: Request) {
  const userId = (req.user as any).userId;
  const user = await this.userService.findOne(userId);
  return { status: HttpStatus.OK, data: user };
}

  



  }
