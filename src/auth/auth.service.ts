/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from 'src/common/entities/user.entity'

@Injectable()
export class AuthService {

  constructor(@InjectRepository(User) private userRepository: Repository<User> ){}

  create(createAuthDto: CreateAuthDto) : Promise<string> {
    return Promise.resolve('This action adds a new auth');
  }

  login(loginAuthDto: LoginAuthDto) {
    return Promise.resolve('This action logs in a user');
  }

  findAll() {
    return Promise.resolve('This action returns all auth');
  }

  findOne(id: number) {
    return Promise.resolve(`This action returns a #${id} auth`);
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return Promise.resolve(`This action updates a #${id} auth`);
  }

  remove(id: number) {
    return Promise.resolve(`This action removes a #${id} auth`);
  }
}
