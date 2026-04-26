import api from './axios';
import type {
  AdminAccount,
  AdminAccountDetails,
  AdminCardDetails,
} from '../types/account';

export async function getAllAccountsRequest(search = ''): Promise<AdminAccount[]> {
  const response = await api.get<AdminAccount[]>('/admin/accounts', {
    params: { search },
  });

  return response.data;
}

export async function getAdminAccountDetailsRequest(
  accountId: number
): Promise<AdminAccountDetails> {
  const response = await api.get<AdminAccountDetails>(`/admin/accounts/${accountId}`);
  return response.data;
}

export async function getAdminCardDetailsRequest(
  accountId: number,
  cardId: number
): Promise<AdminCardDetails> {
  const response = await api.get<AdminCardDetails>(
    `/admin/accounts/${accountId}/cards/${cardId}`
  );
  return response.data;
}

export async function blockAccountRequest(accountId: number): Promise<void> {
  await api.patch(`/admin/accounts/${accountId}/block`);
}

export async function unblockAccountRequest(accountId: number): Promise<void> {
  await api.patch(`/admin/accounts/${accountId}/unblock`);
}

export async function createClientRequest(login: string, password: string) {
  const response = await api.post('/admin/users/create-client', {
    login,
    password,
  });

  return response.data;
}

export async function createAdminRequest(login: string, password: string) {
  const response = await api.post('/admin/users/create-admin', {
    login,
    password,
  });

  return response.data;
}

export async function addCardToAccountRequest(
  accountId: number,
  expiryDate: string
) {
  const response = await api.post(`/admin/accounts/${accountId}/cards`, {
    expiryDate,
  });

  return response.data;
}