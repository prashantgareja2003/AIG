import React from "react";
import { DollarSign, Clock, FileText, AlertCircle, Plus, Sparkles, UserPlus, Layout } from "lucide-react";
import RevenueChart from "../components/dashboard/RevenueChart";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Your invoice overview at a glance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={DollarSign}
          label="Total Revenue"
          value="$10,000"
          subtitle="From 1 paid invoices"
          color="indigo"
        />
        <StatsCard
          icon={Clock}
          label="Pending"
          value="2"
          subtitle="$24,410 outstanding"
          color="amber"
        />
        <StatsCard
          icon={FileText}
          label="Total Invoices"
          value="5"
          subtitle="All time"
          color="emerald"
        />
        <StatsCard
          icon={AlertCircle}
          label="Overdue"
          value="1"
          subtitle="Needs attention"
          color="rose"
        />
      </div>

      {/* Revenue Chart Section */}
      <RevenueChart />

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction icon={Plus} label="New Invoice" subtitle="Create from scratch" color="indigo" />
          <QuickAction icon={Sparkles} label="AI Generate" subtitle="Describe & generate" color="purple" />
          <QuickAction icon={UserPlus} label="Add Client" subtitle="New client profile" color="emerald" />
          <QuickAction icon={Layout} label="Templates" subtitle="Browse templates" color="cyan" />
        </div>
      </div>

      {/* Recent Invoices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all →</button>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
          <InvoiceRow number="681" client="Acme Corporation" date="Mar 1" amount="$19,000.00" status="Paid" />
          <InvoiceRow number="682" client="TechStart Solutions" date="Mar 5" amount="$5,400.00" status="Pending" />
          <InvoiceRow number="683" client="Global Ventures Ltd" date="Mar 10" amount="$12,750.00" status="Paid" />
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon: Icon, label, value, subtitle, color }) {
  const colors = {
    indigo: "from-indigo-500 to-indigo-600 hover:shadow-indigo-500/30",
    amber: "from-amber-500 to-amber-600 hover:shadow-amber-500/30",
    emerald: "from-emerald-500 to-emerald-600 hover:shadow-emerald-500/30",
    rose: "from-rose-500 to-rose-600 hover:shadow-rose-500/30",
  };

  return (
    <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${colors[color]} p-5 shadow-md transition-all duration-300 hover:shadow-xl cursor-pointer`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-20 h-20 bg-white/10 rounded-full -top-10 -right-10 group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute w-16 h-16 bg-white/10 rounded-full bottom-0 left-0 translate-y-1/2 -translate-x-1/2 group-hover:scale-150 group-hover:translate-y-0 group-hover:-translate-x-0 transition-all duration-700" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <p className="text-white/80 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, subtitle, color }) {
  const colors = {
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", hoverBg: "group-hover:bg-indigo-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", hoverBg: "group-hover:bg-purple-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", hoverBg: "group-hover:bg-emerald-100" },
    cyan: { bg: "bg-cyan-50", text: "text-cyan-600", hoverBg: "group-hover:bg-cyan-100" },
  };

  const colorSet = colors[color];

  return (
    <button className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-200 hover:shadow-md transition-all text-left">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all ${colorSet.bg} ${colorSet.text} ${colorSet.hoverBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{label}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </button>
  );
}

function InvoiceRow({ number, client, date, amount, status }) {
  const statusStyles = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="group p-4 hover:bg-gray-50 cursor-pointer transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-indigo-600">{number}</span>
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{client}</p>
            <p className="text-xs text-gray-500">INV-202603-{number} - {date}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-900 text-sm">{amount}</p>
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${statusStyles[status]}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}