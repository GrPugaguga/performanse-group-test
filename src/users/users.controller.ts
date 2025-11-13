import { Controller, Get, Post, Delete, Param, UseGuards, Request, NotFoundException, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/User';

@Controller('users')
@UseGuards(JwtAuthGuard) 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(user => user.getData());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const targetUserId = parseInt(id, 10);
    const user = await this.usersService.findOne(targetUserId);
    if (!user) {
      throw new NotFoundException(`User with ID ${targetUserId} not found.`);
    }
    return user.getData();
  }

  @Post(':id/promote')
  @HttpCode(200)
  async promoteToAdmin(@Param('id') id: string, @Request() req: { user: User }) {
    const updatedUser = await this.usersService.promoteToAdmin(parseInt(id, 10), req.user);
    return updatedUser.getData();
  }


  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @Request() req: { user: User }) {
    await this.usersService.remove(parseInt(id, 10), req.user);
  }
}