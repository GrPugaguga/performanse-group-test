import { IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'strongpassword123',
  })
  @MinLength(8, { message: 'Пароль должен содержать не менее 8 символов' })
  password: string;
}
