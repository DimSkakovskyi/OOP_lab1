import api from './axios';
import type { Account } from '../types/account';

export async function getAllAccountsRequest(search = ''): Promise<Account[]> {
  const response = await api.get<Account[]>('/admin/accounts', {
    params: { search },
  });

  return response.data;
}

export async function blockAccountRequest(accountId: number): Promise<void> {
  await api.patch(`/admin/accounts/${accountId}/block`);
}

export async function unblockAccountRequest(accountId: number): Promise<void> {
  await api.patch(`/admin/accounts/${accountId}/unblock`);
}