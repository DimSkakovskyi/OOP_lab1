import api from './axios';

export async function createPaymentRequest(accountId: number, amount: number, description: string): Promise<void> {
  await api.post('/payments', {
    accountId,
    amount,
    description,
  });
}

export async function createTopUpRequest(accountId: number, amount: number, description: string): Promise<void> {
  await api.post('/topups', {
    accountId,
    amount,
    description,
  });
}