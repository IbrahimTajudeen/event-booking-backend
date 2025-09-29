/* eslint-disable prettier/prettier */
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Patch, 
  Query, 
  Param, Delete, UseGuards, 
  UnauthorizedException, 
  InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RolesGuard } from 'src/common/guards/role.guard';
import { JwtAuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { UserRole } from 'src/common/types/user.type';
import { User } from 'src/common/entities/user.entity'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiOperation({
    summary: 'User Login',
    description: 'Allows users to login and receive a JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: String,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @ApiOperation({
    summary: 'Create User',
    description: 'Allows new users to register in the system.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
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
  @Post('signin')
  async createUser(@Body() createUserDto: CreateUserDto) : Promise<{ message: string, data: User | null }> 
  {
    const newUser = await this.usersService.create(createUserDto)
    if(newUser)
      return ({ message: 'User successfully created', data: newUser })

    return ({ message: 'Failed to create user', data: null })
  }

  @ApiOperation({
    summary: 'Get All Users (Admin and User)',
    description: 'Allows admin and users to fetch all users in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'Users successfully retrieved',
    type: [User],
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('get-users')
  getUsers(@Query('search') search: any) {
    return this.usersService.findAll();
  }

  @ApiOperation({
    summary: 'Get User Profile (Admin and User)',
    description: 'Allows admin and users to fetch a user profile in the system using it\'s Id.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile successfully retrieved',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)  
  @Get('user-profile/:userId')
  findOne(@Param('userId') userId: number) {
    return this.usersService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)  
  @Get('my-profile')
  myProfile(@CurrentUser() user: any) {
    return this.usersService.myProfile(user);
  }

  @ApiOperation({
    summary: 'Update User Profile (User)',
    description: 'Allows users to update their profile in the system using it\'s Id.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile successfully updated',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)  
  @Put('update-user-profile/:userId')
  update(@Param('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  @ApiOperation({
    summary: 'Delete User (Admin Only)',
    description: 'Allows admin to delete a user in the system using it\'s Id.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
  })
  @ApiResponse({
    status: 401,
    description: 'User Unauthorized',
    type: UnauthorizedException,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('delete-user/:userId')
  remove(@Param('userId') userId: number) {
    return this.usersService.remove(userId);
  }

}
 