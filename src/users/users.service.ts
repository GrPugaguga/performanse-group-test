import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import knex from '../database/knex';
import { User } from './entities/User';
import { UserRole } from './value-objects/UserRole';

interface CreateUserDto {
  email: string;
  password: string;
}

@Injectable()
export class UsersService {

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUserEntity = await User.create({
      email: createUserDto.email,
      password: createUserDto.password
    });

    const [id] = await knex('users').insert({
      email: newUserEntity.email,
      password: newUserEntity.password,
      role: newUserEntity.role.toString(), 
      created_at: newUserEntity.createdAt,
    });

    return new User({ ...newUserEntity, id: id });
  }


  async findAll(): Promise<User[]> {
    const usersData = await knex('users').select('*');
    return usersData.map(userData => new User(userData));
  }

  async findOne(id: number): Promise<User | null> {
    const userData = await knex('users').where({ id }).first();
    return userData ? new User(userData) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await knex('users').where({ email }).first();
    return userData ? new User(userData) : null;
  }

  async promoteToAdmin(targetUserId: number, currentUser: User): Promise<User> {
    if (!currentUser.isAdmin()) {
      throw new ForbiddenException('Only administrators can promote users to admin.');
    }

    const userToUpdate = await this.findOne(targetUserId);
    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${targetUserId} not found.`);
    }

    userToUpdate.promoteToAdmin(); 
    await knex('users').where({ id: targetUserId }).update({ role: userToUpdate.role.toString() });

    return userToUpdate;
  }


  async remove(targetUserId: number, currentUser: User): Promise<void> {
    const userToDelete = await this.findOne(targetUserId);
    if (!userToDelete) {
      throw new NotFoundException(`User with ID ${targetUserId} not found.`);
    }

    if (!currentUser.canDelete(userToDelete)) {
      throw new ForbiddenException('You do not have permission to delete this user.');
    }

    if (userToDelete.isAdmin()) {
      const adminCount = await knex('users').where({ role: UserRole.createAdmin().toString() }).count('id as count');
      if (parseInt(adminCount[0].count.toString()) === 1) {
        throw new ForbiddenException('Cannot delete the last administrator.');
      }
    }

    await knex('users').where({ id: targetUserId }).del();
  }
}