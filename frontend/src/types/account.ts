export interface Card {
  id: number;
  cardNumber: string;
  expiryDate: string;
}

export interface Payment {
  id: number;
  amount: number;
  type: 'PAYMENT' | 'TOPUP';
  description: string;
  createdAt: string;
}

export interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  isBlocked: boolean;
}

export interface AccountDetails {
  account: Account;
  cards: Card[];
  payments: Payment[];
}