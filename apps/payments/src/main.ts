import { PaymentsModule } from './payments.module';
import { Transport } from '@nestjs/microservices';
import { commonBootstrap } from '@app/common/bootstrap/bootstrap';

commonBootstrap({
  module: PaymentsModule,
  microservicesOpt: {
    transport: Transport.TCP,
  },
});
