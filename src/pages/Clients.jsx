import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  MoreVertical, 
  ExternalLink,
  Building2,
  X,
  Edit2,
  Trash2,
  AlertTriangle
} from "lucide-react";

const initialClients = [
  { id: 1, name: "Acme Corp", contact: "John Doe", email: "john@acme.com", phone: "+1 555-0123", invoices: 12, totalSpent: 12450.00, status: "Active" },
  { id: 2, name: "TechStart Inc", contact: "Sarah Smith", email: "sarah@techstart.io", phone: "+1 555-0199", invoices: 4, totalSpent: 3200.00, status: "Active" },
  { id: 3, name: "Design Studio", contact: "Mike Ross", email: "mike@design.co", phone: "+1 555-0155", invoices: 8, totalSpent: 8900.00, status: "Inactive" },
  { id: 4, name: "Cloud Nine", contact: "Rachel Zane", email: "rachel@cloud9.com", phone: "+1 555-0177", invoices: 2, totalSpent: 1500.00, status: "Active" },
];

export default function Clients() {
  const [clients, setClients] = useState(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    invoices: 0,
    totalSpent: "",
    status: "Active"
  });

  // Filter clients
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate new ID
  const getNextId = () => {
    return Math.max(...clients.map(c => c.id), 0) + 1;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      contact: "",
      email: "",
      phone: "",
      invoices: 0,
      totalSpent: "",
      status: "Active"
    });
  };

  // Open add modal
  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
    setMenuOpenFor(null);
  };

  // Open edit modal
  const openEditModal = (client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      contact: client.contact,
      email: client.email,
      phone: client.phone,
      invoices: client.invoices,
      totalSpent: client.totalSpent.toString(),
      status: client.status
    });
    setIsEditModalOpen(true);
    setMenuOpenFor(null);
  };

  // Open delete modal
  const openDeleteModal = (client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
    setMenuOpenFor(null);
  };

  // Add client
  const handleAddClient = () => {
    if (!formData.name.trim() || !formData.contact.trim() || !formData.email.trim()) {
      alert("Please fill in all required fields (Name, Contact Person, Email)");
      return;
    }

    const newClient = {
      id: getNextId(),
      name: formData.name.trim(),
      contact: formData.contact.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || "N/A",
      invoices: parseInt(formData.invoices) || 0,
      totalSpent: parseFloat(formData.totalSpent) || 0,
      status: formData.status
    };

    setClients([...clients, newClient]);
    setIsAddModalOpen(false);
    resetForm();
  };

  // Update client
  const handleUpdateClient = () => {
    if (!formData.name.trim() || !formData.contact.trim() || !formData.email.trim()) {
      alert("Please fill in all required fields (Name, Contact Person, Email)");
      return;
    }

    const updatedClients = clients.map(client =>
      client.id === selectedClient.id
        ? {
            ...client,
            name: formData.name.trim(),
            contact: formData.contact.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || "N/A",
            invoices: parseInt(formData.invoices) || 0,
            totalSpent: parseFloat(formData.totalSpent) || 0,
            status: formData.status
          }
        : client
    );

    setClients(updatedClients);
    setIsEditModalOpen(false);
    setSelectedClient(null);
    resetForm();
  };

  // Delete client
  const handleDeleteClient = () => {
    setClients(clients.filter(client => client.id !== selectedClient.id));
    setIsDeleteModalOpen(false);
    setSelectedClient(null);
  };

  // Modal component
  const Modal = ({ isOpen, onClose, title, children }) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-5">{children}</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

  // Form fields component
  const ClientFormFields = ({ data, setData }) => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
          Company Name *
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition text-sm"
          placeholder="Enter company name"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
          Contact Person *
        </label>
        <input
          type="text"
          value={data.contact}
          onChange={(e) => setData({ ...data, contact: e.target.value })}
          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition text-sm"
          placeholder="Enter contact person name"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
          Email *
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition text-sm"
          placeholder="Enter email address"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
          Phone
        </label>
        <input
          type="text"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition text-sm"
          placeholder="Enter phone number"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
            Invoices
          </label>
          <input
            type="number"
            value={data.invoices}
            onChange={(e) => setData({ ...data, invoices: e.target.value })}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition text-sm"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
            Total Spent ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={data.totalSpent}
            onChange={(e) => setData({ ...data, totalSpent: e.target.value })}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition text-sm"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
          Status
        </label>
        <select
          value={data.status}
          onChange={(e) => setData({ ...data, status: e.target.value })}
          className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none transition"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">Clients</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
            Manage your customer directory and billing history.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-100 hover:shadow-xl transition-all"
        >
          <UserPlus size={16} className="sm:w-[18px] sm:h-[18px]" /> Add Client
        </button>
      </div>

      {/* Search & Stats Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="lg:col-span-3 flex items-center bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>
        <div className="bg-indigo-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-between text-white">
          <div>
            <p className="text-[10px] sm:text-xs font-medium opacity-80 uppercase tracking-wider">
              Total Clients
            </p>
            <h3 className="text-xl sm:text-2xl font-bold">{clients.length}</h3>
          </div>
          <Building2 size={20} className="sm:w-6 sm:h-6 opacity-40" />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {filteredClients.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white rounded-xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all relative"
          >
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
              <span
                className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full uppercase tracking-tighter ${
                  client.status === "Active"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {client.status}
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-slate-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <span className="text-lg sm:text-xl font-bold">{client.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {client.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">{client.contact}</p>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 text-slate-500 hover:text-slate-900 transition-colors">
                <Mail size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="text-[10px] sm:text-xs truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-slate-500">
                <Phone size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="text-[10px] sm:text-xs">{client.phone}</span>
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Total Spent
                </p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 font-mono">
                  ${client.totalSpent.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Invoices
                </p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 font-mono">
                  {client.invoices}
                </p>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 flex items-center gap-1.5 sm:gap-2 relative">
              <button className="flex-1 py-1.5 sm:py-2 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded-lg sm:rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-1.5 sm:gap-2">
                <ExternalLink size={10} className="sm:w-3 sm:h-3" /> View Profile
              </button>
              <div className="relative">
                <button
                  onClick={() => setMenuOpenFor(menuOpenFor === client.id ? null : client.id)}
                  className="p-1.5 sm:p-2 text-slate-400 hover:bg-slate-50 rounded-lg sm:rounded-xl transition-all"
                >
                  <MoreVertical size={14} className="sm:w-4 sm:h-4" />
                </button>
                
                {/* Dropdown Menu */}
                {menuOpenFor === client.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpenFor(null)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-100 z-20 overflow-hidden"
                    >
                      <button
                        onClick={() => openEditModal(client)}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-indigo-50 flex items-center gap-2 transition-colors"
                      >
                        <Edit2 size={12} /> Edit Client
                      </button>
                      <button
                        onClick={() => openDeleteModal(client)}
                        className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <Trash2 size={12} /> Delete Client
                      </button>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="py-16 sm:py-20 text-center">
          <p className="text-sm sm:text-base text-slate-400 font-medium">
            No clients found matching your search.
          </p>
        </div>
      )}

      {/* Add Client Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Client">
        <ClientFormFields data={formData} setData={setFormData} />
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleAddClient}
            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Add Client
          </button>
        </div>
      </Modal>

      {/* Edit Client Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Client">
        <ClientFormFields data={formData} setData={setFormData} />
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateClient}
            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Update Client
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Client">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Are you sure?</h3>
          <p className="text-sm text-slate-500 mb-4">
            This will permanently delete <span className="font-semibold text-slate-700">{selectedClient?.name}</span> and all associated data. This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteClient}
              className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-md transition-all"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 