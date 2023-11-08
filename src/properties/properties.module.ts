import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertiesRepository } from './repositories/properties.repository';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService, PrismaService, PropertiesRepository],
})
export class PropertiesModule {}
