import api from './axios';
import type { Account } from '../types/account';

export async function getAllAccountsRequest(): Promise<Account[]> {
  const response = await api.get<Account[]>('/admin/accounts');
  return response.data;
}

export async function unblockAccountRequest(accountId: number): Promise<void> {
  await api.patch(`/admin/accounts/${accountId}/unblock`);
}