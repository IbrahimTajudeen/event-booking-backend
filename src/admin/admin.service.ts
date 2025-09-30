/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/common/entities/user.entity';
import { UserRole } from 'src/common/types/user.type';
import { Status } from 'src/common/types/status.type';
import { LoginAdminDto } from './dto/login-admin.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name)
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ){}

  async create(createAdminDto: CreateAdminDto) : Promise<User> {
    const admin = this.userRepository.create({
      email: createAdminDto.email,
      password: createAdminDto.password,
      name: createAdminDto.name,
      role: UserRole.ADMIN,
      status: Status.ACTIVE
    });
    return await this.userRepository.save(admin);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ where: { role: UserRole.ADMIN}});
  }

  async findOne(id: number) : Promise<User | null> {
    return await this.userRepository.findOneBy({ id: id , role: UserRole.ADMIN });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) : Promise<User | null> {
    await this.userRepository.update({ id: id, role: UserRole.ADMIN }, {
      email: updateAdminDto.email,
      password: updateAdminDto.password,
      name: updateAdminDto.name
    });
    return await this.findOne(id);
  }
  
  

  async userToAdmin(id: number) : Promise<string> {
    const usr = await this.findOne(id);
    if(!usr || usr?.role as UserRole === UserRole.ADMIN)
      throw new NotFoundException('User not found or user is already an admin')

    await this.userRepository.update({ id: id }, { role: UserRole.ADMIN });
    return `User: ${usr.name} is now an admin`;
  }

  async adminToUser(id: number, user: any) : Promise<string> {
    const usr = await this.findOne(id);
    if(!usr || usr?.role as UserRole === UserRole.ADMIN)
      throw new NotFoundException('User not found or user is already an admin')
    
    if(usr?.id == user.userId)
      throw new UnauthorizedException('Can not revoke self from admin');

    await this.userRepository.update({ id: id }, { role: UserRole.USER });
    return `User: ${usr.name} has been revoke admin rights`;
  }


  async remove(id: number) : Promise<string> {
    await this.userRepository.delete({ id: id , role: UserRole.ADMIN });
    return `Admin with the id: #${id} has been deleted successfully`;
  }
}
