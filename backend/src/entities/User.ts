import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Account } from './Account';

export type UserRole = 'CLIENT' | 'ADMIN';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  login!: string;

  @Column()
  password!: string;

  @Column({ type: 'varchar', default: 'CLIENT' })
  role!: UserRole;

  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[];
}