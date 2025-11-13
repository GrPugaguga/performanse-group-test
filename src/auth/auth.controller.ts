import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/users/entities/User';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'; 

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }


  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth') 
  @Get('profile')
  getProfile(@Request() req: { user: User }) {
    return req.user.getData(); 
  }
}