import React, { useState, useEffect } from "react";
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
  AlertTriangle,
  Loader2,
  CreditCard,
  FileText,
  DollarSign,
  Clock,
  User
} from "lucide-react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";
import toast from "react-hot-toast";

// Form fields component moved outside to prevent focus loss
const ClientFormFields = ({ data, setData }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
          Company Name *
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Building2 size={16} />
          </div>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
            placeholder="Enter company name"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
          Contact Person *
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <UserPlus size={16} />
          </div>
          <input
            type="text"
            value={data.contactPerson}
            onChange={(e) => setData({ ...data, contactPerson: e.target.value })}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
            placeholder="Enter contact person"
          />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
          Email Address *
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Mail size={16} />
          </div>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
            placeholder="email@example.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
          Phone Number
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Phone size={16} />
          </div>
          <input
            type="text"
            value={data.phone || ""}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
            placeholder="+91 00000 00000"
          />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
          GSTIN *
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <CreditCard size={16} />
          </div>
          <input
            type="text"
            value={data.gstin || ""}
            onChange={(e) => setData({ ...data, gstin: e.target.value })}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
            placeholder="Enter GST number"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
          Status
        </label>
        <select
          value={data.status}
          onChange={(e) => setData({ ...data, status: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>

    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
        Office Address *
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <MapPin size={16} />
        </div>
        <textarea
          value={data.address || ""}
          onChange={(e) => setData({ ...data, address: e.target.value })}
          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium min-h-[100px]"
          placeholder="Enter full office address"
        />
      </div>
    </div>

  </div>
);

// Modal component
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full ${sizes[size]} bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 overflow-hidden flex flex-col max-h-[90vh]`}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                <div className="h-1 w-12 bg-indigo-600 rounded-full mt-1"></div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    gstin: "",
    invoices: 0,
    totalSpent: 0,
    status: "Active"
  });

  // Fetch clients from API
  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await apiGet("/clients");
      setClients(data);
    } catch (error) {
      toast.error("Failed to load clients");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      gstin: "",
      invoices: 0,
      totalSpent: 0,
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
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      address: client.address,
      gstin: client.gstin,
      invoices: client.invoices,
      totalSpent: client.totalSpent,
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

  // Open view modal
  const openViewModal = (client) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
    setMenuOpenFor(null);
  };

  // Add client
  const handleAddClient = async () => {
    if (!formData.name.trim() || !formData.contactPerson.trim() || !formData.email.trim() || !formData.address.trim() || !formData.gstin.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await apiPost("/clients", formData);
      toast.success("Client added successfully");
      setIsAddModalOpen(false);
      fetchClients();
    } catch (error) {
      toast.error(error.message || "Failed to add client");
    }
  };

  // Update client
  const handleUpdateClient = async () => {
    if (!formData.name.trim() || !formData.contactPerson.trim() || !formData.email.trim() || !formData.address.trim() || !formData.gstin.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await apiPut(`/clients/${selectedClient.id}`, formData);
      toast.success("Client updated successfully");
      setIsEditModalOpen(false);
      fetchClients();
    } catch (error) {
      toast.error(error.message || "Failed to update client");
    }
  };

  // Delete client
  const handleDeleteClient = async () => {
    try {
      await apiDelete(`/clients/${selectedClient.id}`);
      toast.success("Client deleted successfully");
      setIsDeleteModalOpen(false);
      fetchClients();
    } catch (error) {
      toast.error(error.message || "Failed to delete client");
    }
  };

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
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-100 hover:shadow-xl transition-all border border-rose-900/10"
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
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading your clients...</p>
        </div>
      ) : (
        <>
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
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">{client.contactPerson}</p>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3 text-slate-500 hover:text-slate-900 transition-colors">
                    <Mail size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span className="text-[10px] sm:text-xs truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-slate-500">
                    <Phone size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span className="text-[10px] sm:text-xs">{client.phone || "N/A"}</span>
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
                  <button 
                    onClick={() => openViewModal(client)}
                    className="flex-1 py-1.5 sm:py-2 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded-lg sm:rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-1.5 sm:gap-2"
                  >
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
        </>
      )}

      {/* Add Client Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Client" size="md">
        <ClientFormFields data={formData} setData={setFormData} />
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleAddClient}
            className="px-8 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all border border-rose-900/10"
          >
            Add Client
          </button>
        </div>
      </Modal>

      {/* Edit Client Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Client" size="md">
        <ClientFormFields data={formData} setData={setFormData} />
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateClient}
            className="px-8 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all"
          >
            Update Client
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Client" size="sm">
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 shadow-inner">
            <AlertTriangle size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Are you sure?</h3>
          <p className="text-sm text-slate-500 mb-8 px-4 leading-relaxed">
            This will permanently delete <span className="font-bold text-slate-900">"{selectedClient?.name}"</span> and all associated data. This action cannot be undone.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleDeleteClient}
              className="w-full py-3 text-sm font-bold text-white bg-red-500 rounded-2xl hover:bg-red-600 shadow-lg shadow-red-100 transition-all"
            >
              Delete Permanently
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="w-full py-3 text-sm font-bold text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"
            >
              No, Keep Client
            </button>
          </div>
        </div>
      </Modal>

      {/* View Profile Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Client Profile" size="md">
        <div className="space-y-4 font-marcellus">
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Marcellus&display=swap');
            .font-marcellus { font-family: 'Marcellus', serif; }
          `}</style>
          
          {/* Refined Glass Header with Maroon Border */}
          <div className="p-5 rounded-2xl glass-light border border-rose-900/20 shadow-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl flex items-center justify-center text-2xl font-bold text-white border border-rose-900/10">
                {selectedClient?.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{selectedClient?.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                    selectedClient?.status === 'Active' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    <span className={`w-1 h-1 rounded-full ${selectedClient?.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    {selectedClient?.status}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-l border-slate-200 pl-2">
                    ID: {selectedClient?.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Stats Grid with Maroon Accents */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl glass-light border border-rose-900/15 flex items-center justify-between group hover:border-blue-300 transition-all">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[2px] mb-0.5">Invoices</p>
                <p className="text-xl font-bold text-slate-800">{selectedClient?.invoices}</p>
              </div>
              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                <FileText size={16} />
              </div>
            </div>
            <div className="p-4 rounded-xl glass-light border border-rose-900/15 flex items-center justify-between group hover:border-emerald-300 transition-all">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[2px] mb-0.5">Revenue</p>
                <p className="text-xl font-bold text-slate-800">₹{selectedClient?.totalSpent?.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                <DollarSign size={16} />
              </div>
            </div>
          </div>

          {/* Compact Info Section with Maroon Borders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl glass-light border border-rose-900/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-50/50 rounded-lg text-blue-500 border border-blue-100"><Mail size={14} /></div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                  <p className="text-xs font-bold text-slate-700 truncate">{selectedClient?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-50/50 rounded-lg text-blue-500 border border-blue-100"><Phone size={14} /></div>
                <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                  <p className="text-xs font-bold text-slate-700">{selectedClient?.phone || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl glass-light border border-rose-900/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-50/50 rounded-lg text-blue-500 border border-blue-100"><CreditCard size={14} /></div>
                <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">GSTIN</p>
                  <p className="text-xs font-bold text-slate-700">{selectedClient?.gstin || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-50/50 rounded-lg text-blue-500 border border-blue-100"><User size={14} /></div>
                <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Contact</p>
                  <p className="text-xs font-bold text-slate-700">{selectedClient?.contactPerson}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="p-4 rounded-xl glass-light border border-rose-900/10 flex gap-4 items-start shadow-sm">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg border border-rose-100"><MapPin size={14} /></div>
            <div>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Address</p>
              <p className="text-xs font-bold text-slate-600 leading-relaxed">{selectedClient?.address || "No address on file"}</p>
            </div>
          </div>

          {/* Compact Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setIsViewModalOpen(false);
                openEditModal(selectedClient);
              }}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 border border-rose-900/20"
            >
              <Edit2 size={14} /> Edit Profile
            </button>
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="px-6 py-3 bg-white border border-rose-900/10 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 