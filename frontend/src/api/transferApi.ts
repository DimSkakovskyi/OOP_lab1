import api from './axios';

export async function createTransferRequest(
  fromCardId: number,
  toCardNumber: string,
  amount: number,
  description: string
): Promise<void> {
  await api.post('/transfers', {
    fromCardId,
    toCardNumber,
    amount,
    description,
  });
}