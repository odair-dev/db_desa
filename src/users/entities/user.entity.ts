import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  id: string;
  email: string;
  name: string;
  phone: string;

  @Exclude()
  password: string;

  active: boolean;
  type: $Enums.Type_user;
}
