import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingEmail = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingEmail) {
      console.log(existingEmail);
      throw new ConflictException('This email already exists');
    }
    const newUser = await this.prisma.user.create({
      data: createUserDto,
    });
    return plainToInstance(UserEntity, newUser);
  }

  async findAll(type: string): Promise<UserEntity[]> {
    const allUsers = await this.prisma.user.findMany();
    if (type == 'admin') {
      return plainToInstance(UserEntity, allUsers);
    } else {
      throw new UnauthorizedException('Only admin can perform this operation');
    }
  }

  async findAllActive(type: string): Promise<UserEntity[]> {
    const allUsers = await this.prisma.user.findMany({
      where: {
        active: true,
      },
    });
    if (type == 'admin') {
      return plainToInstance(UserEntity, allUsers);
    } else {
      throw new UnauthorizedException('Only admin can perform this operation');
    }
  }

  async findOne(
    id: string,
    token_id: string,
    type: string,
  ): Promise<UserEntity> {
    const uniqueUser = await this.prisma.user.findUnique({
      where: {
        id,
        active: true,
      },
    });
    if (!uniqueUser) {
      throw new NotFoundException('User not found');
    }
    if (id == token_id || type == 'admin') {
      return plainToInstance(UserEntity, uniqueUser);
    } else {
      throw new UnauthorizedException(
        'Only owner or admin can perform this operation',
      );
    }
  }

  async update(
    id: string,
    token_id: string,
    type: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const uniqueUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!uniqueUser) {
      throw new NotFoundException('User not found');
    }
    if (id == token_id || type == 'admin') {
      const user = this.prisma.user.update({
        where: {
          id,
        },
        data: updateUserDto,
      });
      return plainToInstance(UserEntity, user);
    } else {
      throw new UnauthorizedException(
        'Only owner or admin can perform this operation',
      );
    }
  }

  async remove(id: string, token_id: string, type: string) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        id,
        active: true,
      },
    });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    if (id == token_id || type == 'admin') {
      const user = this.prisma.user.update({
        where: {
          id,
        },
        data: { active: false },
      });
      return plainToInstance(UserEntity, user);
    } else {
      throw new UnauthorizedException(
        'Only owner or admin can perform this operation',
      );
    }
  }
}
