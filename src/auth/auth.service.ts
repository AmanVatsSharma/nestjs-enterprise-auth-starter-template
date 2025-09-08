//auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    // TODO: add redis service 
    // private redisSevice: RedisService 
  ) { };

  async validateUsers(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (user) {
      if (user && await argon2.verify(password, user?.password)) {
        const { password, ...results } = user;
        return results
      }
    }
    return null;
  }

  async login(user: any, ip?: string) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    }
    const accessToken = this.jwtService.sign(payload)

    // Refres Token Generate 
    const rawToken = randomBytes(64).toString('base64url')
    const hashedToken = (await argon2.hash(rawToken)).toString()
    const refreshId = uuidv4()
    const familyId = uuidv4() //first login

    const refreshEntity = await this.refreshTokenRepository.create({
      id: refreshId,
      userId: user.id,
      familyId: familyId,
      hashedToken: hashedToken,
      expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),  //7d
      createdByIp: ip
    });

    await this.refreshTokenRepository.save(refreshEntity);

    return {
      access_token: accessToken,
      refresh_token: `${refreshId}.${rawToken}`
    };
  }

  async refresh(combinedToken: string, ip?: string) {
    const [id, raw] = combinedToken.split('.')
    const tokenRow = await this.refreshTokenRepository.findOne({ where: { id } })

    if (!tokenRow) { throw new Error('Invalid refresh token') }

    if (tokenRow.revoked || tokenRow.expiresAt < new Date()) {
      // await this.revokefamily 
      throw new Error('Refresh token expired/revoked')
    }

    const valid = await argon2.verify(tokenRow.hashedToken, raw).catch(() => false);
    if (!valid) {
      // await this.revokeFamily(tokenRow.familyId, ip); // reuse detection
      throw new Error('Refresh Token reuse detected, family revoked')
    }

    // rotate 
    const newRaw = randomBytes(64).toString('base64');
    const newId = uuidv4();
    const newHashed = await argon2.hash(newRaw)
    const newTokenCreated = await this.refreshTokenRepository.create({
      id: newId,
      userId: tokenRow.userId,
      familyId: tokenRow.familyId,
      hashedToken: newHashed,
      expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
      createdByIp: ip
    })
    await this.refreshTokenRepository.save(newTokenCreated);

    tokenRow.revoked = true,
      tokenRow.replacedByTokenId = newId,
      tokenRow.revokedByIp = ip ?? ''
    await this.refreshTokenRepository.save(tokenRow)

    const payload = { sub: tokenRow.userId, }
    const accessToken = this.jwtService.sign(payload)

    return {
      access_token: accessToken,
      refresh_token: `${newId}.${newRaw}`
    }
  }

  private async revokeFamily(familyId: string, ip?: string) {
    await this.refreshTokenRepository.update({ familyId }, { revoked: true, revokedByIp: ip })
  }

  async register(email: string, password: string) {
    const hashedPassword = await argon2.hash(password)
    const user = await this.usersService.create({ email: email, password: hashedPassword })
    return user
  }

}