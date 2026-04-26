import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Account } from './Account';

export type PaymentType = 'PAYMENT' | 'TOPUP';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'varchar' })
  type!: PaymentType;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'account_id' })
  accountId!: number;

  @ManyToOne(() => Account, (account) => account.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account!: Account;

  @Column({ name: 'source_card_id', type: 'int', nullable: true })
sourceCardId!: number | null;

@Column({ name: 'destination_card_id', type: 'int', nullable: true })
destinationCardId!: number | null;
}