/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/common/entities/user.entity';
import { UserRole } from 'src/common/types/user.type';
import { Status } from 'src/common/types/status.type';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectRepository(User) private userRepository: Repository<User>, private jwtService: JwtService) {}

  async create(createUserDto: CreateUserDto) : Promise<User> {
      try {
        const salt = await bcrypt.genSalt(10);
        const user = this.userRepository.create({
          email: createUserDto.email,
          password: await bcrypt.hash(createUserDto.password, salt),
          name: createUserDto.name,
          status: Status.ACTIVE
        });
        return await this.userRepository.save(user);
      } catch (error) {
        this.logger.error('Error creating user', error);
        throw new InternalServerErrorException(error.message);
      }
  }
  
  async login(LoginUserDto: LoginUserDto) : Promise<{ status: string, access_token: string }> {
    const user = await this.userRepository.findOneBy({ email: LoginUserDto.email, role: UserRole.USER });
    //verify password
    const passwordValid = await bcrypt.compare(LoginUserDto.password, user?.password ?? '');
    if(!user && !passwordValid)
    {
      this.logger.warn('Invalid login credentials')
      throw new NotFoundException('Invalid login credentials')
    }

    const payload = { email: user?.email, sub: user?.id, role: user?.role };
    const token = await this.jwtService.signAsync(payload);
    return {
      status: "OK",
      access_token: token
    }
  }
  
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ where: { role: UserRole.USER}});
  }

  async findOne(id: number) : Promise<User | null> {
    return await this.userRepository.findOneBy({ id: id , role: UserRole.USER });
  }

  async myProfile(user: User) : Promise<User | null> {
    return await this.userRepository.findOneBy({ id: user.id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) : Promise<User | null> {
    const salt = await bcrypt.genSalt(10);
    await this.userRepository.update({ id: id, role: UserRole.USER }, {
      email: updateUserDto.email,
      password: await bcrypt.hash(updateUserDto.password, salt),
      name: updateUserDto.name
    });
    return await this.findOne(id);
  }

  async remove(id: number) : Promise<string> {
    await this.userRepository.delete({ id: id , role: UserRole.USER });
    return `User with the id: #${id} has been deleted successfully`;
  }
}
