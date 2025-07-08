export interface Discount {
  discountId: number;
  percentage: number;
}

export interface Sku {
  distributionCenterId: number;
  evaluatedUnitPrice: number;
  id: number;
  integrationId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  deliveryPeriod: number;
  discounts: Discount[];
  divisionKey: number;
  id: number;
  identifier: string;
  initializedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orderFields: any[];
  paymentConditionId: number;
  priceListId: number;
  skus: Sku[];
  title: string;
  deliveryDate?: string;
}

export interface Record {
  brandId: number;
  customerId: number;
  id: number;
  idempotencyKey: string;
  initializedAt: string;
  orders: Order[];
}

export interface Sale {
  source?: string; //
  tenantId: string;
  compositeKey: string;
  brandId: number;
  createdAt: string;
  customerId: number;
  idempotencyKey: string;
  record: Record;
  updatedAt: string;
  userId: string;
  userKey: string;
}

export type SaleItemProps = {
  sale: Sale;
};
