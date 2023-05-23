/**
 * Transaction model
 */
export interface Transaction {
  // serial id of the transaction
  id?: number;

  // serial id of the merchant
  merchantID?: number;

  // transaction amount
  amount?: number;

  // transaction date
  date?: string;
}

/**
 * Transaction Request model
 */
export interface TransactionRequest {
  // serial id of the transaction
  id?: number;

  // name of the merchant for the transaction
  merchant?: string;

  // category of the merchant for the transaction
  category?: string;

  // multiplier of the category of the merchant for the transaction
  multiplier?: number;

  // amount of the transaction
  amount?: number;

  // date of the transaction
  date?: string;
}
