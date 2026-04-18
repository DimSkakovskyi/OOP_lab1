import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Card } from './Card';
import { Payment } from './Payment';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, name: 'account_number' })
  accountNumber!: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  balance!: number;

  @Column({ name: 'is_blocked', default: false })
  isBlocked!: boolean;

  @Column({ name: 'user_id' })
  userId!: number;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Card, (card) => card.account)
  cards!: Card[];

  @OneToMany(() => Payment, (payment) => payment.account)
  payments!: Payment[];
}