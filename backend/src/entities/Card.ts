import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from './Account';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, name: 'card_number' })
  cardNumber!: string;

  @Column({ name: 'expiry_date' })
  expiryDate!: string;

  @Column({ name: 'account_id' })
  accountId!: number;

  @ManyToOne(() => Account, (account) => account.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account!: Account;
}