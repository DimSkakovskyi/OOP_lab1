import api from './axios';
import type { UserAccount, AccountDetails, Card, CardDetails } from '../types/account';

export async function getAccountsRequest(): Promise<UserAccount[]> {
  const response = await api.get<UserAccount[]>('/accounts');
  return response.data;
}

export async function getAccountDetailsRequest(accountId: number): Promise<AccountDetails> {
  const response = await api.get<AccountDetails>(`/accounts/${accountId}`);
  return response.data;
}

export async function getAccountCardsRequest(accountId: number): Promise<Card[]> {
  const response = await api.get<Card[]>(`/accounts/${accountId}/cards`);
  return response.data;
}

export async function getCardDetailsRequest(accountId: number, cardId: number): Promise<CardDetails> {
  const response = await api.get<CardDetails>(`/accounts/${accountId}/cards/${cardId}`);
  return response.data;
}

export async function blockAccountRequest(accountId: number): Promise<void> {
  await api.patch(`/accounts/${accountId}/block`);
}