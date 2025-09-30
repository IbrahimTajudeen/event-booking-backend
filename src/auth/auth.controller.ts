/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(private readonly authService: AuthService) {}

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
  async login(@Body() loginAuthDto: LoginAuthDto) {
    this.logger.log(`Login Credentials ${loginAuthDto}`)
    const token_obj = await this.authService.login(loginAuthDto);
    this.logger.log(`Access token: ${token_obj.access_token}`);
    return token_obj;
  }
}