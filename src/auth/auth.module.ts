//auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    UserModule,
    PassportModule,
    // JwtModule.register({
    //   secret: 'supersecret',
    //   signOptions: {
    //     expiresIn: '1h'
    //   }
    // })
    JwtModule.registerAsync({
      useFactory: async () => ({
        // privateKey: fs.readFileSync(process.env.JWT_PRIVATE_KEY, 'utf8'),
        // publicKey: fs.readFileSync(process.env.JWT_PUBLIC_KEY, 'utf8'),
        signOptions: { algorithm: 'RS256' },
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthResolver],
})
export class AuthModule { }
