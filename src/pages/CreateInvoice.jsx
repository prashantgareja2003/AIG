import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Save, FileText, Download, Send, Eye, Edit3, Trash2,
  Plus, User, Building, Mail, CreditCard, Phone, MapPin
} from "lucide-react";
import toast from 'react-hot-toast';
// import { DefaultTemplate, ModernTemplate, MinimalTemplate } from "../components/invoice/InvoicePreviewTemplates";

const DynamicTemplate = ({ html, data, items }) => {
  if (!html) return <div className="p-10 text-center text-slate-400">Loading template...</div>;

  let renderedHtml = html;
  
  // Replace simple fields
  const fields = {
    invoiceNumber: data.invoiceNumber,
    issueDate: data.issueDate instanceof Date ? data.issueDate.toLocaleDateString('en-IN') : data.issueDate,
    dueDate: data.dueDate instanceof Date ? data.dueDate.toLocaleDateString('en-IN') : data.dueDate,
    fromName: data.fromName,
    fromAddress: data.fromAddress,
    fromEmail: data.fromEmail,
    fromTagline: data.fromTagline || "BHADIYAD - MORBI - GUJARAT",
    fromGSTIN: data.fromGSTIN,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    clientAddress: data.clientAddress,
    clientGSTIN: data.clientGSTIN || "N/A",
    vehicleNumber: data.vehicleNumber || "N/A",
    timeOfRemoval: data.timeOfRemoval || "N/A",
    modeOfDelivery: data.modeOfDelivery || "N/A",
    stateCode: data.stateCode || "N/A",
    hsnCode: data.hsnCode || "N/A",
    taxableAmount: data.subtotal,
    subtotal: data.subtotal,
    taxRate: data.taxRate,
    taxAmount: data.taxAmount,
    sgstRate: (data.taxRate / 2),
    sgstAmount: (parseFloat(data.taxAmount.replace(/,/g, '')) / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    cgstRate: (data.taxRate / 2),
    cgstAmount: (parseFloat(data.taxAmount.replace(/,/g, '')) / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    discountAmount: data.discountAmount,
    total: data.total,
    amountInWords: data.amountInWords,
    notes: data.notes || ""
  };

  Object.keys(fields).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    const value = fields[key] === undefined || fields[key] === null ? "" : fields[key];
    renderedHtml = renderedHtml.replace(regex, value);
  });

  // Ensure Rupee symbol is correctly rendered
  renderedHtml = renderedHtml.replace(/\u20B9/g, '&#8377;');

  // Handle items loop (very simple implementation)
  const itemRegex = /{{#items}}([\s\S]*?){{\/items}}/g;
  renderedHtml = renderedHtml.replace(itemRegex, (match, content) => {
    return items.map((item, idx) => {
      let itemHtml = content;
      itemHtml = itemHtml.replace(/{{index}}/g, idx + 1);
      itemHtml = itemHtml.replace(/{{description}}/g, item.description);
      itemHtml = itemHtml.replace(/{{quantity}}/g, item.quantity.toLocaleString('en-IN', { minimumFractionDigits: 2 }));
      itemHtml = itemHtml.replace(/{{rate}}/g, item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 }));
      itemHtml = itemHtml.replace(/{{hsnCode}}/g, item.hsnCode || data.hsnCode || "N/A");
      itemHtml = itemHtml.replace(/{{total}}/g, (item.quantity * item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 }));
      return itemHtml;
    }).join('');
  });

  return (
    <div 
      id="invoice-preview-container"
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      dangerouslySetInnerHTML={{ __html: renderedHtml }} 
    />
  );
};

const CreateInvoicePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("edit");
  const [selectedTemplateId, setSelectedTemplateId] = useState(location.state?.selectedTemplate || localStorage.getItem("selectedTemplateId") || 1);
  const [templateHtml, setTemplateHtml] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const [formData, setFormData] = useState({
    clientId: 0,
    fromName: "ShivShakti Enterprise",
    fromTagline: "BHADIYAD - MORBI - GUJARAT",
    senderName: "", // User's name
    fromAddress: "SR No. 15/P1 or 15 P2/P2, Bhadiyad Part,\nBhadiyad, Morbi, Gujarat – 363642",
    fromEmail: "billing@techsolutions.com",
    fromPhone: "+1 (555) 123-4567",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    clientPhone: "",
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    issueDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    notes: "Thank you for your business! Please make payment within 30 days.",
    taxRate: 18,
    discount: 0,
    vehicleNumber: "",
    dateOfRemoval: new Date(),
    timeOfRemoval: "08:00 AM",
    modeOfDelivery: "FOB",
    stateCode: "24 – Gujarat",
    fromGSTIN: "24AEWFS7552M1Z2",
    clientGSTIN: "",
    hsnCode: "2507",
    terms: [
      "Complaints regarding this invoice must be sent within 48 hours of receipt.",
      "Payment to be made by A/c Payee Draft or Cheque only.",
      "Interest @ 24% p.a. on bills unpaid after 15 days from due date.",
      "Discrepancy in weight, qty or quality must be reported within 48 hours."
    ]
  });

  const [items, setItems] = useState([{ 
    description: "", 
    quantity: 1, 
    rate: 0,
    hsnCode: ""
  }]);

  useEffect(() => {
    // Load logged-in user info into "senderName"
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setFormData(prev => ({
        ...prev,
        senderName: user.name || "",
        fromEmail: user.email || prev.fromEmail,
      }));
    }

    const fetchClients = async () => {
      try {
        const { apiGet } = await import('../api.js');
        const data = await apiGet('/clients');
        setClients(data);
      } catch (error) {
        toast.error("Failed to load clients");
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();

    const fetchTemplate = async () => {
      try {
        const { apiGet } = await import('../api.js');
        const data = await apiGet(`/templates/${selectedTemplateId}`);
        setTemplateHtml(data.htmlContent);
      } catch (error) {
        console.error("Failed to load template", error);
      }
    };
    fetchTemplate();

    if (location.state?.parsedData) {
      const { clientName, amount, taxRate, discount } = location.state.parsedData;
      setFormData(prev => ({
        ...prev,
        clientName: clientName || prev.clientName,
        taxRate: taxRate || prev.taxRate,
        discount: discount || prev.discount,
      }));
      if (amount) {
        setItems([{
          description: "Services / Products Rendered",
          quantity: 1,
          rate: amount,
          hsnCode: ""
        }]);
      }
      toast.success("Invoice populated from Magic Create!");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleClientChange = (clientId) => {
    const client = clients.find(c => c.id === parseInt(clientId));
    if (client) {
      setFormData(prev => ({
        ...prev,
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
        clientAddress: client.address,
        clientPhone: client.phone,
        clientGSTIN: client.gstin || ""
      }));
    }
  };

  const handleDataChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, hsnCode: "" }]);
    toast.success("New item added");
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
      toast.success("Item removed");
    } else {
      toast.error("At least one item is required");
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (formData.taxRate / 100);
  };

  const calculateCGST = () => {
    return calculateSubtotal() * (formData.taxRate / 2 / 100);
  };

  const calculateSGST = () => {
    return calculateSubtotal() * (formData.taxRate / 2 / 100);
  };

  const calculateDiscount = () => {
    return calculateSubtotal() * (formData.discount / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
  };

  const formatNumber = (num) => {
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const numberToWords = (num) => {
    if (num === 0) return "Zero";
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

  const handleSave = async (status = "Pending") => {
    if (!formData.clientId) {
      toast.error("Please select a client");
      return;
    }
    if (items.some(item => !item.description || item.rate === 0)) {
      toast.error("Please fill in all item details");
      return;
    }

    setIsSaving(true);
    try {
      const { apiPost } = await import('../api.js');
      const payload = {
        clientId: formData.clientId,
        invoiceNumber: formData.invoiceNumber,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        currency: "INR",
        subtotal: calculateSubtotal(),
        taxRate: formData.taxRate,
        taxAmount: calculateTax(),
        discount: calculateDiscount(),
        totalAmount: calculateTotal(),
        status: status,
        templateId: parseInt(selectedTemplateId),
        notes: formData.notes,
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.rate,
          total: item.quantity * item.rate
        }))
      };

      await apiPost('/invoices', payload);
      toast.success(status === "Draft" ? "Draft saved successfully!" : "Invoice created successfully!");
      navigate("/dashboard/invoices");
    } catch (error) {
      toast.error(error.message || "Failed to save invoice");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const element = document.getElementById('invoice-preview-container');
    if (!element) {
      toast.error("Preview not found");
      return;
    }

    const opt = {
      margin:       0.5,
      filename:     `${formData.invoiceNumber}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // New Promise-based usage:
    window.html2pdf().set(opt).from(element).save();
    toast.success("Downloading PDF...");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
          <p className="text-sm text-gray-500 mt-1">Create professional invoices in minutes</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "edit" 
                ? "bg-indigo-600 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Edit3 size={16} /> Edit
          </button>
          
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "preview" 
                ? "bg-indigo-600 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Eye size={16} /> Preview
          </button>
          
          <button
            onClick={() => handleSave("Pending")}
            disabled={isSaving}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2 border border-rose-900/10"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Invoice
          </button>

          <button
            onClick={() => handleSave("Draft")}
            disabled={isSaving}
            className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-all flex items-center gap-2"
          >
            <FileText size={16} /> Save as Draft
          </button>
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === "edit" ? (
          <motion.div 
            key="edit" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Company Details (Variable inputs) */}
              <div className="glass rounded-2xl overflow-hidden border border-gray-200">
                <div className="px-5 py-4 bg-indigo-500/5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Building size={18} className="text-indigo-600" />
                    <h3 className="font-semibold text-gray-800">Your Company (Variable Inputs)</h3>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Company Name *</label>
                      <input 
                        type="text"
                        value={formData.fromName}
                        onChange={(e) => handleDataChange("fromName", e.target.value)}
                        placeholder="e.g. ShivShakti Enterprise"
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Tagline / Location (Variable)</label>
                      <input 
                        type="text"
                        value={formData.fromTagline}
                        onChange={(e) => handleDataChange("fromTagline", e.target.value)}
                        placeholder="BHADIYAD - MORBI - GUJARAT"
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Your GSTIN</label>
                      <input 
                        type="text"
                        value={formData.fromGSTIN}
                        onChange={(e) => handleDataChange("fromGSTIN", e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">State Code</label>
                      <input 
                        type="text"
                        value={formData.stateCode}
                        onChange={(e) => handleDataChange("stateCode", e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill To Section */}
              <div className="glass rounded-2xl overflow-hidden border border-gray-200">
                <div className="px-5 py-4 bg-teal-500/5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-teal-600" />
                    <h3 className="font-semibold text-gray-800">Bill To (Client)</h3>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Select Client *</label>
                    <select
                      value={formData.clientId}
                      onChange={(e) => handleClientChange(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="0">Select a client...</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {formData.clientId > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                      <div className="flex items-start gap-3">
                        <Mail size={14} className="text-slate-400 mt-1" />
                        <p className="text-sm text-slate-600">{formData.clientEmail}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone size={14} className="text-slate-400 mt-1" />
                        <p className="text-sm text-slate-600">{formData.clientPhone}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin size={14} className="text-slate-400 mt-1" />
                        <p className="text-sm text-slate-600">{formData.clientAddress}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Building size={14} className="text-slate-400 mt-1" />
                        <p className="text-sm text-slate-600">GSTIN: {formData.clientGSTIN || "N/A"}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Invoice Details */}
              <div className="glass rounded-2xl overflow-hidden border border-gray-200">
                <div className="px-5 py-4 bg-blue-500/5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Invoice Details</h3>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Invoice Number</label>
                      <input 
                        type="text"
                        value={formData.invoiceNumber}
                        onChange={(e) => handleDataChange("invoiceNumber", e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Vehicle Number</label>
                      <input 
                        type="text"
                        value={formData.vehicleNumber}
                        onChange={(e) => handleDataChange("vehicleNumber", e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Issue Date</label>
                      <DatePicker 
                        selected={formData.issueDate} 
                        onChange={(date) => handleDataChange("issueDate", date)} 
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
                      <DatePicker 
                        selected={formData.dueDate} 
                        onChange={(date) => handleDataChange("dueDate", date)} 
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Time of Removal</label>
                      <input 
                        type="text"
                        value={formData.timeOfRemoval}
                        onChange={(e) => handleDataChange("timeOfRemoval", e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Mode of Delivery</label>
                      <input 
                        type="text"
                        value={formData.modeOfDelivery}
                        onChange={(e) => handleDataChange("modeOfDelivery", e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Line Items */}
              <div className="glass rounded-2xl overflow-hidden border border-gray-200">
                <div className="px-5 py-4 bg-orange-500/5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-orange-600" />
                    <h3 className="font-semibold text-gray-800">Line Items</h3>
                  </div>
                  <button 
                    onClick={addItem}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Item
                  </button>
                </div>
                
                <div className="p-5">
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={index} className="p-4 border border-gray-100 rounded-xl bg-slate-50/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400 uppercase">Item #{index + 1}</span>
                          {items.length > 1 && (
                            <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, "description", e.target.value)}
                          placeholder="Description (e.g. Ball Clay)"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                            placeholder="Qty"
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value) || 0)}
                            placeholder="Rate"
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <div className="flex items-center justify-end px-3 bg-white border border-gray-200 rounded-lg text-sm font-bold text-slate-700">
                            {"\u20B9"}{formatNumber(item.quantity * item.rate)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Tax Rate (GST %)</label>
                        <input
                          type="number"
                          value={formData.taxRate}
                          onChange={(e) => handleDataChange("taxRate", parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Discount (%)</label>
                        <input
                          type="number"
                          value={formData.discount}
                          onChange={(e) => handleDataChange("discount", parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-gray-100 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal:</span>
                        <span className="font-medium">{"\u20B9"}{formatNumber(calculateSubtotal())}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tax ({formData.taxRate}%):</span>
                        <span className="font-medium">{"\u20B9"}{formatNumber(calculateTax())}</span>
                      </div>
                      {formData.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Discount ({formData.discount}%):</span>
                          <span className="text-red-600">-{"\u20B9"}{formatNumber(calculateDiscount())}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t-2 border-gray-200">
                        <span className="font-bold text-gray-800 text-lg">Total Amount:</span>
                        <span className="text-2xl font-bold text-indigo-600">{"\u20B9"}{formatNumber(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="preview" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto"
          >
            <DynamicTemplate 
              html={templateHtml} 
              data={{
                ...formData,
                subtotal: formatNumber(calculateSubtotal()),
                taxAmount: formatNumber(calculateTax()),
                discountAmount: formatNumber(calculateDiscount()),
                total: formatNumber(calculateTotal()),
                amountInWords: numberToWords(calculateTotal()),
              }} 
              items={items} 
            />

              <div className="mt-6 flex justify-end gap-3 no-print">
                <button onClick={handleDownload} className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all flex items-center gap-2">
                  <Download size={16} /> Download PDF
                </button>
                <button onClick={handleSave} className="px-8 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2">
                  <Send size={16} /> Save & Send
                </button>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateInvoicePage;