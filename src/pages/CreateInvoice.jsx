import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Save, FileText, Download, Send, Eye, Edit3, Trash2,
  Plus, User, Building, Mail, CreditCard
} from "lucide-react";
import toast from 'react-hot-toast';

const CreateInvoicePage = () => {
  const [activeTab, setActiveTab] = useState("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fromName: "ShivShakti Enterprise",
    fromAddress: "SR No. 15/P1 or 15 P2/P2, Bhadiyad Part,\nBhadiyad, Morbi, Gujarat – 363642",
    fromEmail: "billing@techsolutions.com",
    fromPhone: "+1 (555) 123-4567",
    clientName: "Orange Cera Colour",
    clientEmail: "info@orangecera.com",
    clientAddress: "Plot No. 2, Survey No. 501/1,\nTurner By Pass Road, Near RGL Cera,\nThangadh – 363530, Gujarat, India",
    clientPhone: "+91 98765 43210",
    invoiceNumber: `PR / 09`,
    issueDate: new Date(2026, 2, 11), // 11 March 2026
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    notes: "Thank you for your business! Please make payment within 30 days.",
    taxRate: 18, // 18% GST (9% + 9%)
    discount: 0,
    // Additional fields for the template
    vehicleNumber: "GJ 12 AY 2068",
    dateOfRemoval: new Date(2026, 2, 11),
    timeOfRemoval: "8:01 AM",
    modeOfDelivery: "FOB",
    stateCode: "24 – Gujarat",
    fromGSTIN: "24AEWFS7552M1Z2",
    clientGSTIN: "24AAFJO0820D1ZT",
    hsnCode: "2507",
    quantity: 25000,
    ratePerUnit: 1.50,
    description: "Ball Clay",
    // Terms
    terms: [
      "Complaints regarding this invoice must be sent within 48 hours of receipt.",
      "Payment to be made by A/c Payee Draft or Cheque only.",
      "Interest @ 24% p.a. on bills unpaid after 15 days from due date.",
      "Discrepancy in weight, qty or quality must be reported within 48 hours."
    ]
  });

  const [items, setItems] = useState([{ 
    description: "Ball Clay", 
    quantity: 25000, 
    rate: 1.50,
    hsnCode: "2507"
  }]);

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
    // Split tax into CGST and SGST (half each)
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

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Invoice saved as draft!");
    setIsSaving(false);
  };

  const handleSendInvoice = () => {
    if (!formData.clientEmail) {
      toast.error("Please add client email address");
      return;
    }
    if (items.some(item => !item.description || item.rate === 0)) {
      toast.error("Please fill in all item details");
      return;
    }
    toast.success(`Invoice sent to ${formData.clientEmail}!`);
  };
  const handleDownload = () => {
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
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-sm"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Draft
          </button>
          
          <button
            onClick={handleSendInvoice}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Send size={16} /> Send
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
              {/* From Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Building size={18} className="text-indigo-600" />
                    <h3 className="font-semibold text-gray-800">From (Sender)</h3>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Business Name</label>
                    <input 
                      type="text"
                      value={formData.fromName}
                      onChange={(e) => handleDataChange("fromName", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">GSTIN</label>
                    <input 
                      type="text"
                      value={formData.fromGSTIN}
                      onChange={(e) => handleDataChange("fromGSTIN", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
                    <input 
                      type="email"
                      value={formData.fromEmail}
                      onChange={(e) => handleDataChange("fromEmail", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                    <textarea 
                      value={formData.fromAddress}
                      onChange={(e) => handleDataChange("fromAddress", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bill To Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-teal-50 to-white border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-teal-600" />
                    <h3 className="font-semibold text-gray-800">Bill To (Client)</h3>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Client Name *</label>
                    <input 
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => handleDataChange("clientName", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Client GSTIN</label>
                    <input 
                      type="text"
                      value={formData.clientGSTIN}
                      onChange={(e) => handleDataChange("clientGSTIN", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email Address *</label>
                    <input 
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => handleDataChange("clientEmail", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                    <textarea 
                      value={formData.clientAddress}
                      onChange={(e) => handleDataChange("clientAddress", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-purple-50 to-white border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-purple-600" />
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
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Vehicle Number</label>
                      <input 
                        type="text"
                        value={formData.vehicleNumber}
                        onChange={(e) => handleDataChange("vehicleNumber", e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      <label className="block text-xs font-medium text-gray-500 mb-1">Date of Removal</label>
                      <DatePicker 
                        selected={formData.dateOfRemoval} 
                        onChange={(date) => handleDataChange("dateOfRemoval", date)} 
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
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Mode of Delivery</label>
                      <input 
                        type="text"
                        value={formData.modeOfDelivery}
                        onChange={(e) => handleDataChange("modeOfDelivery", e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">State Code</label>
                    <input 
                      type="text"
                      value={formData.stateCode}
                      onChange={(e) => handleDataChange("stateCode", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Line Items */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-orange-50 to-white border-b border-gray-100 flex items-center justify-between">
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
                  <div className="grid grid-cols-12 gap-3 mb-3 px-2 pb-2 border-b border-gray-100">
                    <div className="col-span-5 text-xs font-semibold text-gray-500">Item Description</div>
                    <div className="col-span-2 text-xs font-semibold text-gray-500 text-center">HSN</div>
                    <div className="col-span-1 text-xs font-semibold text-gray-500 text-center">Qty (Kgs)</div>
                    <div className="col-span-2 text-xs font-semibold text-gray-500 text-right">Rate/Kg</div>
                    <div className="col-span-1 text-xs font-semibold text-gray-500 text-right">Amount</div>
                    <div className="col-span-1"></div>
                  </div>

                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-5">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(index, "description", e.target.value)}
                            placeholder="Item description"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={item.hsnCode}
                            onChange={(e) => updateItem(index, "hsnCode", e.target.value)}
                            placeholder="HSN"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                          />
                        </div>
                        <div className="col-span-1 text-right text-sm font-medium text-gray-700">
                          ${(item.quantity * item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="col-span-1 text-center">
                          {items.length > 1 && (
                            <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Tax Rate (Total GST %)</label>
                        <input
                          type="number"
                          value={formData.taxRate}
                          onChange={(e) => handleDataChange("taxRate", parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">(Split equally as CGST & SGST)</p>
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

                    <div className="flex justify-end">
                      <div className="w-80 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Taxable Amount:</span>
                          <span className="font-medium">₹{formatNumber(calculateSubtotal())}</span>
                        </div>
                        {formData.taxRate > 0 && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">CGST @ {(formData.taxRate / 2)}%:</span>
                              <span>₹{formatNumber(calculateCGST())}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">SGST @ {(formData.taxRate / 2)}%:</span>
                              <span>₹{formatNumber(calculateSGST())}</span>
                            </div>
                          </>
                        )}
                        {formData.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Discount ({formData.discount}%):</span>
                            <span className="text-red-600">-₹{formatNumber(calculateDiscount())}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t-2 border-gray-200">
                          <span className="font-bold text-gray-800">Total:</span>
                          <span className="text-xl font-bold text-indigo-600">₹{formatNumber(calculateTotal())}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes & Terms */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-green-50 to-white border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-green-600" />
                    <h3 className="font-semibold text-gray-800">Terms & Conditions</h3>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Terms</label>
                    <textarea 
                      value={formData.terms.join('\n')}
                      onChange={(e) => handleDataChange("terms", e.target.value.split('\n'))}
                      rows={4}
                      placeholder="Terms & conditions..."
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Additional Notes</label>
                    <textarea 
                      value={formData.notes} 
                      onChange={(e) => handleDataChange("notes", e.target.value)} 
                      rows={3} 
                      placeholder="Payment terms, thank you message, or additional instructions..."
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
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
            {/* EXACT TEMPLATE RENDERED WITH DYNAMIC DATA */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <style>
                {`
                  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&family=IBM+Plex+Serif:wght@400;600&display=swap');
                  .invoice-preview * { margin: 0; padding: 0; box-sizing: border-box; }
                  .invoice-preview {
                    font-family: 'IBM Plex Sans', sans-serif;
                    font-size: 13px;
                    color: #1c1c1c;
                  }
                  .invoice-preview .page {
                    width: 100%;
                    background: #fff;
                  }
                  .invoice-preview .hd {
                    display: flex;
                    justify-content: space-between;
                    align-items: stretch;
                    border-bottom: 3px solid #2E2E2E;
                  }
                  .invoice-preview .hd-left {
                    padding: 28px 32px;
                    flex: 1;
                  }
                  .invoice-preview .hd-right {
                    background: #2E2E2E;
                    padding: 28px 32px;
                    text-align: right;
                    min-width: 220px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                  }
                  .invoice-preview .co-name {
                    font-family: 'IBM Plex Serif', serif;
                    font-size: 28px;
                    font-weight: 600;
                    color: #2E2E2E;
                    line-height: 1.1;
                  }
                  .invoice-preview .co-addr {
                    margin-top: 8px;
                    font-size: 12px;
                    color: #777;
                    line-height: 1.75;
                  }
                  .invoice-preview .co-gstin {
                    margin-top: 8px;
                    font-size: 11.5px;
                    color: #aaa;
                  }
                  .invoice-preview .co-gstin strong { color: #555; }
                  .invoice-preview .hd-right .inv-type {
                    font-family: 'IBM Plex Serif', serif;
                    font-size: 20px;
                    font-style: italic;
                    color: rgba(255,255,255,0.85);
                    font-weight: 400;
                  }
                  .invoice-preview .hd-right .inv-no-block {
                    margin-top: 10px;
                  }
                  .invoice-preview .hd-right .inv-no-label {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: rgba(255,255,255,0.45);
                  }
                  .invoice-preview .hd-right .inv-no-value {
                    font-size: 22px;
                    font-weight: 700;
                    color: #fff;
                    letter-spacing: 0.5px;
                  }
                  .invoice-preview .hd-right .inv-date {
                    font-size: 12px;
                    color: rgba(255,255,255,0.6);
                    margin-top: 4px;
                  }
                  .invoice-preview .info-strip {
                    display: flex;
                    background: #f4f7f7;
                    border-bottom: 1px solid #e2e8e8;
                  }
                  .invoice-preview .info-cell {
                    flex: 1;
                    padding: 12px 20px;
                    border-right: 1px solid #e2e8e8;
                  }
                  .invoice-preview .info-cell:last-child { border-right: none; }
                  .invoice-preview .info-cell .ik {
                    font-size: 9.5px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: #2E2E2E;
                    font-weight: 600;
                    margin-bottom: 2px;
                  }
                  .invoice-preview .info-cell .iv {
                    font-weight: 600;
                    color: #222;
                    font-size: 12.5px;
                  }
                  .invoice-preview .parties {
                    display: flex;
                    border-bottom: 1px solid #dde4e4;
                  }
                  .invoice-preview .party {
                    flex: 1;
                    padding: 20px 28px;
                    border-right: 1px solid #dde4e4;
                  }
                  .invoice-preview .party:last-child { border-right: none; }
                  .invoice-preview .party .p-label {
                    font-size: 9.5px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: #2E2E2E;
                    font-weight: 600;
                    margin-bottom: 8px;
                  }
                  .invoice-preview .party .p-name {
                    font-family: 'IBM Plex Serif', serif;
                    font-size: 16px;
                    font-weight: 600;
                    color: #111;
                    margin-bottom: 5px;
                  }
                  .invoice-preview .party .p-addr {
                    font-size: 12px;
                    color: #666;
                    line-height: 1.75;
                  }
                  .invoice-preview .party .p-gstin {
                    margin-top: 9px;
                    font-size: 11px;
                    background: #eef3f3;
                    display: inline-block;
                    padding: 3px 8px;
                    border-radius: 3px;
                    color: #3a7a74;
                    font-weight: 600;
                    letter-spacing: 0.3px;
                  }
                  .invoice-preview .tbl-wrap { border-bottom: 1px solid #dde4e4; overflow-x: auto; }
                  .invoice-preview table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12.5px;
                  }
                  .invoice-preview thead tr {
                    background: #2E2E2E;
                  }
                  .invoice-preview thead th {
                    padding: 10px 18px;
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    font-weight: 600;
                    color: rgba(255,255,255,0.75);
                    text-align: left;
                  }
                  .invoice-preview thead th.r { text-align: right; }
                  .invoice-preview tbody tr:nth-child(even) { background: #f8fbfb; }
                  .invoice-preview tbody td {
                    padding: 15px 18px;
                    border-bottom: 1px solid #eef2f2;
                    color: #333;
                    vertical-align: middle;
                  }
                  .invoice-preview tbody td.r { text-align: right; }
                  .invoice-preview .it-name {
                    font-family: 'IBM Plex Serif', serif;
                    font-size: 14px;
                    font-weight: 600;
                    color: #111;
                  }
                  .invoice-preview .it-hsn {
                    font-size: 11px;
                    color: #aaa;
                    margin-top: 2px;
                  }
                  .invoice-preview .it-amt {
                    font-family: 'IBM Plex Serif', serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #2E2E2E;
                  }
                  .invoice-preview .bottom {
                    display: flex;
                    flex-wrap: wrap;
                  }
                  .invoice-preview .bottom-left {
                    flex: 1;
                    border-right: 1px solid #dde4e4;
                  }
                  .invoice-preview .bottom-right {
                    width: 260px;
                    flex-shrink: 0;
                  }
                  .invoice-preview .words-box {
                    padding: 16px 24px;
                    border-bottom: 1px solid #eef2f2;
                  }
                  .invoice-preview .words-box .wl {
                    font-size: 9.5px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: #2E2E2E;
                    font-weight: 600;
                    margin-bottom: 5px;
                  }
                  .invoice-preview .words-box .wv {
                    font-family: 'IBM Plex Serif', serif;
                    font-style: italic;
                    font-size: 13px;
                    color: #333;
                    line-height: 1.5;
                  }
                  .invoice-preview .terms-box {
                    padding: 16px 24px;
                  }
                  .invoice-preview .terms-box .tl {
                    font-size: 9.5px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: #aaa;
                    font-weight: 600;
                    margin-bottom: 8px;
                  }
                  .invoice-preview .terms-box ol {
                    padding-left: 15px;
                    color: #999;
                    font-size: 11.5px;
                    line-height: 1.85;
                  }
                  .invoice-preview .tot-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 20px;
                    border-bottom: 1px solid #eef2f2;
                    font-size: 12.5px;
                  }
                  .invoice-preview .tot-row .tl { color: #888; }
                  .invoice-preview .tot-row .tv { font-weight: 600; color: #333; }
                  .invoice-preview .tot-row.subtotal {
                    background: #f4f7f7;
                  }
                  .invoice-preview .tot-grand {
                    background: #2E2E2E;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                  }
                  .invoice-preview .tot-grand .gl {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: rgba(255,255,255,0.55);
                    font-weight: 600;
                  }
                  .invoice-preview .tot-grand .gv {
                    font-family: 'IBM Plex Serif', serif;
                    font-size: 20px;
                    font-weight: 600;
                    color: #fff;
                  }
                  .invoice-preview .sig-strip {
                    border-top: 1px solid #dde4e4;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 14px 28px;
                    background: #f4f7f7;
                    flex-wrap: wrap;
                    gap: 10px;
                  }
                  .invoice-preview .veh-info {
                    font-size: 12px;
                    color: #666;
                  }
                  .invoice-preview .veh-info strong { color: #333; }
                  .invoice-preview .sig-right {
                    text-align: right;
                  }
                  .invoice-preview .sig-right .sl {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #aaa;
                  }
                  .invoice-preview .sig-right .sn {
                    font-family: 'IBM Plex Serif', serif;
                    font-size: 14px;
                    font-weight: 600;
                    color: #2E2E2E;
                    margin-top: 2px;
                  }
                `}
              </style>
              <div className="invoice-preview">
                <div className="page">
                  {/* HEADER */}
                  <div className="hd">
                    <div className="hd-left">
                      <div className="co-name">{formData.fromName}</div>
                      <div className="co-addr">
                        {formData.fromAddress.replace(/\n/g, '<br/>')}
                      </div>
                      <div className="co-gstin">GSTIN: <strong>{formData.fromGSTIN}</strong></div>
                    </div>
                    <div className="hd-right">
                      <div className="inv-type">Tax Invoice</div>
                      <div className="inv-no-block">
                        <div className="inv-no-label">Invoice No.</div>
                        <div className="inv-no-value">{formData.invoiceNumber}</div>
                        <div className="inv-date">
                          {formData.issueDate?.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} &nbsp;|&nbsp; {formData.timeOfRemoval}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* INFO STRIP */}
                  <div className="info-strip">
                    <div className="info-cell">
                      <div className="ik">Invoice Date</div>
                      <div className="iv">{formData.issueDate?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                    </div>
                    <div className="info-cell">
                      <div className="ik">Date of Removal</div>
                      <div className="iv">{formData.dateOfRemoval?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                    </div>
                    <div className="info-cell">
                      <div className="ik">Time of Removal</div>
                      <div className="iv">{formData.timeOfRemoval}</div>
                    </div>
                    <div className="info-cell">
                      <div className="ik">Mode of Delivery</div>
                      <div className="iv">{formData.modeOfDelivery}</div>
                    </div>
                    <div className="info-cell">
                      <div className="ik">State Code</div>
                      <div className="iv">{formData.stateCode}</div>
                    </div>
                  </div>

                  {/* PARTIES */}
                  <div className="parties">
                    <div className="party">
                      <div className="p-label">Bill From</div>
                      <div className="p-name">{formData.fromName}</div>
                      <div className="p-addr">
                        {formData.fromAddress.replace(/\n/g, '<br/>')}
                      </div>
                      <div className="p-gstin">GSTIN: {formData.fromGSTIN}</div>
                    </div>
                    <div className="party">
                      <div className="p-label">Bill To</div>
                      <div className="p-name">{formData.clientName}</div>
                      <div className="p-addr">
                        {formData.clientAddress.replace(/\n/g, '<br/>')}
                      </div>
                      <div className="p-gstin">GSTIN: {formData.clientGSTIN}</div>
                    </div>
                  </div>

                  {/* TABLE */}
                  <div className="tbl-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th style={{width: '36px'}}>Sr.</th>
                          <th>Description of Goods</th>
                          <th>HSN Code</th>
                          <th className="r">Quantity (Kgs)</th>
                          <th className="r">Rate per Kg (₹)</th>
                          <th className="r">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{color: '#ccc', fontWeight: '700'}}>{idx + 1}</td>
                            <td>
                              <div className="it-name">{item.description || '—'}</div>
                              <div className="it-hsn">HSN: {item.hsnCode || '—'}</div>
                            </td>
                            <td>{item.hsnCode || '—'}</td>
                            <td className="r">{formatNumber(item.quantity)}</td>
                            <td className="r">{formatNumber(item.rate)}</td>
                            <td className="r it-amt">{formatNumber(item.quantity * item.rate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* BOTTOM */}
                  <div className="bottom">
                    <div className="bottom-left">
                      <div className="words-box">
                        <div className="wl">Amount in Words</div>
                        <div className="wv">{numberToWords(calculateTotal())}</div>
                      </div>
                      <div className="terms-box">
                        <div className="tl">Terms &amp; Conditions</div>
                        <ol>
                          {formData.terms.map((term, idx) => (
                            <li key={idx}>{term}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                    <div className="bottom-right">
                      <div className="tot-row subtotal">
                        <span className="tl">Taxable Amount</span>
                        <span className="tv">₹{formatNumber(calculateSubtotal())}</span>
                      </div>
                      {formData.taxRate > 0 && (
                        <>
                          <div className="tot-row">
                            <span className="tl">SGST @ {(formData.taxRate / 2)}%</span>
                            <span className="tv">₹{formatNumber(calculateSGST())}</span>
                          </div>
                          <div className="tot-row">
                            <span className="tl">CGST @ {(formData.taxRate / 2)}%</span>
                            <span className="tv">₹{formatNumber(calculateCGST())}</span>
                          </div>
                          <div className="tot-row">
                            <span className="tl">Total Tax</span>
                            <span className="tv">₹{formatNumber(calculateTax())}</span>
                          </div>
                        </>
                      )}
                      {formData.discount > 0 && (
                        <div className="tot-row">
                          <span className="tl">Discount ({formData.discount}%)</span>
                          <span className="tv">-₹{formatNumber(calculateDiscount())}</span>
                        </div>
                      )}
                      <div className="tot-grand">
                        <span className="gl">Grand Total</span>
                        <span className="gv">₹{formatNumber(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>

                  {/* SIG STRIP */}
                  <div className="sig-strip">
                    <div className="veh-info">
                      Vehicle No.: <strong>{formData.vehicleNumber}</strong>
                    </div>
                    <div className="sig-right">
                      <div className="sl">For {formData.fromName}</div>
                      <div className="sn">Authorised Signatory</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Preview */}
              <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap justify-end gap-3">
                <button onClick={handleDownload} className="px-4 py-2 text-sm text-gray-600 hover:bg-white rounded-lg transition-all flex items-center gap-2">
                  <Download size={16} /> Download
                </button>
                <button onClick={handleSendInvoice} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all flex items-center gap-2">
                  <Send size={16} /> Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateInvoicePage;