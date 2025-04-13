import { 
  Controller, 
  Request, 
  Post, 
  UseGuards, 
  Body, 
  Logger, 
  HttpException, 
  HttpStatus, 
  Res, 
  Get, 
  InternalServerErrorException, 
  NotFoundException, 
  Patch, 
  Req, 
  UnauthorizedException 
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersService } from 'src/users/users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ResetPasswordDto } from 'src/users/dto/reset-password.dto';
// Assurez-vous que ResetPasswordDto existe et est importé


@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body('rememberMe') rememberMe: boolean) {
    return this.authService.login(req.user, rememberMe);
  }

  @Post('signup')
  async signUp(@Body() signUpDto: CreateUserDto): Promise<any> {
    const validRoles = ['challenger', 'company', 'admin'];
    if (
      !signUpDto.fullName ||
      !signUpDto.email ||
      !signUpDto.password ||
      !validRoles.includes(signUpDto.role.toLowerCase())
    ) {
      throw new HttpException('Invalid data format!', HttpStatus.BAD_REQUEST);
    }
    try {
      const user = await this.authService.signup(signUpDto);
      if (!user) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }
      return {
        statusCode: 201,
        message: 'User registered successfully!',
        user,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('currentUser')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req) {
    return req.user;
  }

  @Post('forget-password')
  async forgetPassword(@Body('email') email: string) {
    await this.authService.forgetPassword(email);
    return { message: 'Password reset email sent successfully' };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    return { message: 'Password reset successfully' };
  }

  @Patch('change-password')
  async changePassword(
    @Body('email') email: string,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    try {
      await this.authService.changePassword(email, currentPassword, newPassword);
    } catch (error) {
      this.logger.error('Error changing password:', error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Current password is incorrect');
      } else {
        throw new InternalServerErrorException('Failed to change password');
      }
    }
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  githubLogin() {
    // Endpoint pour initier la connexion avec GitHub (sera intercepté par le Guard)
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubCallback(@Req() req, @Res() res) {
    // Si l'utilisateur ne termine pas l'inscription, redirigez vers une page de complétion
    if (req.user?.didNotFinishSignup) {
      res.redirect(
        `http://localhost:3000/auth/success-redirect?email=${req.user.email}&username=${req.user.name}`,
      );
      return;
    }

    const auth = await this.authService.login(req.user);
    res.cookie('token', auth.access_token, { httpOnly: false });
    res.redirect('http://localhost:3000/auth/success-redirect/');
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    // Endpoint pour initier la connexion avec Google (sera intercepté par le Guard)
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req, @Res() res) {
    if (req.user?.didNotFinishSignup) {
      res.redirect(
        `http://localhost:3000/auth/success-redirect?email=${req.user.email}&username=${req.user.name}`,
      );
      return;
    }

    const auth = await this.authService.login(req.user);
    res.cookie('token', auth.access_token, { httpOnly: false });
    res.redirect('http://localhost:3000/auth/success-redirect/');
  }
}
