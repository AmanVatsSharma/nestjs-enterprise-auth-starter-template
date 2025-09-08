//auth/entities/refresh-token.entity.ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('RefreshToken')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid') id: string;       // token id
  @Column() userId: string;
  @Column() familyId: string;                      // same for the chain (rotated tokens)
  @Column() hashedToken: string;                   // argon2 hash
  @Column({type:'timestamptz'}) expiresAt: Date;
  @Column({default:false}) revoked: boolean;
  @Column({nullable:true}) replacedByTokenId: string;
  @Column({nullable:true}) createdByIp: string;
  @Column({nullable:true}) revokedByIp: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
