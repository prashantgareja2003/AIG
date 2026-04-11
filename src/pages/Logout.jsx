import React from "react";
import { motion } from "framer-motion";
import { LogOut, Smile } from "lucide-react";

export default function Logout() {
  const handleLogoutConfirm = () => {
    // Implement your logout logic here
    // e.g., clear localStorage, tokens, global state, etc.
    window.location.href = "/login"; // Redirect back to login
  };

  const handleCancel = () => {
    window.location.href = "/"; // Redirect back to Dashboard
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-lg glass rounded-3xl p-10 shadow-2xl shadow-indigo-50 border border-slate-100 text-center space-y-8"
      >
        <div className="relative inline-flex items-center justify-center">
            <div className="w-24 h-24 rounded-full gradient-primary p-2">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-inner">
                    <LogOut size={48} />
                </div>
            </div>
            <Smile className="absolute -bottom-2 -right-2 w-10 h-10 text-amber-500 bg-white rounded-full p-1" />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Confirm Sign Out</h2>
          <p className="text-slate-500 mt-2 max-w-xs mx-auto">
            You are about to securely log out of your InvoiceAI account. Hope to see you again soon!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <button 
            onClick={handleCancel}
            className="w-full sm:flex-1 py-3.5 text-sm font-semibold rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            No, Keep Me Logged In
          </button>
          <button 
            onClick={handleLogoutConfirm}
            className="w-full sm:flex-1 py-3.5 text-sm font-semibold rounded-2xl gradient-primary text-white shadow-lg shadow-indigo-100 transition-transform hover:scale-[1.02]"
          >
            Yes, I'm Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}