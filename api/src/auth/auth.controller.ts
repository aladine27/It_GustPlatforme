import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createLoginDto } from './dto/creat-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('SignIn')
  signIn(@Body() createLoginDto: createLoginDto){
    return this.authService.signIn(createLoginDto)

    }
  
}
