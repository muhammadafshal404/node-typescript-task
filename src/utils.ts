import { StockItem, Transaction } from "./interface";


export function calculateStockLevel(sku: string, stockData: StockItem[], transactionsData: Transaction[]): number {
  // Find initial stock for the given SKU
  const stockItem = stockData.find(item => item.sku === sku);
  const initialStock = stockItem ? stockItem.stock : 0;

  // Calculate total quantity from transactions
  const totalTransactionsQty = transactionsData.reduce((total, transaction) => {
    if (transaction.sku === sku) {
      return total + (transaction.type === 'order' ? -transaction.qty : transaction.qty);
    }
    return total;
  }, 0);

  // Check if SKU exists in either stock or transactions
  const skuExistsInTransactions = transactionsData.some(transaction => transaction.sku === sku);
  if (!stockItem && !skuExistsInTransactions) {
    throw new Error(`SKU ${sku} does not exist in stock.json or transactions.json`);
  }

  // Calculate and return current stock level
  return initialStock + totalTransactionsQty;
}
