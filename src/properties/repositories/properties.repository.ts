import { PrismaService } from 'src/prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { UpdatePropertyDto } from '../dto/update-property.dto';
import { PropertyEntity } from '../entities/property.entity';

@Injectable()
export class PropertiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    type: string,
    createPropertyDto: CreatePropertyDto,
  ): Promise<PropertyEntity> {
    if (type == 'admin') {
      return this.prisma.property.create({
        data: createPropertyDto,
      });
    } else {
      throw new UnauthorizedException('Only admin can perform this operation');
    }
  }

  async findAll(): Promise<PropertyEntity[]> {
    return this.prisma.property.findMany();
  }

  async findOne(id: string): Promise<PropertyEntity> {
    const propertyFound = await this.prisma.property.findUnique({
      where: {
        id,
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
        this.prisma.property.delete({
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
