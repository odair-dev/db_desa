import { PrismaService } from 'src/prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePropertyAndAddressDto } from '../dto/create-property.dto';
import { UpdatePropertyDto } from '../dto/update-property.dto';
import { PropertyEntity } from '../entities/property.entity';

@Injectable()
export class PropertiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    type: string,
    createPropertyDto: CreatePropertyAndAddressDto,
  ): Promise<PropertyEntity> {
    if (type == 'admin') {
      const { address, ...rest } = createPropertyDto;
      const newProperty = await this.prisma.property.create({
        data: rest,
      });
      const newAddress = { ...address, property_id: newProperty.id };
      await this.prisma.address.create({
        data: newAddress,
      });
      return this.prisma.property.findUnique({
        where: {
          id: newProperty.id,
        },
        include: {
          address: true,
        },
      });
    } else {
      throw new UnauthorizedException('Only admin can perform this operation');
    }
  }

  async findAll(): Promise<PropertyEntity[]> {
    return this.prisma.property.findMany({
      include: {
        address: true,
      },
    });
  }

  async findOne(id: string): Promise<PropertyEntity> {
    const propertyFound = await this.prisma.property.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
      },
    });
    if (propertyFound) {
      return propertyFound;
    } else {
      throw new NotFoundException('Property not found');
    }
  }

  async update(
    id: string,
    type: string,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<PropertyEntity> {
    const propertyFound = await this.prisma.property.findUnique({
      where: {
        id,
      },
    });
    if (propertyFound) {
      if (type == 'admin') {
        return this.prisma.property.update({
          where: {
            id,
          },
          include: {
            address: true,
          },
          data: updatePropertyDto,
        });
      } else {
        throw new UnauthorizedException(
          'Only admin can perform this operation',
        );
      }
    } else {
      throw new NotFoundException('Property not found');
    }
  }

  async remove(id: string, type: string): Promise<void> {
    const propertyFound = await this.prisma.property.findUnique({
      where: {
        id,
      },
    });
    if (propertyFound) {
      if (type == 'admin') {
        await this.prisma.property.delete({
          where: {
            id,
          },
        });
      } else {
        throw new UnauthorizedException(
          'Only admin can perform this operation',
        );
      }
    } else {
      throw new NotFoundException('Property not found');
    }
  }
}
