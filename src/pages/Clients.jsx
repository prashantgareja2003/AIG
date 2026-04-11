import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  MoreVertical, 
  ExternalLink,
  Building2
} from "lucide-react";

const initialClients = [
  { id: 1, name: "Acme Corp", contact: "John Doe", email: "john@acme.com", phone: "+1 555-0123", invoices: 12, totalSpent: 12450.00, status: "Active" },
  { id: 2, name: "TechStart Inc", contact: "Sarah Smith", email: "sarah@techstart.io", phone: "+1 555-0199", invoices: 4, totalSpent: 3200.00, status: "Active" },
  { id: 3, name: "Design Studio", contact: "Mike Ross", email: "mike@design.co", phone: "+1 555-0155", invoices: 8, totalSpent: 8900.00, status: "Inactive" },
  { id: 4, name: "Cloud Nine", contact: "Rachel Zane", email: "rachel@cloud9.com", phone: "+1 555-0177", invoices: 2, totalSpent: 1500.00, status: "Active" },
];

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = initialClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">Clients</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">Manage your customer directory and billing history.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-100 hover:shadow-xl transition-all">
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
            <p className="text-[10px] sm:text-xs font-medium opacity-80 uppercase tracking-wider">Total Clients</p>
            <h3 className="text-xl sm:text-2xl font-bold">{initialClients.length}</h3>
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
            className="group bg-white rounded-xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
               <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full uppercase tracking-tighter ${
                 client.status === "Active" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
               }`}>
                 {client.status}
               </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-slate-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <span className="text-lg sm:text-xl font-bold">{client.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors">{client.name}</h3>
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
                <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Spent</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 font-mono">${client.totalSpent.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Invoices</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 font-mono">{client.invoices}</p>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 flex items-center gap-1.5 sm:gap-2">
               <button className="flex-1 py-1.5 sm:py-2 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded-lg sm:rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-1.5 sm:gap-2">
                 <ExternalLink size={10} className="sm:w-3 sm:h-3" /> View Profile
               </button>
               <button className="p-1.5 sm:p-2 text-slate-400 hover:bg-slate-50 rounded-lg sm:rounded-xl transition-all">
                 <MoreVertical size={14} className="sm:w-4 sm:h-4" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredClients.length === 0 && (
        <div className="py-16 sm:py-20 text-center">
          <p className="text-sm sm:text-base text-slate-400 font-medium">No clients found matching your search.</p>
        </div>
      )}
    </div>
  );
}