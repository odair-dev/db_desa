import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { AddressEntity } from '../entities/address.entity';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Injectable()
export class AddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAdressDto: CreateAddressDto): Promise<AddressEntity> {
    return this.prisma.address.create({
      data: createAdressDto,
    });
  }

  async findAll(): Promise<AddressEntity[]> {
    return this.prisma.address.findMany();
  }

  async findOne(id: string): Promise<AddressEntity> {
    const AddressFound = await this.prisma.address.findUnique({
      where: {
        id,
      },
    });
    if (AddressFound) {
      return AddressFound;
    } else {
      throw new NotFoundException('Address not found');
    }
  }

  async update(
    id: string,
    type: string,
    updateAdressDto: UpdateAddressDto,
  ): Promise<AddressEntity> {
    const AddressFound = await this.prisma.address.findUnique({
      where: {
        id,
      },
    });
    if (AddressFound) {
      if (type == 'admin') {
        return this.prisma.address.update({
          where: {
            id,
          },
          data: updateAdressDto,
        });
      } else {
        throw new UnauthorizedException(
          'Only Admin can perform this operation',
        );
      }
    } else {
      throw new NotFoundException('Address not found');
    }
  }

  async remove(id: string, type: string): Promise<void> {
    const AddressFound = await this.prisma.address.findUnique({
      where: {
        id,
      },
    });
    if (AddressFound) {
      if (type == 'admin') {
        await this.prisma.address.delete({
          where: {
            id,
          },
        });
      } else {
        throw new UnauthorizedException(
          'Only Admin can perform this operation',
        );
      }
    } else {
      throw new NotFoundException('Address not found');
    }
  }
}
