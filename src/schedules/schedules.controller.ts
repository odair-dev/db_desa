import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import {
  ContactEmailDto,
  CreateScheduleDto,
  FindScheduleDto,
} from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('property/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createScheduleDto: CreateScheduleDto,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.schedulesService.create(req.user.id, id, createScheduleDto);
  }

  @HttpCode(200)
  @Post('contato')
  contact(@Body() contactEmailDto: ContactEmailDto) {
    return this.schedulesService.contact(contactEmailDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    return this.schedulesService.findAll(req.user.id, req.user.type);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.schedulesService.findOne(id, req.user.id, req.user.type);
  }

  @HttpCode(200)
  @Post('free/schedules')
  findFreeSchedule(@Body() findScheduleDto: FindScheduleDto) {
    return this.schedulesService.findFreeSchedule(
      findScheduleDto.schedule,
      findScheduleDto.date,
    );
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(
      id,
      req.user.id,
      req.user.type,
      updateScheduleDto,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.schedulesService.remove(id, req.user.id, req.user.type);
  }
}
