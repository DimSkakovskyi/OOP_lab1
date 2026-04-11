export interface PaymentPayload {
  accountId: number;
  amount: number;
  description?: string;
}