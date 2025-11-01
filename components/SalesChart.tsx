import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from 'recharts';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ChartDataPoint } from '../types';

interface SalesChartProps {
  data: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 border border-slate-700 p-3 rounded-md shadow-lg text-sm">
                <p className="label text-slate-300">{`${label}`}</p>
                {payload.map((pld: any, index: number) => (
                    <p key={index} style={{ color: pld.color }}>
                        {`${pld.name}: ${pld.value.toLocaleString('en-IN')}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};


const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  return (
    <div className="w-full h-96 bg-slate-800/50 p-4 rounded-lg shadow-inner flex flex-col">
      <div className="flex-grow w-full h-full overflow-hidden cursor-grab" role="application" aria-label="Sales data chart, zoomable and pannable">
        <TransformWrapper
          limitToBounds={true}
          minScale={0.8}
          initialScale={1}
          panning={{ velocityDisabled: true }}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: '100%', height: '100%' }}
          >
            <div style={{ width: '150%', height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickFormatter={(value) => new Intl.NumberFormat('en-IN', { notation: 'compact', compactDisplay: 'short' }).format(value as number)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{fontSize: "14px"}} />
                  <defs>
                    <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="confidenceRange"
                    stroke="none"
                    fill="url(#colorConfidence)"
                    name="95% Confidence"
                  />
                  <Line type="monotone" dataKey="sales" stroke="#22d3ee" strokeWidth={2} name="Historical Sales" dot={false} />
                  <Line type="monotone" dataKey="forecast" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 5" name="Forecasted Sales" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
      <p className="text-xs text-slate-500 text-center mt-2" aria-hidden="true">
        Tip: Use your mouse wheel or trackpad to zoom, and click and drag to pan the chart.
      </p>
    </div>
  );
};

export default SalesChart;