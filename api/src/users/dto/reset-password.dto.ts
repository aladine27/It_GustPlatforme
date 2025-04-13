import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ type: String, description: 'Token de réinitialisation' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ type: String, description: 'Nouveau mot de passe' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
