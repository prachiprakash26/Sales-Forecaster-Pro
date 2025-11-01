
export interface SalesRecord {
  date: Date;
  store: string;
  product: string;
  sales: number;
}

export interface ChartDataPoint {
  date: string;
  sales: number | null;
  forecast?: number;
  confidenceRange?: [number, number];
}
