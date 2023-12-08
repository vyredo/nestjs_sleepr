import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations/reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { commonBootstrap } from '@app/common/bootstrap/bootstrap';

commonBootstrap({
  module: ReservationsModule,
  microservicesOpt: {
    transport: Transport.TCP,
  },
});
