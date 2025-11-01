import React from 'react';

interface ForecastMetricsProps {
    totalForecast: number;
    growthPercentage: number | null;
    seasonalBaseline: number;
    accuracy: number | null;
}

const MetricCard: React.FC<{ title: string; value: string; subtext: string;}> = ({ title, value, subtext }) => (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        <p className="text-xs text-slate-500 mt-1 flex-grow">{subtext}</p>
    </div>
);

const ForecastMetrics: React.FC<ForecastMetricsProps> = ({ totalForecast, growthPercentage, seasonalBaseline, accuracy }) => {
    if (totalForecast === 0) return null;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <MetricCard 
                title="Total Forecasted Sales"
                value={formatCurrency(totalForecast)}
                subtext="For next quarter (12 weeks)"
            />
            <MetricCard 
                title="Projected Growth (YoY)"
                value={growthPercentage !== null ? `${growthPercentage > 0 ? '+' : ''}${growthPercentage.toFixed(1)}%` : 'N/A'}
                subtext="Compared to the same quarter last year"
            />
            <MetricCard 
                title="Same Qtr Last Year (Baseline)"
                value={formatCurrency(seasonalBaseline)}
                subtext="Actual sales from the same 12-week period last year"
            />
            <MetricCard 
                title="Forecast Accuracy (MAPE)"
                value={accuracy !== null ? `${accuracy.toFixed(2)}%` : 'N/A'}
                subtext="Mean Absolute Percentage Error. Lower is better."
            />
        </div>
    );
};

export default ForecastMetrics;
