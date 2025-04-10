import { Controller, Post, Body, Headers, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Auth } from './decorators/auth.decorator';
import { getUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  create(@Body() signUpDto: SignUpDto) {
    return this.authService.create(signUpDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Auth()
  @Post('/renew-token')
  renewToken(
    @Headers('authorization') BearerToken: string,
  ): Promise<{ token: string }> {
    const token = BearerToken.split('Bearer')[1].trim();

    return this.authService.renewToken(token);
  }

  @Auth()
  @Get('/user-info')
  getUserInfo(@getUser('id') userId: number){
    return this.authService.getUserInfo(userId)
  }
}
