import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UpdateReservationDto } from '../dto/update-reservation.dto';
import { ReservationRepository } from './reservations.repository';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly logger: Logger,
  ) {}
  create(createReservationDto: CreateReservationDto, userId: string) {
    this.logger.log('createReservationDto >>>> ', createReservationDto);
    return this.reservationRepository.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId,
    });
  }

  findAll() {
    return this.reservationRepository.find({});
  }

  findOne(_id: string) {
    return this.reservationRepository.findOne({ _id });
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({ _id });
  }
}
