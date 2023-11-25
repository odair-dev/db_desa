import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { AdressesModule } from './adresses/adresses.module';
import { SchedulesModule } from './schedules/schedules.module';
// import { BullModule } from '@nestjs/bull';
// import { TRANSCODE_QUEUE } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    PropertiesModule,
    AdressesModule,
    SchedulesModule,
    // BullModule.forRoot({
    //   redis: {
    //     host: 'localhost',
    //     port: 6379,
    //   },
    // }),
    // BullModule.registerQueue({
    //   name: TRANSCODE_QUEUE,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
