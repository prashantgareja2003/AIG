// StatCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, change, changeType, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ delay, duration: 0.4 }}
      className="group relative bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${color} blur-3xl -z-10`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs md:text-sm font-medium text-slate-500">{label}</p>
            <motion.p 
              className="text-2xl md:text-3xl font-bold mt-2 tracking-tight text-slate-900"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              {value}
            </motion.p>
            
            {change && (
              <motion.div 
                className="flex items-center mt-3 gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.2 }}
              >
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                  changeType === "up"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}>
                  {changeType === "up" ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {change}
                </div>
                <span className="text-xs text-slate-400">vs last month</span>
              </motion.div>
            )}
          </div>
          
          <motion.div 
            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg`}
            whileHover={{ rotate: 5, scale: 1.1 }}
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </motion.div>
        </div>

        {/* Progress Bar */}
        {change && (
          <div className="mt-4">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: changeType === "up" ? "75%" : "45%" }}
                transition={{ delay: delay + 0.3, duration: 0.8 }}
                className={`h-full rounded-full bg-gradient-to-r ${
                  changeType === "up" 
                    ? "from-emerald-500 to-emerald-400" 
                    : "from-rose-500 to-rose-400"
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}