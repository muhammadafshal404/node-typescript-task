export interface StockItem {
  sku: string;
  stock: number;
}

export interface Transaction {
  sku: string;
  type: 'order' | 'refund';
  qty: number;
}