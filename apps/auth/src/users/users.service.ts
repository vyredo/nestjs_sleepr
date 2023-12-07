import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from './models/users.schema';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUser({ _id }: GetUserDto) {
    return this.usersRepository.findOne({ _id });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    let user: UserDocument | null = null;
    try {
      user = (await this.usersRepository.findOne({
        email: createUserDto.email,
      })) as UserDocument;
    } catch (err) {
      return;
    }

    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    const password = await bcrypt.hash(createUserDto.password, 10);
    return this.usersRepository.create({
      ...createUserDto,
      password,
    });
  }

  async findAll() {
    return this.usersRepository.find({});
  }

  async verifyUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (user && passwordIsValid) {
      return user;
    } else {
      throw new UnauthorizedException('Credentials are not valid ');
    }
  }
}
