import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Download, Plus,
  ChevronLeft, ChevronRight,
  Eye, Trash2, X,
  CheckCircle, Clock, AlertCircle, FileText, DollarSign
} from "lucide-react";
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';



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
  const [allInvoices, setAllInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const itemsPerPage = 10;

  const fetchInvoices = async () => {
    try {
      const { apiGet } = await import('../api.js');
      const data = await apiGet('/invoices');
      setAllInvoices(data);
    } catch (error) {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const total = allInvoices.length;
    const paid = allInvoices.filter(i => i.status.toLowerCase() === "paid").length;
    const pending = allInvoices.filter(i => i.status.toLowerCase() === "pending").length;
    const overdue = allInvoices.filter(i => i.status.toLowerCase() === "overdue").length;
    const totalRevenue = allInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const paidRevenue = allInvoices.filter(i => i.status.toLowerCase() === "paid").reduce((sum, i) => sum + i.totalAmount, 0);
    
    return { total, paid, pending, overdue, totalRevenue, paidRevenue };
  }, [allInvoices]);

  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    let filtered = allInvoices.filter(inv => {
      const matchesSearch = inv.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === "All" || inv.status.toLowerCase() === activeFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch(sortBy) {
        case "amount":
          aVal = a.totalAmount;
          bVal = b.totalAmount;
          break;
        case "client":
          aVal = a.clientName;
          bVal = b.clientName;
          break;
        default:
          aVal = new Date(a.issueDate);
          bVal = new Date(b.issueDate);
      }
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [allInvoices, searchTerm, activeFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAction = async (action, invoice) => {
    switch(action) {
      case "view":
        setViewInvoice(invoice);
        break;
      case "email":
        Swal.fire({
          title: 'Send Email?',
          text: `Are you sure you want to send invoice ${invoice.invoiceNumber} to ${invoice.clientEmail}?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#4f46e5',
          cancelButtonColor: '#9ca3af',
          confirmButtonText: 'Yes, send it!'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire(
              'Sent!',
              `Invoice ${invoice.invoiceNumber} has been sent to ${invoice.clientEmail}.`,
              'success'
            );
          }
        });
        break;
      case "print":
        toast.success(`Printing invoice ${invoice.invoiceNumber}`);
        break;
      case "delete":
        Swal.fire({
          title: 'Are you sure?',
          text: `Do you really want to delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#9ca3af',
          confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const { apiDelete } = await import('../api.js');
              await apiDelete(`/invoices/${invoice.id}`);
              setAllInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
              Swal.fire('Deleted!', 'Invoice has been deleted.', 'success');
            } catch (error) {
              toast.error("Failed to delete invoice");
            }
          }
        });
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading invoices...</p>
      </div>
    );
  }

  return (
    <>
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
              <p className="text-2xl font-bold mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.paidRevenue.toLocaleString()}</p>
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
                ₹{allInvoices.filter(i => i.status.toLowerCase() === "pending").reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString()}
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
          onClick={() => (window.location.href = "/dashboard/create")}
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
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort("invoiceNumber")}>
                  Invoice
                  {sortBy === "invoiceNumber" && (sortOrder === "asc" ? " ↑" : " ↓")}
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
                  const status = inv.status.toLowerCase() || 'draft';
                  const StatusIcon = statusStyles[status]?.icon || FileText;
                  const style = statusStyles[status] || statusStyles.draft;
                  
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
                        <span className="text-sm font-mono font-semibold text-gray-700">{inv.invoiceNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{inv.clientName}</p>
                          <p className="text-xs text-gray-500">{inv.clientEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">₹{inv.totalAmount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${style.bg} ${style.text}`}>
                          <StatusIcon size={12} />
                          {style.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{new Date(inv.issueDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-400">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
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

    {/* View Invoice Modal */}
    <AnimatePresence>
      {viewInvoice && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setViewInvoice(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{viewInvoice.invoiceNumber}</h3>
                <p className="text-sm text-gray-500">{viewInvoice.clientName}</p>
              </div>
              <button onClick={() => setViewInvoice(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 font-medium uppercase">Status</p>
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full mt-1 ${
                    statusStyles[viewInvoice.status?.toLowerCase()]?.bg || 'bg-slate-100'
                  } ${
                    statusStyles[viewInvoice.status?.toLowerCase()]?.text || 'text-slate-600'
                  }`}>{viewInvoice.status}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 font-medium uppercase">Total Amount</p>
                  <p className="text-xl font-bold text-indigo-600 mt-1">₹{viewInvoice.totalAmount?.toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Issue Date</p>
                  <p className="text-sm font-semibold text-gray-800">{new Date(viewInvoice.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Due Date</p>
                  <p className="text-sm font-semibold text-gray-800">{new Date(viewInvoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Subtotal</p>
                  <p className="text-sm font-semibold text-gray-800">₹{viewInvoice.subtotal?.toLocaleString() || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Tax ({viewInvoice.taxRate}%)</p>
                  <p className="text-sm font-semibold text-gray-800">₹{viewInvoice.taxAmount?.toLocaleString() || '—'}</p>
                </div>
              </div>
              {viewInvoice.notes && (
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-xs text-amber-600 font-medium uppercase">Notes</p>
                  <p className="text-sm text-amber-800 mt-1">{viewInvoice.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={() => setViewInvoice(null)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-white transition-all"
              >Close</button>
              <button
                onClick={() => {
                  handleAction('delete', viewInvoice);
                  setViewInvoice(null);
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}