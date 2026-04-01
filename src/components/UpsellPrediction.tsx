import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Users, Target, ArrowUpRight } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { TrendData } from '../types';

interface UpsellPredictionProps {
  monthlyTrends: TrendData[];
  currentAdvancedCount: number;
}

export const UpsellPrediction: React.FC<UpsellPredictionProps> = ({ monthlyTrends, currentAdvancedCount }) => {
  const [totalEmployees, setTotalEmployees] = useState<number>(1000);
  const [manualGrowthRate, setManualGrowthRate] = useState<number | null>(null);

  const historicalGrowthRate = useMemo(() => {
    if (monthlyTrends.length < 2) return 0.05;

    let totalGrowth = 0;
    let count = 0;

    for (let i = 1; i < monthlyTrends.length; i++) {
      const prev = monthlyTrends[i - 1].advancedCreators;
      const curr = monthlyTrends[i].advancedCreators;
      
      if (prev > 0) {
        totalGrowth += (curr - prev) / prev;
        count++;
      }
    }

    return count > 0 ? totalGrowth / count : 0.05;
  }, [monthlyTrends]);

  const growthRate = manualGrowthRate !== null ? manualGrowthRate / 100 : historicalGrowthRate;

  const forecastData = useMemo(() => {
    const data = [];
    
    monthlyTrends.forEach(t => {
      data.push({
        name: t.name,
        actual: t.advancedCreators,
        predicted: null,
        isPrediction: false
      });
    });

    let lastCount = currentAdvancedCount;
    if (monthlyTrends.length > 0) {
      lastCount = monthlyTrends[monthlyTrends.length - 1].advancedCreators;
    }

    const lastDateStr = monthlyTrends.length > 0 ? monthlyTrends[monthlyTrends.length - 1].name : new Date().toISOString();
    let lastDate = new Date();
    const dateMatch = lastDateStr.match(/(\d{4})年(\d{1,2})月/);
    if (dateMatch) {
      lastDate = new Date(parseInt(dateMatch[1]), parseInt(dateMatch[2]) - 1);
    }

    for (let i = 1; i <= 12; i++) {
      lastDate.setMonth(lastDate.getMonth() + 1);
      const nextCount = Math.min(totalEmployees, Math.round(lastCount * (1 + growthRate)));
      
      data.push({
        name: `${lastDate.getFullYear()}年${lastDate.getMonth() + 1}月`,
        actual: null,
        predicted: nextCount,
        isPrediction: true
      });
      lastCount = nextCount;
    }

    return data;
  }, [monthlyTrends, currentAdvancedCount, growthRate, totalEmployees]);

  const predictedCountIn12Months = forecastData[forecastData.length - 1]?.predicted || currentAdvancedCount;
  const ndr = currentAdvancedCount > 0 ? (predictedCountIn12Months / currentAdvancedCount) * 100 : 100;
  const penetrationRate = totalEmployees > 0 ? (currentAdvancedCount / totalEmployees) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-rose-50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-rose-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">企业 Upsell 预测 (NDR 分析)</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              企业总人数
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min={currentAdvancedCount}
                value={totalEmployees}
                onChange={(e) => setTotalEmployees(Math.max(currentAdvancedCount, parseInt(e.target.value) || 0))}
                className="block w-full rounded-lg border-gray-300 pl-10 pr-4 py-2 focus:border-rose-500 focus:ring-rose-500 sm:text-sm border"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              当前渗透率: <span className="font-medium text-gray-900">{penetrationRate.toFixed(1)}%</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              月均增长率预测 (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={manualGrowthRate !== null ? manualGrowthRate : (historicalGrowthRate * 100).toFixed(1)}
                onChange={(e) => setManualGrowthRate(parseFloat(e.target.value))}
                className="block w-full rounded-lg border-gray-300 pl-4 pr-8 py-2 focus:border-rose-500 focus:ring-rose-500 sm:text-sm border"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {manualGrowthRate === null ? '基于历史数据自动计算' : '手动设定'}
            </p>
          </div>

          <div className="p-4 bg-rose-50 rounded-lg border border-rose-100">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-rose-600" />
              <p className="text-sm text-rose-700 font-medium">未来 1 年 NDR 预测</p>
            </div>
            <p className="text-3xl font-bold text-rose-900">{ndr.toFixed(1)}%</p>
            <div className="mt-2 text-xs text-rose-700 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              预计增长: {predictedCountIn12Months - currentAdvancedCount} 个账号
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6B7280', fontSize: 12}} 
                dy={10}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6B7280', fontSize: 12}} 
              />
              <Tooltip 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
              />
              <Legend />
              <ReferenceLine x={monthlyTrends.length > 0 ? monthlyTrends[monthlyTrends.length - 1].name : ''} stroke="#9CA3AF" strokeDasharray="3 3" label="预测开始" />
              <Line 
                type="monotone" 
                dataKey="actual" 
                name="历史数据" 
                stroke="#6366F1" 
                strokeWidth={3}
                dot={{r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#fff'}}
                connectNulls
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                name="预测趋势" 
                stroke="#F43F5E" 
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{r: 4, fill: '#F43F5E', strokeWidth: 2, stroke: '#fff'}}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
