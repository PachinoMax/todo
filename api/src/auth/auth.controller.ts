import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  @UsePipes(new ValidationPipe())
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.email);
    if (oldUser) {
      throw new BadRequestException('User already exists');
    }
    return this.authService.createUser(dto);
  }
  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(@Body() { email, password }: AuthDto) {
    const user = await this.authService.validateUser(email, password);
    return this.authService.login(user.email);
  }
}
