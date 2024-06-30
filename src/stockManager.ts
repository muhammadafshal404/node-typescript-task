import { promises as fs } from 'fs';
import { calculateStockLevel } from './utils';
import { StockItem, Transaction } from './interface';



export async function getStockLevel(sku: string): Promise<{ sku: string, qty: number }> {
  try {
    const stockData: StockItem[] = JSON.parse(await fs.readFile('data/stock.json', 'utf-8'));
    const transactionsData: Transaction[] = JSON.parse(await fs.readFile('data/transactions.json', 'utf-8'));


    // check which skus are present in transactions.json but not in stocks.json
    // const skusNotInStock = transactionsData?.filter?.(tData => !stockData?.some(sData => sData?.sku === tData?.sku))?.map(fData => fData?.sku)
    // console.log(new Set(skusNotInStock))

    // Calculate current stock level
    const currentStockLevel = calculateStockLevel(sku, stockData, transactionsData);

    return { sku, qty: currentStockLevel };
  } catch (error) {
    throw new Error(`Error fetching stock level: ${error.message}`);
  }
}


getStockLevel("DXQ324600/17/58").then(result => console.log(result)).catch(err => console.log(err))