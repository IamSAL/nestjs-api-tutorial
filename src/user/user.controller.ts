import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserDto } from './dto';

@Controller('users')
export class UserController {
  @UseGuards(JwtGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  getMe(@GetUser() user: User, @GetUser('email') userEmail: string): UserDto {
    console.log(`LOGIN BY: ${userEmail}`);
    return new UserDto(user);
  }
}
