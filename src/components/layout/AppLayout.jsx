import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import { ChevronDown, UserCog, LogOut, User } from "lucide-react";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const userData = {
    name: "John Doe",
    initials: "JD",
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = collapsed ? 80 : 260;

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Sidebar */}
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)} 
      />

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{ 
          marginLeft: isMobile ? 0 : sidebarWidth 
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen flex flex-col"
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Left section - empty for spacing */}
            <div className="w-8"></div>

            {/* Right section - User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                  {userData.initials}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-slate-700">
                  {userData.name}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-0"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                    >
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="block">
                        <DropdownItem icon={User} label="My Profile" />
                      </Link>
                      <Link to="/settings" onClick={() => setUserMenuOpen(false)} className="block">
                        <DropdownItem icon={UserCog} label="Account Settings" />
                      </Link>
                      <div className="h-px bg-slate-100 my-1" />
                      <Link to="/logout" onClick={() => setUserMenuOpen(false)} className="block">
                        <DropdownItem icon={LogOut} label="Sign Out" danger />
                      </Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </motion.main>
    </div>
  );
}

function DropdownItem({ icon: Icon, label, danger }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
        danger 
          ? hovered ? 'bg-red-50 text-red-600' : 'text-red-500'
          : hovered ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'
      }`}
    >
      <Icon size={15} />
      {label}
    </div>
  );
}