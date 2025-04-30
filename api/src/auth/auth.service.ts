import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import {createLoginDto} from './dto/creat-login.dto'
import * as   argon2  from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class AuthService {
    constructor(private userService:UsersService,
        private jwtService:JwtService,
        private configService:ConfigService,
    ){}

    async signIn(CreateLoginDto:createLoginDto){
        //test existantce user
        const user = await this.userService.findbyEmail(CreateLoginDto.email)
        if (!user){
            throw new BadRequestException("user not exist")

        }
        //test Password
        const passwordMatches= await argon2.verify(user.password,CreateLoginDto.password)
        console.log(passwordMatches)
        if (!passwordMatches){
            throw new BadRequestException("password incorrect")

        }
        //generate Token
        const token= await this.generateToken(user._id,user.email)
        await this.updateRefreshToken(user._id,token.refreshToken)
        return {user , token}
        

    }
    async generateToken(userId:string,email:string){
        const [accessToken, refreshToken]=await Promise.all([
            this.jwtService.signAsync(
                {
                    sub:userId,
                    email
                },
                {
                    secret:this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
                    expiresIn:'1d'
                }
            ),
            this.jwtService.signAsync(
                {
                    sub:userId,
                    email
                },
                {
                    secret:this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
                    expiresIn:'2d'
                    
                }
            )
            

        ])
    return {accessToken, refreshToken}

    }
    async updateRefreshToken(userId: string,refreshToken: string) {
        const hashedRefreshToken = await argon2.hash(refreshToken)
        await this.userService.update(userId, {refreshToken: hashedRefreshToken})
  }
  async logout(userId: string) {
    await this.userService.update(userId, {refreshToken:null}) 
  }

  async updateprofile(userId: string, updateUserDto: UpdateUserDto) {
    const profile = await this.userService.update(userId, updateUserDto)
    if(!profile){ 
        throw new BadRequestException('No user found')
      }
    return profile;
  }
  
async updatePassword(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userService.findOne(id);
    if (!user) {
        throw new NotFoundException('User not found');
    }
    if (!updateUserDto.password) {
        throw new BadRequestException('Password is required');
    }
    const isSamePassword = await argon2.verify(user.password, updateUserDto.password);
    if (isSamePassword) {
        throw new BadRequestException('New password cannot be the same as the old password');
    }
    const newPassword = await argon2.hash(updateUserDto.password);
    await this.userService.update(id, {...UpdateUserDto,password: newPassword})
    const token= await this.generateToken(user._id,user.email)
    await this.updateRefreshToken(user._id,token.refreshToken)
    return {user , token}
}
//Vérifie qu’un utilisateur avec cet email existe déjà dans la base de données.
  async validateExistingUserByEmail(email: string) {
    const user = await this.userService.findbyEmail(email);
    return user; // ou null si pas trouvé
  }





  }

