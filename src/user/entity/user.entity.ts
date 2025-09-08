import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('User')
export class User {

    @PrimaryGeneratedColumn()
    id: string

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    role: userRole
}

export enum userRole {
    user,
    admin,
    manager
} 