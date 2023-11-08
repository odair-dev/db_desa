import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertiesRepository } from './repositories/properties.repository';

@Injectable()
export class PropertiesService {
  constructor(private readonly repository: PropertiesRepository) {}

  create(type: string, createPropertyDto: CreatePropertyDto) {
    return this.repository.create(type, createPropertyDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findOne(id);
  }

  update(id: string, type: string, updatePropertyDto: UpdatePropertyDto) {
    return this.repository.update(id, type, updatePropertyDto);
  }

  remove(id: string, type: string) {
    return this.repository.remove(id, type);
  }
}
