import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Users,
  Settings,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", badge: null },
  { icon: FilePlus, label: "New Invoice", path: "/create", badge: null },
  { icon: FileText, label: "Invoices", path: "/invoices", badge: "12" },
  { icon: Users, label: "Clients", path: "/clients", badge: null },
  { icon: Settings, label: "Settings", path: "/settings", badge: null },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const sidebarWidth = collapsed ? 80 : 260;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-slate-200"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={() => setIsMobileOpen(false)}
              />
              
              <motion.aside
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="fixed left-0 top-0 h-screen w-[260px] z-50 flex flex-col bg-white border-r border-slate-200 shadow-xl"
              >
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>

                <SidebarContent collapsed={false} location={location} onToggle={onToggle} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop sidebar
  return (
    <motion.aside
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col bg-white border-r border-slate-200 overflow-hidden"
    >
      <SidebarContent collapsed={collapsed} location={location} onToggle={onToggle} />
    </motion.aside>
  );
}

function SidebarContent({ collapsed, location, onToggle }) {
  return (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-5 mt-2 mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-200 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden"
              >
                <span className="block font-bold text-lg tracking-tight text-slate-900 whitespace-nowrap">
                  InvoiceAI
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Pro
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {!collapsed && (
          <div className="px-3 py-1.5 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Menu
            </span>
          </div>
        )}

        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="block relative">
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-indigo-50 text-indigo-600" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }
                `}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                  />
                )}

                <div className="relative">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                
                <AnimatePresence>
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
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="px-3 pb-4 mt-auto">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden ${collapsed ? "p-2" : "p-3"}`}
        >
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="relative flex-shrink-0">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="avatar" 
                className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            
            <AnimatePresence>
              {!collapsed && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-semibold text-slate-900 truncate">John Doe</p>
                  <p className="text-[10px] text-slate-500 truncate">john@invoice.ai</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
}