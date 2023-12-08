import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
interface BootStrapParam {
  module: any;
  microservicesOpt?: {
    transport: Transport;
    options?: {
      host: string;
      port: number;
    };
  };
}
export async function commonBootstrap({
  module,
  microservicesOpt,
}: BootStrapParam) {
  const hasMicroservices = microservicesOpt && microservicesOpt.transport;

  const app = await NestFactory.create(module);
  const configService = app.get(ConfigService);

  if (hasMicroservices) {
    app.connectMicroservice({
      transport: Transport,
      options: microservicesOpt.options || {
        host: '0.0.0.0',
        port: configService.get('TCP_PORT'),
      },
    });
  }
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  if (hasMicroservices) {
    await app.startAllMicroservices();
  }

  await app.listen(configService.get('HTTP_PORT'));

  return {
    app,
    configService,
  };
}
