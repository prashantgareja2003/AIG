import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Save, FileText, Download, Send, Eye, Edit3, Trash2,
  Plus, User, Building, Mail, CreditCard,
  Printer
} from "lucide-react";
import toast from 'react-hot-toast';

const CreateInvoicePage = () => {
  const [activeTab, setActiveTab] = useState("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fromName: "Tech Solutions Inc.",
    fromAddress: "123 Business Ave, Suite 100\nSan Francisco, CA 94105",
    fromEmail: "billing@techsolutions.com",
    fromPhone: "+1 (555) 123-4567",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    clientPhone: "",
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
    issueDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    notes: "Thank you for your business! Please make payment within 30 days.",
    taxRate: 0,
    discount: 0
  });

  const [items, setItems] = useState([{ 
    description: "", 
    quantity: 1, 
    rate: 0
  }]);

  const handleDataChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0 }]);
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

  const calculateDiscount = () => {
    return calculateSubtotal() * (formData.discount / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
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

  const handlePrint = () => {
    window.print();
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
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
                    <input 
                      type="email"
                      value={formData.fromEmail}
                      onChange={(e) => handleDataChange("fromEmail", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                    <input 
                      type="tel"
                      value={formData.fromPhone}
                      onChange={(e) => handleDataChange("fromPhone", e.target.value)}
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
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email Address *</label>
                    <input 
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => handleDataChange("clientEmail", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                    <input 
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => handleDataChange("clientPhone", e.target.value)}
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
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Invoice Number</label>
                    <input 
                      type="text"
                      value={formData.invoiceNumber}
                      onChange={(e) => handleDataChange("invoiceNumber", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
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
                    <div className="col-span-6 text-xs font-semibold text-gray-500">Item Description</div>
                    <div className="col-span-2 text-xs font-semibold text-gray-500 text-center">Qty</div>
                    <div className="col-span-2 text-xs font-semibold text-gray-500 text-right">Rate</div>
                    <div className="col-span-1 text-xs font-semibold text-gray-500 text-right">Amount</div>
                    <div className="col-span-1"></div>
                  </div>

                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-6">
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
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
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
                          ${(item.quantity * item.rate).toFixed(2)}
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
                        <label className="block text-xs text-gray-500 mb-1">Tax Rate (%)</label>
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

                    <div className="flex justify-end">
                      <div className="w-80 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Subtotal:</span>
                          <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        {formData.taxRate > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tax ({formData.taxRate}%):</span>
                            <span>${calculateTax().toFixed(2)}</span>
                          </div>
                        )}
                        {formData.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Discount ({formData.discount}%):</span>
                            <span className="text-red-600">-${calculateDiscount().toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t-2 border-gray-200">
                          <span className="font-bold text-gray-800">Total:</span>
                          <span className="text-xl font-bold text-indigo-600">${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 bg-gradient-to-r from-green-50 to-white border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-green-600" />
                    <h3 className="font-semibold text-gray-800">Notes & Terms</h3>
                  </div>
                </div>
                <div className="p-5">
                  <textarea 
                    value={formData.notes} 
                    onChange={(e) => handleDataChange("notes", e.target.value)} 
                    rows={4} 
                    placeholder="Payment terms, thank you message, or additional instructions..."
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
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
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 sm:px-8 py-6 text-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
                    <p className="text-indigo-100">#{formData.invoiceNumber}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm opacity-75">Issue Date: {formData.issueDate?.toLocaleDateString()}</p>
                    <p className="text-sm opacity-75 mt-1">Due Date: {formData.dueDate?.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid sm:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">FROM</h3>
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-800">{formData.fromName || "—"}</p>
                      <p className="text-gray-600 whitespace-pre-wrap text-sm">{formData.fromAddress}</p>
                      <p className="text-gray-500 text-xs">{formData.fromEmail}</p>
                      <p className="text-gray-500 text-xs">{formData.fromPhone}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">BILL TO</h3>
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-800">{formData.clientName || "—"}</p>
                      <p className="text-gray-600 whitespace-pre-wrap text-sm">{formData.clientAddress}</p>
                      <p className="text-gray-500 text-xs">{formData.clientEmail}</p>
                      <p className="text-gray-500 text-xs">{formData.clientPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto mb-8">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Item</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 w-20">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 w-28">Rate</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 w-32">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.description || "—"}</td>
                          <td className="px-4 py-3 text-sm text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-right">${item.rate.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right font-medium">${(item.quantity * item.rate).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <div className="w-96 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal:</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    {formData.taxRate > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tax ({formData.taxRate}%):</span>
                        <span>${calculateTax().toFixed(2)}</span>
                      </div>
                    )}
                    {formData.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Discount ({formData.discount}%):</span>
                        <span className="text-red-600">-${calculateDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-3 border-t-2 border-gray-200">
                      <span className="font-bold text-gray-800 text-lg">Total:</span>
                      <span className="text-2xl font-bold text-indigo-600">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {formData.notes && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{formData.notes}</p>
                  </div>
                )}
              </div>

              <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap justify-end gap-3">
                <button onClick={handlePrint} className="px-4 py-2 text-sm text-gray-600 hover:bg-white rounded-lg transition-all flex items-center gap-2">
                  <Printer size={16} /> Print
                </button>
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