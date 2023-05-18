/**
 * Transaction model
 */
export interface Transaction {
  // serial id of the transaction
  id?: number;

  // serial id of the merchant
  merchantID?: number;

  // serial id of the transaction type
  typeID?: number;

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

  // type of the transaction
  type?: string;

  // amount of the transaction
  amount?: number;

  // date of the transaction
  date?: string;
}
