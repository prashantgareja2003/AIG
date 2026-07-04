import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Download, Plus, Mail,
  ChevronLeft, ChevronRight,
  Eye, Trash2, X,
  CheckCircle, Clock, AlertCircle, FileText, DollarSign
} from "lucide-react";
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const numberToWords = (num) => {
  if (!num || num === 0) return "Zero Rupees Only";
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const convertToWords = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertToWords(n % 100) : "");
    if (n < 100000) return convertToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convertToWords(n % 1000) : "");
    if (n < 10000000) return convertToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convertToWords(n % 100000) : "");
    return convertToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convertToWords(n % 10000000) : "");
  };
  
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  let words = convertToWords(rupees) + " Rupees";
  if (paise > 0) {
    words += " and " + convertToWords(paise) + " Paise";
  }
  return words + " Only";
};

const DynamicTemplate = ({ html, data, items }) => {
  if (!html) return <div className="p-10 text-center text-slate-400 italic">Rendering invoice...</div>;

  let renderedHtml = html;
  
  const fields = {
    invoiceNumber: data.invoiceNumber,
    issueDate: new Date(data.issueDate).toLocaleDateString('en-IN'),
    dueDate: new Date(data.dueDate).toLocaleDateString('en-IN'),
    fromName: data.fromName || "ShivShakti Enterprise",
    fromAddress: data.fromAddress || "Morbi, Gujarat",
    fromEmail: data.fromEmail || "billing@techsolutions.com",
    fromTagline: data.fromTagline || "BHADIYAD - MORBI - GUJARAT",
    fromGSTIN: data.fromGSTIN || "24AEWFS7552M1Z2",
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    clientAddress: data.clientAddress || "",
    clientGSTIN: data.clientGSTIN || "N/A",
    vehicleNumber: data.vehicleNumber || "N/A",
    timeOfRemoval: data.timeOfRemoval || "N/A",
    modeOfDelivery: data.modeOfDelivery || "N/A",
    stateCode: data.stateCode || "N/A",
    hsnCode: data.hsnCode || "N/A",
    taxableAmount: (data.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    subtotal: (data.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    taxRate: data.taxRate || 0,
    taxAmount: (data.taxAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    sgstRate: (data.taxRate || 0) / 2,
    sgstAmount: ((data.taxAmount || 0) / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    cgstRate: (data.taxRate || 0) / 2,
    cgstAmount: ((data.taxAmount || 0) / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    discountAmount: (data.discount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    total: (data.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    amountInWords: numberToWords(data.totalAmount),
    notes: data.notes || ""
  };

  Object.keys(fields).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    const value = fields[key] === undefined || fields[key] === null ? "" : fields[key];
    renderedHtml = renderedHtml.replace(regex, value);
  });

  // Ensure Rupee symbol is correctly rendered
  renderedHtml = renderedHtml.replace(/\u20B9/g, '&#8377;');

  const itemRegex = /{{#items}}([\s\S]*?){{\/items}}/g;
  renderedHtml = renderedHtml.replace(itemRegex, (match, content) => {
    return (data.items || []).map((item, idx) => {
      let itemHtml = content;
      itemHtml = itemHtml.replace(/{{index}}/g, idx + 1);
      itemHtml = itemHtml.replace(/{{description}}/g, item.description);
      itemHtml = itemHtml.replace(/{{quantity}}/g, item.quantity.toLocaleString('en-IN', { minimumFractionDigits: 2 }));
      itemHtml = itemHtml.replace(/{{rate}}/g, item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 }));
      itemHtml = itemHtml.replace(/{{hsnCode}}/g, item.hsnCode || data.hsnCode || "N/A");
      itemHtml = itemHtml.replace(/{{total}}/g, item.total.toLocaleString('en-IN', { minimumFractionDigits: 2 }));
      return itemHtml;
    }).join('');
  });

  return (
    <div 
      id="invoice-download-area"
      className="bg-white"
      dangerouslySetInnerHTML={{ __html: renderedHtml }} 
    />
  );
};



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
  const [templateHtml, setTemplateHtml] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const itemsPerPage = 10;

  // Bulk Email State
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
  const [bulkEmails, setBulkEmails] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [bulkSubject, setBulkSubject] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [sendingBulk, setSendingBulk] = useState(false);

  const handleInvoiceChange = (id) => {
    setSelectedInvoiceId(id);
    if (!id) {
      setBulkSubject("Important Invoicing Update");
      setBulkMessage("Dear Clients,\n\nPlease find attached the invoice updates.\n\nWarm regards,\nShivShakti Enterprise");
      return;
    }
    const inv = allInvoices.find(i => i.id === parseInt(id) || i.id === id);
    if (inv) {
      setBulkSubject(`Invoice ${inv.invoiceNumber} from ShivShakti Enterprise`);
      setBulkMessage(`Hello ${inv.clientName},\n\nPlease find attached details for invoice ${inv.invoiceNumber}.\n\nInvoice Number: ${inv.invoiceNumber}\nTotal Amount: INR ${inv.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\nDue Date: ${new Date(inv.dueDate).toLocaleDateString('en-IN')}\n\nThank you for your business!`);
      if (inv.clientEmail && !bulkEmails.includes(inv.clientEmail)) {
        setBulkEmails(prev => [...new Set([...prev, inv.clientEmail])]);
      }
    }
  };

  const handleAddEmail = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const email = emailInput.trim().replace(/,$/, '');
      if (!email) return;
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      
      if (bulkEmails.includes(email)) {
        toast.error("Email already added");
        return;
      }
      
      setBulkEmails(prev => [...prev, email]);
      setEmailInput("");
    }
  };

  const triggerAddEmail = () => {
    const email = emailInput.trim();
    if (!email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (bulkEmails.includes(email)) {
      toast.error("Email already added");
      return;
    }
    setBulkEmails(prev => [...prev, email]);
    setEmailInput("");
  };

  const handleRemoveEmail = (emailToRemove) => {
    setBulkEmails(prev => prev.filter(email => email !== emailToRemove));
  };

  const handleSendBulkEmail = async (e) => {
    e.preventDefault();
    if (bulkEmails.length === 0) {
      toast.error("Please add at least one recipient email");
      return;
    }
    if (!selectedInvoiceId) {
      toast.error("Please select an invoice to link");
      return;
    }
    if (!bulkSubject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!bulkMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSendingBulk(true);
    try {
      const { apiPost } = await import('../api.js');
      const response = await apiPost('/invoices/send-bulk-email', {
        emails: bulkEmails,
        subject: bulkSubject,
        message: bulkMessage,
        invoiceId: parseInt(selectedInvoiceId)
      });

      toast.success(response.message || "Bulk emails sent successfully!");
      setShowBulkEmailModal(false);
      setBulkEmails([]);
      setEmailInput("");
      setBulkSubject("");
      setBulkMessage("");
      setSelectedInvoiceId("");
    } catch (error) {
      console.error("Failed to send bulk emails:", error);
      toast.error(error.message || "Failed to send bulk emails");
    } finally {
      setSendingBulk(false);
    }
  };

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
        try {
          const { apiGet } = await import('../api.js');
          // Fetch full invoice details including items, subtotal, etc.
          const fullInvoice = await apiGet(`/invoices/${invoice.id}`);
          setViewInvoice(fullInvoice);
          setTemplateHtml(null);
          
          if (fullInvoice.templateId) {
              const data = await apiGet(`/templates/${fullInvoice.templateId}`);
              setTemplateHtml(data.htmlContent);
          }
        } catch (err) {
          console.error("Failed to load invoice details", err);
          toast.error("Could not load invoice details");
        }
        break;
      case "email":
        setSelectedInvoiceId(invoice.id);
        setBulkEmails([invoice.clientEmail]);
        setBulkSubject(`Invoice ${invoice.invoiceNumber} from ShivShakti Enterprise`);
        setBulkMessage(`Hello ${invoice.clientName},\n\nPlease find attached details for invoice ${invoice.invoiceNumber}.\n\nInvoice Number: ${invoice.invoiceNumber}\nTotal Amount: INR ${invoice.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\nDue Date: ${new Date(invoice.dueDate).toLocaleDateString('en-IN')}\n\nThank you for your business!`);
        setShowBulkEmailModal(true);
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
      case "markPaid":
        try {
          const { apiPut } = await import('../api.js');
          await apiPut(`/invoices/${invoice.id}/status`, { status: "Paid" });
          setAllInvoices(prev => prev.map(inv => 
            inv.id === invoice.id ? { ...inv, status: "Paid" } : inv
          ));
          if (viewInvoice && viewInvoice.id === invoice.id) {
            setViewInvoice({ ...viewInvoice, status: "Paid" });
          }
          toast.success("Invoice marked as Paid!");
        } catch (error) {
          toast.error("Failed to update status");
        }
        break;
    }
    setShowActionsMenu(null);
  };

  const handleExport = () => {
    if (allInvoices.length === 0) {
      toast.error("No invoices to export");
      return;
    }

    // Define CSV headers
    const headers = ["Invoice Number", "Client Name", "Issue Date", "Due Date", "Total Amount", "Status"];
    
    // Map invoice data to rows
    const rows = filteredInvoices.map(inv => [
      inv.invoiceNumber,
      inv.clientName,
      new Date(inv.issueDate).toLocaleDateString(),
      new Date(inv.dueDate).toLocaleDateString(),
      inv.totalAmount,
      inv.status
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `invoices_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Invoices exported successfully!");
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice-download-area');
    if (!element) {
      toast.error("Invoice content not ready");
      return;
    }

    const opt = {
      margin:       0.5,
      filename:     `${viewInvoice.invoiceNumber}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(element).save();
    toast.success("Downloading PDF...");
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
              <p className="text-2xl font-bold mt-1">{"\u20B9"}{stats.totalRevenue.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-900 mt-1">{"\u20B9"}{stats.paidRevenue.toLocaleString()}</p>
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
                {"\u20B9"}{allInvoices.filter(i => i.status.toLowerCase() === "pending").reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString()}
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
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedInvoiceId("");
              setBulkEmails([]);
              setBulkSubject("Important Invoicing Update");
              setBulkMessage("Dear Clients,\n\nPlease find attached the invoice updates.\n\nWarm regards,\nShivShakti Enterprise");
              setShowBulkEmailModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-50/50 hover:border-indigo-300"
          >
            <Mail size={18} /> Send Bulk Email
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = "/dashboard/create")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-200 border border-rose-900/10"
          >
            <Plus size={18} /> Create New Invoice
          </motion.button>
        </div>
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
      <div className="glass rounded-2xl overflow-hidden border border-gray-200">
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
                        <span className="text-sm font-bold text-gray-900">{"\u20B9"}{inv.totalAmount.toLocaleString()}</span>
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
                          {status !== 'paid' && (
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAction("markPaid", inv)}
                              className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors"
                              title="Mark as Paid"
                            >
                              <CheckCircle size={16} />
                            </motion.button>
                          )}
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
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
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto bg-slate-50">
               <DynamicTemplate html={templateHtml} data={viewInvoice} />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                <Download size={14} /> Download PDF
              </button>
              <button
                onClick={() => setViewInvoice(null)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-white transition-all"
              >Close</button>
              {viewInvoice.status?.toLowerCase() !== 'paid' && (
                <button
                  onClick={() => handleAction('markPaid', viewInvoice)}
                  className="px-4 py-2 text-sm font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-all flex items-center gap-2"
                >
                  <CheckCircle size={14} /> Mark as Paid
                </button>
              )}
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

      {showBulkEmailModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowBulkEmailModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Send Bulk Invoice Emails</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Send styled HTML invoice notifications to multiple clients</p>
                </div>
              </div>
              <button 
                onClick={() => setShowBulkEmailModal(false)} 
                className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-all"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSendBulkEmail} className="p-8 space-y-6">
              {/* Email Tag Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Recipient Emails <span className="text-gray-400 font-normal">(Press Enter or Comma to add)</span>
                </label>
                <div className="min-h-[100px] p-3 bg-slate-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all flex flex-wrap gap-2 items-start content-start">
                  <AnimatePresence>
                    {bulkEmails.map((email) => (
                      <motion.span
                        key={email}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-100/50 hover:bg-indigo-100/70 transition-all"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(email)}
                          className="hover:bg-indigo-200/50 p-0.5 rounded-full transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  <input
                    type="text"
                    placeholder={bulkEmails.length === 0 ? "Type client email and press Enter..." : "Add more..."}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={handleAddEmail}
                    onBlur={triggerAddEmail}
                    className="flex-1 min-w-[150px] bg-transparent outline-none py-1 text-sm text-gray-800 placeholder-gray-400"
                  />
                </div>
                {bulkEmails.length > 0 && (
                  <p className="text-xs text-indigo-500 mt-2 font-medium">
                    {bulkEmails.length} recipient{bulkEmails.length > 1 ? 's' : ''} added
                  </p>
                )}
              </div>

              {/* Invoice Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Link to Invoice Details</label>
                <select
                  value={selectedInvoiceId}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer font-medium"
                >
                  <option value="">-- Select an Invoice (Required) --</option>
                  {allInvoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} - {inv.clientName} (INR {inv.totalAmount.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Invoice Details from Company"
                  value={bulkSubject}
                  onChange={(e) => setBulkSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                />
              </div>

              {/* Message Body */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Type your message here..."
                  value={bulkMessage}
                  onChange={(e) => setBulkMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium resize-none"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowBulkEmailModal(false)}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={sendingBulk}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-100/50 hover:shadow-indigo-200/50 disabled:opacity-50 flex items-center gap-2"
                >
                  {sendingBulk ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Emails...
                    </>
                  ) : (
                    <>
                      <Mail size={16} /> Send Emails
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}