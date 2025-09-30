/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from 'src/common/entities/user.entity'
import { UserRole } from 'src/common/types/user.type';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(@InjectRepository(User) private userRepository: Repository<User>, private readonly jwtService: JwtService ){}

  async login(loginAuthDto: LoginAuthDto) : Promise<{ status: string, access_token: string }> {
    const user = await this.userRepository.findOneBy({ email: loginAuthDto.email });
    //verify password
    const passwordValid = await bcrypt.compare(loginAuthDto.password, user?.password ?? '');
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
}
