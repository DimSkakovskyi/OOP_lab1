export interface AccountUser {
  id: number;
  login: string;
  role: 'CLIENT' | 'ADMIN';
}

export interface Card {
  id: number;
  cardNumber: string;
  expiryDate: string;
  accountId: number;
}

export interface Payment {
  id: number;
  amount: number;
  type: 'PAYMENT' | 'TOPUP';
  description: string | null;
  createdAt: string;
}

export interface UserAccount {
  id: number;
  accountNumber: string;
  balance: number;
  isBlocked: boolean;
}

export interface AdminAccount {
  id: number;
  accountNumber: string;
  balance: number;
  isBlocked: boolean;
  user: AccountUser;
}

export interface AccountDetails {
  account: UserAccount;
  cards: Card[];
  payments: Payment[];
}

export interface AdminAccountDetails {
  account: AdminAccount;
  cards: Card[];
  payments: Payment[];
}

export interface CardDetails {
  id: number;
  cardNumber: string;
  expiryDate: string;
  accountId: number;
  account: UserAccount;
}

export interface AdminCardDetails {
  id: number;
  cardNumber: string;
  expiryDate: string;
  accountId: number;
  account: AdminAccount;
}