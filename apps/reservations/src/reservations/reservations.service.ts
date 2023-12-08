import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UpdateReservationDto } from '../dto/update-reservation.dto';
import { ReservationRepository } from './reservations.repository';
import { Logger } from 'nestjs-pino';
import { PAYMENTS_SERVICE } from 'libs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly logger: Logger,
    @Inject(PAYMENTS_SERVICE) private paymentsServiceClient: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    return this.paymentsServiceClient
      .send('create_charge', createReservationDto.charge)
      .pipe(
        map(async (response) => {
          this.logger.warn('what is response', response);
          return this.reservationRepository.create({
            ...createReservationDto,
            invoiceId: response.id,
            timestamp: new Date(),
            userId,
          });
        }),
      );
  }

  async findAll() {
    return this.reservationRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({ _id });
  }
}
