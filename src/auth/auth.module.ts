import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import env from '../config/env/env.js';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy'; 

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy], 
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: env.JWT_SECRET,
        signOptions: { expiresIn: '60m' }, 
      }),
    }),
  ],
})
export class AuthModule {}
