export interface Card {
  id: number;
  cardNumber: string;
  expiryDate: string;
  accountId: number;
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

export interface Payment {
  id: number;
  amount: number;
  type: 'PAYMENT' | 'TOPUP';
  description: string | null;
  createdAt: string;
}

export interface CardDetails {
  id: number;
  cardNumber: string;
  expiryDate: string;
  accountId: number;
  account: Account;
}

export interface AccountUser {
  id: number;
  login: string;
  role: 'CLIENT' | 'ADMIN';
}

export interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  isBlocked: boolean;
  user: AccountUser;
}