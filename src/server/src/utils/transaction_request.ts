export interface TransactionRequest {
  // merchant name
  merchant?: string;

  // transaction type
  type?: string;

  // transaction amount
  amount?: number;

  // transaction date
  date?: string;
}
