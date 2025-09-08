import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { authPayload } from './dto/auth-payload.dto';
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) { };

  async validateUsers(email: string, password: string ) {
    const user = await this.usersService.findByEmail(email)
    if (user) {
      if (user && await bcrypt.compare(password, user?.password)) {
        const { password, ...results } = user;
        return results
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    }
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await this.usersService.create({ email: email, password: hashedPassword })
    return user
  }

}