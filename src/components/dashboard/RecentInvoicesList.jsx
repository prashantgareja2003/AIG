// RecentInvoicesList.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, ArrowUpRight, Search, Filter, Download, Eye, Send, FileText } from "lucide-react";

const recentInvoices = [
  { id: "INV-001", client: "Acme Corp", amount: 3250.00, status: "paid", date: "Mar 28, 2026", email: "billing@acme.com" },
  { id: "INV-002", client: "TechStart Inc", amount: 1800.00, status: "pending", date: "Mar 25, 2026", email: "accounts@techstart.io" },
  { id: "INV-003", client: "Design Studio", amount: 4500.00, status: "paid", date: "Mar 22, 2026", email: "hello@designstudio.co" },
  { id: "INV-004", client: "Global Solutions", amount: 2750.00, status: "overdue", date: "Mar 15, 2026", email: "finance@globalsolutions.com" },
  { id: "INV-005", client: "Startup Labs", amount: 6200.00, status: "pending", date: "Mar 10, 2026", email: "billing@startuplabs.io" },
];

const statusStyles = {
  paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  overdue: "bg-rose-100 text-rose-700 border-rose-200",
};

export default function RecentInvoicesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const filteredInvoices = recentInvoices.filter(inv => {
    const matchesSearch = inv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-slate-800">Recent Invoices</h3>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">Manage and track your invoices</p>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Download size={18} className="text-slate-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 group"
          >
            View all 
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        
        <div className="flex gap-2">
          {["all", "paid", "pending", "overdue"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                statusFilter === status
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-2 md:space-y-3">
        <AnimatePresence>
          {filteredInvoices.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: i * 0.05 }}
              className="group relative"
            >
              <div 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 cursor-pointer"
                onClick={() => setSelectedInvoice(selectedInvoice === inv.id ? null : inv.id)}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-mono text-xs font-bold text-slate-600 group-hover:shadow-inner transition-all">
                    {inv.id.split("-")[1]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm md:text-base font-bold text-slate-800">{inv.client}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${statusStyles[inv.status]}`}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-slate-400">{inv.date}</p>
                      <p className="text-xs text-slate-400 hidden sm:block">{inv.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-4 mt-2 sm:mt-0">
                  <p className="text-sm md:text-base font-bold font-mono text-slate-700">
                    ${inv.amount.toLocaleString()}
                  </p>
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Expanded Actions */}
              <AnimatePresence>
                {selectedInvoice === inv.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 px-4 pb-4 ml-14">
                      <button className="flex items-center gap-2 px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                        <Eye size={12} /> View
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 text-xs bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                        <FileText size={12} /> PDF
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 text-xs bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                        <Send size={12} /> Send
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <p className="text-slate-400 text-sm">No invoices found</p>
        </div>
      )}
    </div>
  );
}