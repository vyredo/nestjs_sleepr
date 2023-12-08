import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateChargeDto } from 'libs/common';

export class CreateChargePaymentDto extends CreateChargeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
