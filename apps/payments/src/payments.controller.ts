import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';
import { CreateChargePaymentDto } from './dto/create-charge-payment.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  async createCharge(@Payload() data: CreateChargePaymentDto) {
    return this.paymentsService.createCharge(data);
  }
}
