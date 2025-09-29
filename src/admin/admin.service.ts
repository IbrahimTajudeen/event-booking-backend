/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
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

   async login(loginAdminDto: LoginAdminDto) : Promise<{ status: string, access_token: string }> {
    const admin = await this.userRepository.findOneBy({ email: loginAdminDto.email, role: UserRole.ADMIN });
    //verify password
    const passwordValid = await bcrypt.compare(loginAdminDto.password, admin?.password ?? '');
    if(!admin && !passwordValid)
    {
      this.logger.warn('Invalid login credentials')
      throw new NotFoundException('Invalid login credentials')
    }

    const payload = { email: admin?.email, sub: admin?.id, role: admin?.role };
    const token = await this.jwtService.signAsync(payload);
    return {
      status: "OK",
      access_token: token
    }
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

  async remove(id: number) : Promise<string> {
    await this.userRepository.delete({ id: id , role: UserRole.ADMIN });
    return `Admin with the id: #${id} has been deleted successfully`;
  }
}
