//user/user.service.ts
import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { error } from 'console';
import { authPayload } from 'src/auth/dto/auth-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email: email } },)
    }

    async create(user: Partial<User>) {
        return await this.userRepository.save(this.userRepository.create(user));
    }

}
