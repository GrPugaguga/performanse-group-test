import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/User';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}


  async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует.');
    }

    const user = await this.usersService.create(registerDto);

    return this.login(user);
  }

 
  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await user.comparePassword(pass))) {
      return user.getData();
    }
    return null;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role.toString(),
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}