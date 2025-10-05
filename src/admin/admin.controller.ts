/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { RolesGuard } from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserRole } from 'src/common/types/user.type';
import { User } from 'src/common/entities/user.entity';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';

@ApiTags('Super Admin | Admin')
@ApiBearerAuth('access-token')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
      summary: 'Create admin user (Super Admin, Admin)',
      description: 'Allows a superadmin to register a new admin user to the system in the system.',
    })
    @ApiResponse({
      status: 201,
      description: 'Admin user successfully created',
      type: User,
    })
    @ApiResponse({
      status: 400,
      description: 'Bad Request',
    })
    @ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      type: InternalServerErrorException,
    })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Post('create-admin')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) : Promise<{ message: string, data: User | null }> 
  {
    const newAdmin = await this.adminService.create(createAdminDto)
    if(newAdmin)
      return ({ message: 'Admin successfully created', data: newAdmin })

    return ({ message: 'Failed to create admin', data: null })
  }

  @ApiOperation({
      summary: 'Get all Admin user (Super Admin, Admin)',
      description: 'Allows a superadmin get the list of all admins system in the system.',
    })
    @ApiResponse({
      status: 201,
      description: 'Admin user successfully created',
      type: User,
    })
    @ApiResponse({
      status: 400,
      description: 'Bad Request',
    })
    @ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      type: InternalServerErrorException,
    })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @Get('get-admins')
  getAdmins() {
    return this.adminService.findAll();
  }

  @ApiOperation({
      summary: 'Get all Admin user (Super Admin, Admin)',
      description: 'Allows a superadmin and to view the profile of an admin in the system.',
    })
    @ApiResponse({
      status: 200,
      description: 'Profile viewed successfully',
      type: User,
    })
    @ApiResponse({
      status: 400,
      description: 'Bad Request',
    })
    @ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      type: InternalServerErrorException,
    })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)  
  @Get('admin-profile/:adminId')
  findOne(@Param('adminId') adminId: number) {
    return this.adminService.findOne(adminId);
  }

  @ApiOperation({
      summary: 'Update Admin user (Super Admin)',
      description: 'Allows a superadmin to update other admins account status system in the system.',
    })
    @ApiResponse({
      status: 201,
      description: 'Account updated successfully',
      type: User,
    })
    @ApiResponse({
      status: 400,
      description: 'Bad Request',
    })
    @ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      type: InternalServerErrorException,
    })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)  
  @Put('update-admin-profile/:adminId')
  update(@Param('adminId') adminId: number, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(adminId, updateAdminDto);
  }

  @ApiOperation({
      summary: 'User gets to become admin (Super Admin)',
      description: 'Allows a superadmin to change a user account into an admin account in the system.',
    })
    @ApiResponse({
      status: 201,
      description: 'User successfully updated',
      type: User,
    })
    @ApiResponse({
      status: 400,
      description: 'Bad Request',
    })
    @ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      type: InternalServerErrorException,
    })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)  
  @Patch('make-user-admin/:adminId')
  updateUserRole(@Param('adminId') adminId: number, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.userToAdmin(adminId);
  }

  @ApiOperation({
      summary: 'Demote an admin user (Super Admin)',
      description: 'Allows a superadmin make an admin a user in the system.',
    })
    @ApiResponse({
      status: 201,
      description: 'Admin change successfully',
      type: User,
    })
    @ApiResponse({
      status: 400,
      description: 'Bad Request',
    })
    @ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      type: InternalServerErrorException,
    })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)  
  @Patch('make-admin-user/:adminId')
  updateAdminRole(@Param('adminId') adminId: number, @CurrentUser() usr: any) {
    return this.adminService.adminToUser(adminId, usr);
  }

  @ApiOperation({
      summary: 'Delete an Admin user (Super Admin)',
      description: 'Allows a superadmin to delete an Admin account in the system.',
    })
    @ApiResponse({
      status: 201,
      description: 'Admin account successfully deleted',
      type: User,
    })
    @ApiResponse({
      status: 400,
      description: 'Bad Request',
    })
    @ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      type: InternalServerErrorException,
    })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @Delete('delete-admin/:adminId')
  remove(@Param('adminId') adminId: number) {
    return this.adminService.remove(adminId);
  }
}
