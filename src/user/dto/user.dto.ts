import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserDto implements User {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  hash: string;

  @Exclude()
  firstName: string;
  lastName: string;
  email: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
