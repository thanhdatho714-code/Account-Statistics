import React, { useState, useEffect } from 'react';
import { Calculator, AlertCircle, CheckCircle2, Plane } from 'lucide-react';
import { clsx } from 'clsx';

interface BudgetCalculatorProps {
  totalAdvancedCreators: number;
}

const PRICE_PER_YEAR = 2490;

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({ totalAdvancedCreators }) => {
  const [discount, setDiscount] = useState<number>(100);
  const [budget, setBudget] = useState<string>('');
  const [showFlyMode, setShowFlyMode] = useState(false);

  const discountedPrice = PRICE_PER_YEAR * (discount / 100);
  const requiredBudget = totalAdvancedCreators * discountedPrice;
  
  const numericBudget = parseFloat(budget) || 0;
  const isBudgetInsufficient = numericBudget > 0 && numericBudget < requiredBudget;

  const purchasableCount = Math.floor(numericBudget / discountedPrice);
  const flyRate = totalAdvancedCreators > 0 ? (purchasableCount / totalAdvancedCreators) * 100 : 0;

  useEffect(() => {
    if (isBudgetInsufficient) {
      setShowFlyMode(true);
    } else {
      setShowFlyMode(false);
    }
  }, [isBudgetInsufficient]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Calculator className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">高级账号购买测算</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">目标账号数</p>
              <p className="text-xl font-bold text-gray-900">{totalAdvancedCreators} <span className="text-sm font-normal text-gray-500">个</span></p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">标准单价</p>
              <p className="text-xl font-bold text-gray-900">¥{PRICE_PER_YEAR.toLocaleString()} <span className="text-sm font-normal text-gray-500">/年</span></p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              折扣率 (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="block w-full rounded-lg border-gray-300 pl-4 pr-12 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              折后单价: <span className="font-medium text-indigo-600">¥{discountedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </p>
          </div>

          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <p className="text-sm text-indigo-700 mb-1 font-medium">建议总预算</p>
            <p className="text-2xl font-bold text-indigo-900">¥{requiredBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>

        <div className="space-y-6 border-t md:border-t-0 md:border-l border-gray-100 md:pl-8 pt-6 md:pt-0">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              客户预算 (元)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">¥</span>
              <input
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="输入客户预算..."
                className="block w-full rounded-lg border-gray-300 pl-8 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border"
              />
            </div>
          </div>

          {numericBudget > 0 && (
            <div className={clsx(
              "rounded-xl p-5 border transition-all duration-300",
              isBudgetInsufficient 
                ? "bg-amber-50 border-amber-200" 
                : "bg-emerald-50 border-emerald-200"
            )}>
              {isBudgetInsufficient ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Plane className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900">建议开启"随心飞"模式</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        预算低于建议金额，可通过超买模式覆盖所有用户。
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <p className="text-xs text-amber-800 mb-1">实际购买数量</p>
                      <p className="text-lg font-bold text-amber-900">{purchasableCount} <span className="text-xs font-normal">个</span></p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <p className="text-xs text-amber-800 mb-1">建议起飞比例</p>
                      <p className="text-lg font-bold text-amber-900">{flyRate.toFixed(2)}%</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-amber-800 bg-amber-100 p-3 rounded-lg">
                    <span className="font-semibold">方案说明：</span>
                    以 {discount}% 折扣购买 {purchasableCount} 个账号，设置 {flyRate.toFixed(2)}% 的起飞比例（即买 1 得 {(100/flyRate).toFixed(1)}），即可获得 {Math.floor(purchasableCount / (flyRate/100))} 个高级账号权益，覆盖 {totalAdvancedCreators} 名目标用户。
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-emerald-900">预算充足</h4>
                    <p className="text-sm text-emerald-700 mt-1">
                      当前预算足以覆盖所有 {totalAdvancedCreators} 名高级用户的授权费用。
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
