/**
 * Merchant model
 */
export interface Merchant {
  // serial id of the merchant
  id?: number;

  // merchant name
  name?: string;

  // serial id of the category of the merchant
  categoryID?: number;
}

/**
 * Merchant Request model
 */
export interface MerchantRequest {
  // serial id of the merchant
  id?: number;

  // name of the merchant
  name?: string;

  // name of the category of the merchant
  categoryName?: string;

  // multiplier of the category of the merchant
  multiplier?: number;
}
