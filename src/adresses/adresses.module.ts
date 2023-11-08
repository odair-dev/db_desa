import { Module } from '@nestjs/common';
import { AdressesService } from './adresses.service';
import { AdressesController } from './adresses.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressRepository } from './repositories/address.repository';

@Module({
  controllers: [AdressesController],
  providers: [AdressesService, PrismaService, AddressRepository],
})
export class AdressesModule {}
