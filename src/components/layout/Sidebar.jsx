import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/dashboard/create", icon: PlusCircle, label: "Create Invoice" },
    { path: "/dashboard/invoices", icon: FileText, label: "Invoices" },
    { path: "/dashboard/clients", icon: Users, label: "Clients" },
    { path: "/dashboard/profile", icon: User, label: "Profile" },
    { path: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-40 flex flex-col"
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap"
            >
              InvoicePro
            </motion.span>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: collapsed ? 0 : 4 }}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                    ${active 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
      >
        {collapsed ? (
          <ChevronRight size={14} className="text-slate-600" />
        ) : (
          <ChevronLeft size={14} className="text-slate-600" />
        )}
      </button>
    </motion.aside>
  );
};

export default Sidebar;