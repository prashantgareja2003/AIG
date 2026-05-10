// InvoiceLineItems.jsx
import React, { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Plus, Trash2, GripVertical, Copy, MoreVertical } from "lucide-react";

export default function InvoiceLineItems({ items, onChange }) {
  const [focusedIndex, setFocusedIndex] = useState(null);

  const addItem = () => {
    onChange([...items, { description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const duplicateItem = (index) => {
    const itemToDuplicate = items[index];
    const newItems = [...items];
    newItems.splice(index + 1, 0, { ...itemToDuplicate });
    onChange(newItems);
  };

  const updateItem = (index, field, value) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const handleReorder = (newItems) => {
    onChange(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="col-span-5">Description</div>
        <div className="col-span-2">Quantity</div>
        <div className="col-span-2">Rate (₹)</div>
        <div className="col-span-2 text-right">Amount</div>
        <div className="col-span-1"></div>
      </div>

      {/* Items List */}
      <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-2">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <Reorder.Item key={index} value={item}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center p-4 rounded-xl transition-all ${
                  focusedIndex === index 
                    ? 'bg-indigo-50/50 border border-indigo-200 shadow-sm' 
                    : 'hover:bg-slate-50 border border-transparent'
                } group`}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
              >
                {/* Mobile Label */}
                <div className="md:hidden text-xs font-medium text-slate-500 mb-1">Description</div>
                
                {/* Description */}
                <div className="col-span-1 md:col-span-5 flex items-center gap-2">
                  <div className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                  </div>
                  <input
                    placeholder="Service or product description"
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    className="w-full bg-transparent border-b border-slate-200 focus:border-indigo-500 outline-none py-2 transition-colors text-sm placeholder:text-slate-400"
                  />
                </div>

                {/* Quantity */}
                <div className="col-span-1 md:col-span-2">
                  <div className="md:hidden text-xs font-medium text-slate-500 mb-1">Quantity</div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateItem(index, "quantity", Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                      className="w-full text-center bg-slate-50 rounded-lg px-2 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                      onClick={() => updateItem(index, "quantity", item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Rate */}
                <div className="col-span-1 md:col-span-2">
                  <div className="md:hidden text-xs font-medium text-slate-500 mb-1">Rate (₹)</div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-2 py-2 bg-slate-50 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end">
                  <div className="md:hidden text-xs font-medium text-slate-500">Amount</div>
                  <span className="font-mono text-sm font-bold text-slate-900">
                    ₹{(item.quantity * item.rate).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1 md:col-span-1 flex items-center justify-end gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => duplicateItem(index)}
                    className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                  >
                    <Copy size={14} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItem(index)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {/* Add Item Button */}
      <motion.button
        onClick={addItem}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full py-3 md:py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center font-medium text-sm group"
      >
        <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
        Add New Line Item
      </motion.button>

      {/* Total Summary - Mobile */}
      {items.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-4 p-4 bg-slate-50 rounded-xl"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">Total Amount</span>
            <span className="text-xl font-bold text-indigo-600 font-mono">
              ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}