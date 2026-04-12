import api from './axios';
import type { Account, AccountDetails } from '../types/account';

export async function getAccountsRequest(): Promise<Account[]> {
  const response = await api.get<Account[]>('/accounts');
  return response.data;
}

export async function getAccountDetailsRequest(accountId: number): Promise<AccountDetails> {
  const response = await api.get<AccountDetails>(`/accounts/${accountId}`);
  return response.data;
}

export async function blockAccountRequest(accountId: number): Promise<void> {
  await api.patch(`/accounts/${accountId}/block`);
}