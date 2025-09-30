/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { RolesGuard } from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserRole } from 'src/common/types/user.type';
import { LoginAdminDto } from './dto/login-admin.dto';
import { User } from 'src/common/entities/user.entity';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('create-admin')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) : Promise<{ message: string, data: User | null }> 
  {
    const newAdmin = await this.adminService.create(createAdminDto)
    if(newAdmin)
      return ({ message: 'Admin successfully created', data: newAdmin })

    return ({ message: 'Failed to create admin', data: null })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('get-admins')
  getAdmins() {
    return this.adminService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)  
  @Get('admin-profile/:adminId')
  findOne(@Param('adminId') adminId: number) {
    return this.adminService.findOne(adminId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)  
  @Put('update-admin-profile/:adminId')
  update(@Param('adminId') adminId: number, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(adminId, updateAdminDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('delete-admin/:adminId')
  remove(@Param('adminId') adminId: number) {
    return this.adminService.remove(adminId);
  }
}
