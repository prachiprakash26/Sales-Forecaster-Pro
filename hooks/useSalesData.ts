
import { useState, useEffect } from 'react';
import { getSalesData } from '../services/dataService';
import { SalesRecord } from '../types';

interface SalesDataHook {
  allSalesData: SalesRecord[];
  stores: string[];
  products: string[];
  loading: boolean;
  error: string | null;
}

export const useSalesData = (): SalesDataHook => {
  const [allSalesData, setAllSalesData] = useState<SalesRecord[]>([]);
  const [stores, setStores] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getSalesData();
        setAllSalesData(data);

        const uniqueStores = [...new Set(data.map((item) => item.store))];
        const uniqueProducts = [...new Set(data.map((item) => item.product))];
        
        setStores(uniqueStores.sort());
        setProducts(uniqueProducts.sort());
        
      } catch (err) {
        setError('Failed to load sales data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { allSalesData, stores, products, loading, error };
};
