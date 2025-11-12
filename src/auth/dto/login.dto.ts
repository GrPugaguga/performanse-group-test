import { IsEmail,MinLength} from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @MinLength(8, { message: 'Пароль должен содержать не менее 8 символов' })
  password: string;
}
