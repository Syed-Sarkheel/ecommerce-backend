import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt.auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  fetchAllUsers() {
    return this.authService.fetch();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile() {
    return { message: 'This is a protected route' };
  }

  @Post('signup')
  async registeration(@Body() createuserdto: CreateUserDto) {
    return this.authService.register(createuserdto);
  }

  @Post('login')
  async loginUser(@Body() loginuserdto: LoginUserDto) {
    return this.authService.login(loginuserdto);
  }
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}

// {
//     "email" : "hageye6075@asaud.com",
//     "name" : "Syed",
//     "password" : "O3o!*>Ks"
//   }
