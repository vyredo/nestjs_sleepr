import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';
import { NotificationsService } from 'apps/notifications/src/notifications.service';
import { NOTIFICATION_SERVICE } from 'libs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateChargePaymentDto } from './dto/create-charge-payment.dto';

@Injectable()
export class PaymentsService {
  stripeSecretKey: string;
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATION_SERVICE) private notificationsService: ClientProxy,
  ) {
    const env = this.configService.get('ENV');
    if (env === 'localhost') {
      this.stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY_TEST');
    } else {
      this.stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
    }

    this.stripe = new Stripe(this.stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
  }
  async createCharge({ amount, card, email }: CreateChargePaymentDto) {
    const _amt = Number(amount);
    if (_amt < 0) throw new Error('Amount must be greater than 0');
    if (isNaN(_amt)) throw new Error('Amount must be a number');

    if (this.configService.get('ENV') === 'localhost') {
      await this.chargeWithTestAccount(_amt);
    } else {
      await this.chargeWithRealAccount(card, _amt);
    }

    // after payment, email user

    this.notificationsService.emit('notify_email', {
      email,
    });
  }

  private async chargeWithRealAccount(
    card: CreateChargeDto['card'],
    amount: number,
  ) {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card,
    });

    const _amt = Number(amount);
    if (_amt < 0) throw new Error('Amount must be greater than 0');
    if (isNaN(_amt)) throw new Error('Amount must be a number');

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: _amt * 100, // 100cents
      currency: 'usd',
      payment_method: paymentMethod.id,
      confirm: true,
      payment_method_types: ['card'],
    });

    return paymentIntent;
  }

  private async chargeWithTestAccount(amount: number) {
    return await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: 'pm_card_visa',
      confirm: true,
      payment_method_types: ['card'],
    });
  }
}
