export type Coin = {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  image: string;
  price: number;
  day: number;
  week: number;
  cap: number;
  volume: number;
  supply: number;
  color: string;
};
export type SortKey = 'rank' | 'name' | 'price' | 'day' | 'week' | 'cap' | 'volume' | 'supply';
