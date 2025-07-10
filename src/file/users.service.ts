import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User | null> {
    try {
      const user = this.userRepo.create(dto);
      return await this.userRepo.save(user);
    } catch (err) {
      console.error('Error creating user:', err);
      return null;
    }
  }

  async findAll(
    options: IPaginationOptions,
    isActive?: boolean,
  ): Promise<Pagination<User> | null> {
    try {
      const query = this.userRepo.createQueryBuilder('user');
      if (isActive !== undefined) {
        query.where('user.isActive = :isActive', { isActive });
      }
      return await paginate<User>(query, options);
    } catch (err) {
      console.error('Error retrieving users:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<User | null> {
    try {
      return await this.userRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error finding user:', err);
      return null;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      return await this.userRepo.findOne({ where: { username } });
    } catch (err) {
      console.error('Error finding user by username:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<User | null> {
    try {
      const user = await this.findOne(id);
      if (!user) return null;

      Object.assign(user, dto);
      return await this.userRepo.save(user);
    } catch (err) {
      console.error('Error updating user:', err);
      return null;
    }
  }

  async remove(id: string): Promise<User | null> {
    try {
      const user = await this.findOne(id);
      if (!user) return null;

      return await this.userRepo.remove(user);
    } catch (err) {
      console.error('Error deleting user:', err);
      return null;
    }
  }

  async updateProfile(id: string, filename: string): Promise<User | null> {
    try {
      const user = await this.findOne(id);
      if (!user) return null;

      user.profile = filename;
      return await this.userRepo.save(user);
    } catch (err) {
      console.error('Error updating user profile image:', err);
      return null;
    }
  }
}
