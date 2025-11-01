import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/Header';
import FilterDropdown from './components/FilterDropdown';
import SalesChart from './components/SalesChart';
import Spinner from './components/Spinner';
import ForecastMetrics from './components/ForecastMetrics';
import { useSalesData } from './hooks/useSalesData';
import { generateForecast } from './services/forecastingService';
import { ChartDataPoint } from './types';

const FORECAST_PERIOD_WEEKS = 12;
const WEEKS_IN_YEAR = 52;

const FORECASTING_MESSAGES = [
    'Analyzing historical sales trends...',
    'Identifying seasonal patterns...',
    'Building predictive model...',
    'Calibrating forecast with market data...',
    "Finalizing next quarter's projections...",
];

const calculateMape = (actuals: number[], forecasts: number[]): number | null => {
  if (actuals.length !== forecasts.length || actuals.length === 0) {
    return null;
  }
  let errorSum = 0;
  let validPoints = 0;
  for (let i = 0; i < actuals.length; i++) {
    if (actuals[i] !== 0) {
      errorSum += Math.abs((actuals[i] - forecasts[i]) / actuals[i]);
      validPoints++;
    }
  }
  if (validPoints === 0) return null;
  return (errorSum / validPoints) * 100;
};


const App: React.FC = () => {
  const { allSalesData, stores, products, loading, error } = useSalesData();
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isForecasting, setIsForecasting] = useState(false);
  const [forecastingMessage, setForecastingMessage] = useState('');
  const [forecastingAccuracy, setForecastingAccuracy] = useState<number | null>(null);

  useEffect(() => {
    let intervalId: number | undefined;
    if (isForecasting) {
        let messageIndex = 0;
        setForecastingMessage(FORECASTING_MESSAGES[messageIndex]);
        intervalId = window.setInterval(() => {
            messageIndex = (messageIndex + 1) % FORECASTING_MESSAGES.length;
            setForecastingMessage(FORECASTING_MESSAGES[messageIndex]);
        }, 2500);
    }
    return () => {
        if (intervalId) {
            window.clearInterval(intervalId);
        }
    };
  }, [isForecasting]);

  const handleForecast = useCallback(async () => {
    if (!selectedStore || !selectedProduct) {
      alert('Please select a store and a product.');
      return;
    }

    setIsForecasting(true);
    setChartData([]);
    setForecastingAccuracy(null);

    try {
      const filteredData = allSalesData
        .filter(d => d.store === selectedStore && d.product === selectedProduct)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
      
      const validationPeriods = FORECAST_PERIOD_WEEKS;
      const forecastPeriods = FORECAST_PERIOD_WEEKS;
      const totalPeriodsToForecast = validationPeriods + forecastPeriods;

      if (filteredData.length > totalPeriodsToForecast) {
        
        const trainingData = filteredData.slice(0, -validationPeriods);
        const validationData = filteredData.slice(-validationPeriods);
        
        const trainingSeries = trainingData.map(d => d.sales);
        const fullForecastResult = await generateForecast(trainingSeries, totalPeriodsToForecast);
        
        // Use the first part of the forecast for accuracy
        const validationForecast = fullForecastResult.forecast.slice(0, validationPeriods);
        const actuals = validationData.map(d => d.sales);
        const accuracy = calculateMape(actuals, validationForecast);
        setForecastingAccuracy(accuracy);

        // Use the second part for the future forecast
        const futureForecast = fullForecastResult.forecast.slice(validationPeriods);
        const futureLowerBound = fullForecastResult.lowerBound.slice(validationPeriods);
        const futureUpperBound = fullForecastResult.upperBound.slice(validationPeriods);

        const historicalPoints: ChartDataPoint[] = filteredData.map(d => ({
          date: d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sales: d.sales,
        }));

        const lastDate = filteredData[filteredData.length - 1].date;
        const forecastPoints: ChartDataPoint[] = futureForecast.map((f, i) => {
          const forecastDate = new Date(lastDate);
          forecastDate.setDate(forecastDate.getDate() + (i + 1) * 7);
          return {
            date: forecastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sales: null,
            forecast: f,
            confidenceRange: [futureLowerBound[i], futureUpperBound[i]] as [number, number],
          };
        });
        
        const breakPoint: ChartDataPoint = {
            date: historicalPoints[historicalPoints.length-1].date,
            sales: historicalPoints[historicalPoints.length-1].sales,
            forecast: historicalPoints[historicalPoints.length-1].sales
        }

        setChartData([...historicalPoints, breakPoint, ...forecastPoints]);

      } else {
        alert('Not enough historical data to generate a forecast. Please select a different combination.');
        setChartData([]);
      }
    } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : 'An unknown error occurred while forecasting.');
        setChartData([]);
    } finally {
        setIsForecasting(false);
        setForecastingMessage('');
    }
  }, [selectedStore, selectedProduct, allSalesData]);
  
  const { totalForecast, growthPercentage, seasonalBaseline } = useMemo(() => {
    const forecastValues = chartData.filter(d => d.forecast !== undefined).map(d => d.forecast as number);
    if (forecastValues.length <= 1) return { totalForecast: 0, growthPercentage: null, seasonalBaseline: 0 };

    // The first forecast value is the breakpoint, so slice it off for calculations
    const actualForecasts = forecastValues.slice(1);
    const total = actualForecasts.reduce((sum, val) => sum + val, 0);

    const historicalValues = chartData.filter(d => d.sales !== null).map(d => d.sales as number);
    
    // Seasonal baseline: same quarter last year
    const seasonalBaselineStartIdx = historicalValues.length - FORECAST_PERIOD_WEEKS - WEEKS_IN_YEAR;
    const seasonalBaselineEndIdx = historicalValues.length - WEEKS_IN_YEAR;

    if (seasonalBaselineStartIdx < 0) {
        return { totalForecast: total, growthPercentage: null, seasonalBaseline: 0 };
    }

    const lastYearQuarterSum = historicalValues
        .slice(seasonalBaselineStartIdx, seasonalBaselineEndIdx)
        .reduce((sum, val) => sum + val, 0);
    
    if (lastYearQuarterSum === 0) return { totalForecast: total, growthPercentage: null, seasonalBaseline: lastYearQuarterSum };

    const growth = ((total - lastYearQuarterSum) / lastYearQuarterSum) * 100;
    
    return { totalForecast: total, growthPercentage: growth, seasonalBaseline: lastYearQuarterSum };
  }, [chartData]);


  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-400">{error}</p>;
    }
    
    if (isForecasting) {
        return (
            <div className="flex flex-col justify-center items-center h-96 bg-slate-800/50 rounded-lg">
                <Spinner />
                <p className="text-slate-400 mt-4">{forecastingMessage || 'Generating forecast with AI...'}</p>
            </div>
        )
    }

    if (chartData.length > 0) {
      return <SalesChart data={chartData} />;
    }

    return (
      <div className="flex flex-col justify-center items-center h-96 bg-slate-800/50 rounded-lg text-center p-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
        <h3 className="text-xl font-semibold text-slate-300">Ready to Forecast</h3>
        <p className="text-slate-400 mt-2">Select a store and product, then click "Generate Forecast" to see the future of your sales.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="bg-slate-800 p-4 rounded-lg shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1 lg:col-span-1">
              <FilterDropdown label="Store" value={selectedStore} onChange={e => setSelectedStore(e.target.value)} options={stores} placeholder="Select a region" />
            </div>
            <div className="md:col-span-1 lg:col-span-1">
              <FilterDropdown label="Product" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} options={products} placeholder="Select a product" />
            </div>
            <div className="md:col-span-1 lg:col-span-2 flex justify-start">
              <button
                onClick={handleForecast}
                disabled={!selectedStore || !selectedProduct || isForecasting}
                className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md transition duration-300 shadow-md disabled:shadow-none"
              >
                Generate Forecast
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {renderContent()}
        </div>
        
        <ForecastMetrics 
            totalForecast={totalForecast} 
            growthPercentage={growthPercentage}
            seasonalBaseline={seasonalBaseline}
            accuracy={forecastingAccuracy}
        />

      </main>
    </div>
  );
};

export default App;