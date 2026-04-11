// InvoicePreview.jsx
import React, { forwardRef } from "react";
import { motion } from "framer-motion";

const InvoicePreview = forwardRef(function InvoicePreview({ formData, items, taxRate, discount }, ref) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const formatDate = (date) => {
    if (!date) return "—";
    if (date instanceof Date) return date.toLocaleDateString();
    return date.toString();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl p-4 md:p-6 lg:p-8 border border-slate-200 relative overflow-hidden"
    >
      {/* Brand Accent */}
      <div className="absolute top-0 left-0 w-full h-1 md:h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600" />

      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 md:mb-10">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">INVOICE</h2>
          <p className="text-xs font-mono text-slate-400 mt-1">{formData.invoiceNumber || "INV-000"}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm md:text-base font-bold text-slate-900">{formData.fromName || "Your Company"}</p>
          <p className="text-xs md:text-sm text-slate-500 mt-1 whitespace-pre-line leading-relaxed">
            {formData.fromAddress || "Business Address"}
          </p>
        </div>
      </div>

      {/* Info Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-10">
        <div>
          <p className="text-[10px] md:text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Bill To</p>
          <p className="text-sm md:text-base font-bold text-slate-900">{formData.clientName || "Client Name"}</p>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">{formData.clientEmail}</p>
          <p className="text-xs md:text-sm text-slate-500 whitespace-pre-line mt-1">{formData.clientAddress}</p>
        </div>
        <div className="text-left sm:text-right space-y-3 md:space-y-4">
          <div>
            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest">Issue Date</p>
            <p className="text-sm md:text-base font-semibold text-slate-700">{formatDate(formData.issueDate)}</p>
          </div>
          <div>
            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest">Due Date</p>
            <p className="text-sm md:text-base font-semibold text-slate-700">{formatDate(formData.dueDate)}</p>
          </div>
        </div>
      </div>

      {/* Items Table - Scrollable on mobile */}
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-[600px] md:min-w-0 px-4 md:px-0">
          <table className="w-full mb-6 md:mb-8">
            <thead>
              <tr className="border-b-2 border-slate-900 text-[10px] md:text-xs uppercase tracking-widest text-slate-400 font-bold">
                <th className="text-left pb-3">Description</th>
                <th className="text-center pb-3">Qty</th>
                <th className="text-right pb-3">Rate</th>
                <th className="text-right pb-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <tr key={idx} className="text-sm">
                  <td className="py-3 md:py-4 text-slate-800">{item.description || "—"}</td>
                  <td className="py-3 md:py-4 text-center text-slate-500 font-mono">{item.quantity}</td>
                  <td className="py-3 md:py-4 text-right text-slate-500 font-mono">${item.rate.toFixed(2)}</td>
                  <td className="py-3 md:py-4 text-right font-bold text-slate-900 font-mono">
                    ${(item.quantity * item.rate).toFixed(2)}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 md:py-10 text-center text-slate-300 italic">No items added yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end pt-4 border-t border-slate-100">
        <div className="w-full sm:w-64 md:w-72 space-y-2 md:space-y-2.5">
          <div className="flex justify-between text-xs md:text-sm text-slate-500">
            <span>Subtotal</span>
            <span className="font-mono font-bold text-slate-700">${subtotal.toFixed(2)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-xs md:text-sm text-rose-500">
              <span>Discount ({discount}%)</span>
              <span className="font-mono">-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          {taxRate > 0 && (
            <div className="flex justify-between text-xs md:text-sm text-slate-500">
              <span>Tax ({taxRate}%)</span>
              <span className="font-mono">+${taxAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="h-px bg-slate-200 my-2" />
          
          <div className="flex justify-between items-center">
            <span className="text-base md:text-lg font-bold text-slate-900">Total</span>
            <span className="text-xl md:text-2xl font-bold font-mono text-indigo-600">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 md:mt-8 pt-4 text-center border-t border-slate-100">
        <p className="text-[10px] md:text-xs text-slate-400 italic">Thank you for your business!</p>
      </div>
    </motion.div>
  );
});

export default InvoicePreview;