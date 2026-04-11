// InvoiceSummary.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Info } from "lucide-react";

export default function InvoiceSummary({ items, taxRate, discount, onTaxChange, onDiscountChange }) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const averageItemValue = items.length > 0 ? subtotal / items.length : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4 md:space-y-6"
    >
      {/* Summary Card */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
            <h3 className="text-sm md:text-base font-bold text-slate-800">Invoice Summary</h3>
          </div>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {showBreakdown ? 'Hide' : 'Show'} Details
          </button>
        </div>

        {/* Main Summary */}
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm md:text-base text-slate-600">Subtotal</span>
            <span className="text-sm md:text-base font-mono font-bold text-slate-700">
              ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Discount Input */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <label className="text-sm md:text-base text-slate-600">Discount</label>
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-2 py-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => onDiscountChange(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className="w-12 md:w-16 text-xs md:text-sm font-mono bg-transparent outline-none"
                />
                <span className="text-slate-400 text-xs md:text-sm">%</span>
              </div>
            </div>
            <span className="text-sm md:text-base font-mono text-rose-500">
              -${discountAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Tax Input */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <label className="text-sm md:text-base text-slate-600">Tax Rate</label>
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-2 py-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => onTaxChange(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className="w-12 md:w-16 text-xs md:text-sm font-mono bg-transparent outline-none"
                />
                <span className="text-slate-400 text-xs md:text-sm">%</span>
              </div>
            </div>
            <span className="text-sm md:text-base font-mono text-emerald-600">
              +${taxAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-3" />

          {/* Total */}
          <motion.div 
            className="flex items-center justify-between py-2"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-base md:text-lg font-bold text-slate-900">Total Due</span>
            <span className="text-xl md:text-2xl lg:text-3xl font-bold font-mono text-indigo-600">
              ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </motion.div>
        </div>

        {/* Breakdown Details */}
        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-100 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Info size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-500">Taxable Amount</span>
                </div>
                <span className="text-xs font-mono text-slate-600">
                  ${taxableAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <TrendingUp size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-500">Avg. Item Value</span>
                </div>
                <span className="text-xs font-mono text-slate-600">
                  ${averageItemValue.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Total Items</span>
                <span className="text-xs font-mono text-slate-600">{items.length}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-2.5 md:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-200 transition-colors"
        >
          Save Invoice
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-2.5 md:py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-medium transition-colors"
        >
          Preview
        </motion.button>
      </div>
    </motion.div>
  );
}