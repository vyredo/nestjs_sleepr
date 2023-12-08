import { NotificationsModule } from './notifications.module';
import { commonBootstrap } from '@app/common/bootstrap/bootstrap';
import { Transport } from '@nestjs/microservices';

commonBootstrap({
  module: NotificationsModule,
  microservicesOpt: {
    transport: Transport.TCP,
  },
});
