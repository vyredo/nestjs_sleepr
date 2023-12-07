import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/models/users.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserDocument> {
    try {
      const user = await this.usersService.verifyUser(email, password);
      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
