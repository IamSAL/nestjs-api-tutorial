import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    //generate pwd hash
    const hash = await argon.hash(dto.password);

    //save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      //return the saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException('Credentials already taken');
        }
      }

      throw error;
    }
  }

  async login(dto: AuthDto) {
    //find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    //if user doesn't exist throw exception
    if (!user) {
      throw new ForbiddenException('Credentials incorrect.');
    }
    //verify password
    const isVerified = await argon.verify(user.hash, dto.password);

    //return user if password correct
    if (isVerified) {
      delete user.hash;
      return user;
    } else {
      //if password incorrect throw exception
      throw new ForbiddenException('Incorrect password.');
    }
  }
}
