import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(@Body() user: any) {
    const newUser = await this.authService.signup(user);
    return this.authService.auth(newUser);
  }
}
