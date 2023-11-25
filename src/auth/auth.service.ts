import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user && user.active) {
      const passwordMatch = await compare(password, user.password);
      if (passwordMatch) {
        return { email: user.email };
      }
    }
    return null;
  }

  async login(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return {
      token: this.jwtService.sign({ type: user.type }, { subject: user.id }),
    };
  }
}
