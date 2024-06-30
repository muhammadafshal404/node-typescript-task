import { promises as fs } from 'fs';
import { getStockLevel } from '../src/stockManager';
import { jest } from '@jest/globals';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  }
}));

const mockStockData = [
  { sku: "ABC123", stock: 100 },
  { sku: "DEF456", stock: 50 }
];

const mockTransactionsData = [
  { sku: "ABC123", type: "order", qty: 10 },
  { sku: "ABC123", type: "refund", qty: 5 },
  { sku: "DEF456", type: "order", qty: 20 },
  { sku: "GHI789", type: "order", qty: 10 }
];

describe('getStockLevel', () => {
  beforeEach(() => {
    (fs.readFile as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath === 'data/stock.json') {
        return Promise.resolve(JSON.stringify(mockStockData));
      }
      if (filePath === 'data/transactions.json') {
        return Promise.resolve(JSON.stringify(mockTransactionsData));
      }
      return Promise.reject(new Error('File not found'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns current stock level for a valid SKU in stock.json', async () => {
    const result = await getStockLevel('ABC123');
    expect(result).toEqual({ sku: 'ABC123', qty: 95 });
  });

  test('returns current stock level for another valid SKU in stock.json', async () => {
    const result = await getStockLevel('DEF456');
    expect(result).toEqual({ sku: 'DEF456', qty: 30 });
  });

  test('returns current stock level for a SKU only in transactions.json', async () => {
    const result = await getStockLevel('GHI789');
    expect(result).toEqual({ sku: 'GHI789', qty: -10 });
  });

  test('throws error if SKU does not exist in transactions.json and stock.json', async () => {
    await expect(getStockLevel('XYZ789')).rejects.toThrow('SKU XYZ789 does not exist in stock.json or transactions.json');
  });
});
