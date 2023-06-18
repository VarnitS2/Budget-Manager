export interface Transaction {
  // serial id of the transaction
  id: number;

  // name of the merchant
  merchantName: string;

  // name of the category of the merchant
  categoryName: string;

  // multiplier of the category of the merchant
  categoryMultiplier: number;

  // amount of the transaction
  amount: number;

  // date of the transaction
  date: string;
}

export interface TransactionMetrics {
  // count of transactions
  transactionCount: number;

  // count of positive transactions
  positiveTransactionCount: number;

  // count of negative transactions
  negativeTransactionCount: number;

  // count of merchants
  merchantCount: number;

  // count of categories
  categoryCount: number;

  // count of days
  dayCount: number;

  // net amount
  balance: number;

  // net positive amount
  netPositive: number;

  // net negative amount
  netNegative: number;

  // average positive amount per transaction
  averagePositive: number;

  // average negative amount per transaction
  averageNegative: number;

  // maximum negative amount
  maximumNegative: number;

  // minimum negative amount
  minimumNegative: number;

  // positive per day
  positivePerDay: number;

  // negative per day
  negativePerDay: number;
}

export interface TransactionResponse {
  // array of transactions
  transactions: Transaction[];

  // transaction metrics
  metrics: TransactionMetrics;
}
