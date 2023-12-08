import { AuthModule } from './auth.module';
import { Transport } from '@nestjs/microservices';
import { commonBootstrap } from '@app/common/bootstrap/bootstrap';

commonBootstrap({
  module: AuthModule,
  microservicesOpt: {
    transport: Transport.TCP,
  },
});
