import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressRepository } from './repositories/address.repository';

@Injectable()
export class AdressesService {
  constructor(private readonly repository: AddressRepository) {}

  create(createAdressDto: CreateAddressDto) {
    return this.repository.create(createAdressDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findOne(id);
  }

  update(id: string, type: string, updateAdressDto: UpdateAddressDto) {
    return this.repository.update(id, type, updateAdressDto);
  }

  remove(id: string, type: string) {
    return this.repository.remove(id, type);
  }
}
