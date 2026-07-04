import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PieChart,
  Wand2,
  FilePlus,
  LayoutTemplate,
  History,
  Users,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ChevronDown, 
  UserCog, 
  LogOut, 
  Menu,
  X,
  FileText
} from "lucide-react";
import toast from "react-hot-toast";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [userData, setUserData] = useState({
    name: "User",
    email: "user@example.com",
    initials: "U",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserData({
        name: user.name,
        email: user.email,
        initials: user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : "U"
      });
    }
  }, []);

  const menuItems = [
    { path: "/dashboard", icon: PieChart, label: "Overview" },
    { path: "/dashboard/magic-create", icon: Wand2, label: "AI Generate" },
    { path: "/dashboard/create", icon: FilePlus, label: "New Invoice" },
    { path: "/dashboard/templates", icon: LayoutTemplate, label: "Templates" },
    { path: "/dashboard/invoices", icon: History, label: "Invoice History" },
    { path: "/dashboard/clients", icon: Users, label: "Client Directory" },
    { path: "/dashboard/settings", icon: Sliders, label: "Preferences" },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    // Close menus
    setUserMenuOpen(false);
    setMobileSidebarOpen(false);
    
    // Clear authentication
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    
    // Show success message
    toast.success("Logged out successfully");
    
    // Force reload and redirect to landing page
    window.location.href = "/";
  };

  const isActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const sidebarWidth = collapsed ? 80 : 260;

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          initial={false}
          animate={{ width: sidebarWidth }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed left-0 top-0 h-full bg-slate-900/5 backdrop-blur-xl border-r border-slate-200/50 z-40 flex flex-col shadow-xl overflow-hidden"
        >
          {/* Decorative Gradient Blobs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute top-1/2 -right-32 w-64 h-64 bg-blue-500 rounded-full blur-[100px] animate-pulse delay-1000" />
          </div>

          <div className="relative h-full flex flex-col z-10">
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md border border-rose-900/10">
                <FileText className="w-5 h-5 text-white" />
              </div>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap"
                >
                  InvoicePro
                </motion.span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-8 px-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-8">
              {/* Main Section */}
              <div>
                {!collapsed && (
                  <p className="px-3 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Main Menu</p>
                )}
                <div className="space-y-1.5">
                  {menuItems.slice(0, 3).map((item) => (
                    <NavItem key={item.path} item={item} collapsed={collapsed} active={isActive(item.path)} />
                  ))}
                </div>
              </div>

              {/* Management Section */}
              <div>
                {!collapsed && (
                  <p className="px-3 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Management</p>
                )}
                <div className="space-y-1.5">
                  {menuItems.slice(3, 6).map((item) => (
                    <NavItem key={item.path} item={item} collapsed={collapsed} active={isActive(item.path)} />
                  ))}
                </div>
              </div>

              {/* System Section */}
              <div>
                {!collapsed && (
                  <p className="px-3 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">System</p>
                )}
                <div className="space-y-1.5">
                  {menuItems.slice(6).map((item) => (
                    <NavItem key={item.path} item={item} collapsed={collapsed} active={isActive(item.path)} />
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* User Info & Toggle */}
          <div className="p-4 bg-slate-900/5 border-t border-slate-200/50">
            {!collapsed ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
                onClick={() => navigate("/dashboard/settings")}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:rotate-6 transition-transform border border-rose-900/10">
                      {userData.initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{userData.name}</p>
                    <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider">{userData.email}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex justify-center mb-4">
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg" onClick={() => navigate("/dashboard/settings")}>
                    {userData.initials}
                 </div>
              </div>
            )}
            
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 rounded-xl transition-all shadow-sm group"
            >
              {collapsed ? (
                <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              ) : (
                <div className="flex items-center gap-2">
                  <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-wider">Collapse View</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.aside>
    )}

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
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <div className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Left section */}
            <div className="flex items-center gap-3">
              {isMobile && (
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Menu size={20} className="text-slate-700" />
                </button>
              )}
              <h1 className="text-xl font-semibold text-slate-800 hidden sm:block">
                {menuItems.find(item => isActive(item.path))?.label || "Dashboard"}
              </h1>
            </div>

            {/* Right section - User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm border border-rose-900/10">
                  {userData.initials}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-slate-700">
                  {userData.name}
                </span>
                <ChevronDown
                  size={16}
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
                      className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">{userData.name}</p>
                        <p className="text-xs text-slate-500">{userData.email}</p>
                      </div>
                      <Link to="/dashboard/settings" onClick={() => setUserMenuOpen(false)} className="block">
                        <DropdownItem icon={UserCog} label="Account Settings" />
                      </Link>
                      <div className="h-px bg-slate-100 my-1" />
                      <button 
                        onClick={handleLogout}
                        className="block w-full"
                      >
                        <DropdownItem icon={LogOut} label="Sign Out" danger />
                      </button>
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

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed left-0 top-0 h-full w-72 z-50 bg-white shadow-xl"
            >
              <div className="h-full flex flex-col">
                {/* Mobile Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      InvoicePro
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-slate-600" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 py-6 px-3 overflow-y-auto">
                  <div className="space-y-1.5">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      
                      return (
                        <Link 
                          key={item.path} 
                          to={item.path}
                          onClick={() => setMobileSidebarOpen(false)}
                        >
                          <motion.div
                            whileTap={{ scale: 0.98 }}
                            className={`
                              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                              ${active 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border border-rose-900/10' 
                                : 'text-slate-600 hover:bg-slate-100'
                              }
                            `}
                          >
                            <Icon size={20} className="flex-shrink-0" />
                            <span className="font-medium text-sm">{item.label}</span>
                          </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                </nav>

                {/* Mobile User Info */}
                <div className="border-t border-slate-100 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {userData.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700">{userData.name}</p>
                      <p className="text-xs text-slate-500 truncate">{userData.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium text-sm"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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

function NavItem({ item, collapsed, active }) {
  const Icon = item.icon;
  
  return (
    <Link to={item.path}>
      <motion.div
        whileHover={{ x: collapsed ? 0 : 5 }}
        whileTap={{ scale: 0.97 }}
        className={`
          relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 group
          ${active 
            ? 'text-white' 
            : 'text-slate-600 hover:text-indigo-600 hover:bg-white/60 hover:shadow-sm'
          }
          ${collapsed ? 'justify-center' : ''}
        `}
      >
        {active && (
          <motion.div 
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-200 z-0 border border-rose-900/10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        
        <Icon size={20} className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-600'}`} />
        
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 font-semibold text-sm whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}

        {/* Collapsed Tooltip */}
        {collapsed && (
          <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
            {item.label}
          </div>
        )}
      </motion.div>
    </Link>
  );
}