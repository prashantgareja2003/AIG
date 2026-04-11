import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Download, 
  MoreVertical, 
  Plus, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Printer,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  TrendingUp,
  DollarSign
} from "lucide-react";
import toast from 'react-hot-toast';

const allInvoices = [
  { id: "INV-001", client: "Acme Corp", email: "billing@acme.com", amount: 3250.00, status: "paid", date: "Mar 28, 2026", due: "Apr 28, 2026", items: 3 },
  { id: "INV-002", client: "TechStart Inc", email: "finance@techstart.com", amount: 1800.00, status: "pending", date: "Mar 25, 2026", due: "Apr 10, 2026", items: 2 },
  { id: "INV-003", client: "Design Studio", email: "accounts@designstudio.com", amount: 4500.00, status: "paid", date: "Mar 22, 2026", due: "Apr 22, 2026", items: 5 },
  { id: "INV-004", client: "Cloud Nine", email: "payments@cloudnine.com", amount: 2100.00, status: "overdue", date: "Mar 18, 2026", due: "Mar 30, 2026", items: 2 },
  { id: "INV-005", client: "GreenLeaf Co", email: "billing@greenleaf.com", amount: 6750.00, status: "paid", date: "Mar 15, 2026", due: "Apr 15, 2026", items: 4 },
  { id: "INV-006", client: "Urban Flow", email: "finance@urbanflow.com", amount: 1200.00, status: "pending", date: "Mar 10, 2026", due: "Mar 25, 2026", items: 1 },
  { id: "INV-007", client: "Nexus Solutions", email: "billing@nexus.com", amount: 8900.00, status: "paid", date: "Mar 5, 2026", due: "Apr 5, 2026", items: 6 },
  { id: "INV-008", client: "Bright Innovations", email: "accounts@bright.com", amount: 3400.00, status: "draft", date: "Mar 1, 2026", due: "Apr 1, 2026", items: 3 },
];

const statusStyles = {
  paid: { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle, label: "Paid" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", icon: Clock, label: "Pending" },
  overdue: { bg: "bg-rose-50", text: "text-rose-700", icon: AlertCircle, label: "Overdue" },
  draft: { bg: "bg-slate-100", text: "text-slate-600", icon: FileText, label: "Draft" },
};

const filterTabs = [
  { id: "All", label: "All Invoices", icon: FileText },
  { id: "paid", label: "Paid", icon: CheckCircle },
  { id: "pending", label: "Pending", icon: Clock },
  { id: "overdue", label: "Overdue", icon: AlertCircle },
  { id: "draft", label: "Draft", icon: FileText }
];

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const itemsPerPage = 5;

  // Calculate stats
  const stats = useMemo(() => {
    const total = allInvoices.length;
    const paid = allInvoices.filter(i => i.status === "paid").length;
    const pending = allInvoices.filter(i => i.status === "pending").length;
    const overdue = allInvoices.filter(i => i.status === "overdue").length;
    const totalRevenue = allInvoices.reduce((sum, i) => sum + i.amount, 0);
    const paidRevenue = allInvoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
    
    return { total, paid, pending, overdue, totalRevenue, paidRevenue };
  }, []);

  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    let filtered = allInvoices.filter(inv => {
      const matchesSearch = inv.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           inv.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === "All" || inv.status === activeFilter;
      return matchesSearch && matchesFilter;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch(sortBy) {
        case "amount":
          aVal = a.amount;
          bVal = b.amount;
          break;
        case "client":
          aVal = a.client;
          bVal = b.client;
          break;
        default:
          aVal = new Date(a.date);
          bVal = new Date(b.date);
      }
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, activeFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAction = (action, invoice) => {
    switch(action) {
      case "view":
        toast.success(`Viewing invoice ${invoice.id}`);
        break;
      case "email":
        toast.success(`Email sent to ${invoice.email}`);
        break;
      case "print":
        toast.success(`Printing invoice ${invoice.id}`);
        break;
      case "delete":
        toast.error(`Invoice ${invoice.id} deleted`);
        break;
    }
    setShowActionsMenu(null);
  };

  const handleExport = () => {
    toast.success("Exporting invoices to CSV...");
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-indigo-200 text-xs mt-1">From {stats.total} invoices</p>
            </div>
            <DollarSign size={32} className="text-indigo-200" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Paid Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${stats.paidRevenue.toLocaleString()}</p>
              <p className="text-emerald-600 text-xs mt-1">From {stats.paid} invoices</p>
            </div>
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${allInvoices.filter(i => i.status === "pending").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
              </p>
              <p className="text-amber-600 text-xs mt-1">{stats.pending} pending invoices</p>
            </div>
            <Clock size={32} className="text-amber-500" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-5 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Overdue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.overdue}</p>
              <p className="text-rose-600 text-xs mt-1">Needs attention</p>
            </div>
            <AlertCircle size={32} className="text-rose-500" />
          </div>
        </motion.div>
      </div>

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all your invoices</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200"
        >
          <Plus size={18} /> Create New Invoice
        </motion.button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 items-center gap-4 w-full">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search by client, invoice number or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="hidden lg:flex items-center bg-gray-100 p-1 rounded-xl">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                    isActive 
                    ? "bg-white text-indigo-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            <Download size={16} />
            <span className="text-sm font-medium hidden sm:inline">Export</span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Filter Dropdown */}
      <div className="lg:hidden">
        <select 
          value={activeFilter}
          onChange={(e) => {
            setActiveFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500"
        >
          {filterTabs.map((tab) => (
            <option key={tab.id} value={tab.id}>{tab.label}</option>
          ))}
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort("id")}>
                  Invoice
                  {sortBy === "id" && (sortOrder === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort("client")}>
                  Client
                  {sortBy === "client" && (sortOrder === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort("amount")}>
                  Amount
                  {sortBy === "amount" && (sortOrder === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort("date")}>
                  Date
                  {sortBy === "date" && (sortOrder === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence mode="wait">
                {paginatedInvoices.map((inv, idx) => {
                  const StatusIcon = statusStyles[inv.status].icon;
                  return (
                    <motion.tr 
                      key={inv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-semibold text-gray-700">{inv.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{inv.client}</p>
                          <p className="text-xs text-gray-500">{inv.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">${inv.amount.toLocaleString()}</span>
                        <p className="text-xs text-gray-500">{inv.items} items</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${statusStyles[inv.status].bg} ${statusStyles[inv.status].text}`}>
                          <StatusIcon size={12} />
                          {statusStyles[inv.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{inv.date}</p>
                        <p className="text-xs text-gray-400">Due: {inv.due}</p>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAction("view", inv)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                            title="View Invoice"
                          >
                            <Eye size={16} />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAction("email", inv)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                            title="Email Invoice"
                          >
                            <Mail size={16} />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAction("print", inv)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                            title="Print Invoice"
                          >
                            <Printer size={16} />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAction("delete", inv)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Invoice"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filteredInvoices.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <div className="text-gray-300 mb-3">
              <Search size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 font-medium">No invoices found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
          </motion.div>
        )}

        {/* Pagination */}
        {filteredInvoices.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}