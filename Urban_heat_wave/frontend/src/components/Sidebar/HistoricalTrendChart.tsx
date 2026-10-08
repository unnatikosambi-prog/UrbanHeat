import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getHistoricalTrend } from '../../services/api';

interface HistoricalTrendChartProps {
  wardId: string;
  baseLst: number;
}

export const HistoricalTrendChart: React.FC<HistoricalTrendChartProps> = ({ wardId, baseLst }) => {
  const data = getHistoricalTrend(wardId, baseLst);

  return (
    <div className="w-full h-48 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#64748b', fontSize: 9 }} 
            tickFormatter={(str) => str.slice(5)}
          />
          <YAxis domain={[25, 45]} tick={{ fill: '#64748b', fontSize: 9 }} />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '11px'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }}
          />
          <Line 
            type="monotone" 
            dataKey="lst_mean_celsius" 
            name="Satellite LST (°C)" 
            stroke="#f97316" 
            strokeWidth={2} 
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="air_temp_celsius" 
            name="Air Temp 2m (°C)" 
            stroke="#38bdf8" 
            strokeWidth={1.5} 
            strokeDasharray="3 3"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
