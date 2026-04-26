import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Bell, Shield, Save, 
  Mail, Phone, Briefcase, Camera, 
  Lock, Eye, EyeOff,
  Edit2, X, Palette, Trash2, AlertTriangle, Loader2
} from "lucide-react";
import { apiGet, apiPut, apiDelete } from "../api";
import toast from 'react-hot-toast';

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Profile & Preferences State
  const [data, setData] = useState({
    id: 0,
    name: "",
    email: "",
    theme: "light",
    emailNotifications: true,
    pushNotifications: true,
    phoneNumber: "",
    bio: ""
  });

  // Fetch data on load
  const fetchProfile = async () => {
    try {
      const profile = await apiGet("/profile");
      setData(profile);
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save Basic Info
      await apiPut("/profile/basic", {
        name: data.name,
        email: data.email
      });

      // Save Preferences
      await apiPut("/profile/preferences", {
        theme: data.theme,
        emailNotifications: data.emailNotifications,
        pushNotifications: data.pushNotifications,
        phoneNumber: data.phoneNumber,
        bio: data.bio
      });

      toast.success("Settings saved successfully!");
      
      // Apply theme if changed
      if (data.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

    } catch (error) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await apiDelete("/profile");
      toast.success("Account deleted successfully");
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  const handleClosePopup = () => {
    setShowSettingsPopup(false);
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User, color: "indigo" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "blue" },
    { id: "security", label: "Security", icon: Shield, color: "red" }
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading settings...</p>
        </div>
      );
    }

    switch(activeTab) {
      case "profile":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {data.name ? data.name[0].toUpperCase() : "?"}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{data.name}</h3>
                <p className="text-sm text-gray-500">{data.email}</p>
              </div>
            </div>

            <InputGroup 
              label="Full Name" 
              value={data.name}
              onChange={(e) => setData({...data, name: e.target.value})}
              icon={<User size={14} />}
            />
            <InputGroup 
              label="Email Address" 
              type="email"
              value={data.email}
              onChange={(e) => setData({...data, email: e.target.value})}
              icon={<Mail size={14} />}
            />
            <InputGroup 
              label="Phone Number" 
              value={data.phoneNumber || ""}
              onChange={(e) => setData({...data, phoneNumber: e.target.value})}
              icon={<Phone size={14} />}
            />
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Edit2 size={12} /> Bio
              </label>
              <textarea 
                value={data.bio || ""}
                onChange={(e) => setData({...data, bio: e.target.value})}
                rows={3} 
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="Tell us about yourself..."
              />
            </div>
          </motion.div>
        );

      case "notifications":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <ToggleSwitch 
              label="Email Notifications" 
              description="Receive important updates via email"
              checked={data.emailNotifications}
              onChange={(e) => setData({...data, emailNotifications: e.target.checked})}
            />
            <ToggleSwitch 
              label="Push Notifications" 
              description="Real-time alerts in your browser"
              checked={data.pushNotifications}
              onChange={(e) => setData({...data, pushNotifications: e.target.checked})}
            />
          </motion.div>
        );

      case "security":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
              <h4 className="text-red-800 font-bold text-sm mb-1 flex items-center gap-2">
                <AlertTriangle size={16} /> Danger Zone
              </h4>
              <p className="text-xs text-red-600 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-all flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete Account
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {showSettingsPopup && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClosePopup}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-5xl h-[85vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Settings
                </h2>
                <p className="text-gray-500 text-sm mt-1">Manage your account preferences</p>
              </div>
              <button
                onClick={handleClosePopup}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex">
              <div className="w-64 border-r border-gray-100 p-4 overflow-y-auto bg-gray-50/50">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const getColorClass = (color, type) => {
                    const colors = {
                      indigo: { bg: "bg-indigo-100", text: "text-indigo-600", dot: "bg-indigo-500" },
                      blue: { bg: "bg-blue-100", text: "text-blue-600", dot: "bg-blue-500" },
                      purple: { bg: "bg-purple-100", text: "text-purple-600", dot: "bg-purple-500" },
                      red: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" }
                    };
                    return colors[color]?.[type] || "";
                  };

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${
                        activeTab === tab.id
                          ? `${getColorClass(tab.color, "bg")} ${getColorClass(tab.color, "text")} shadow-sm`
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={18} className={activeTab === tab.id ? getColorClass(tab.color, "text") : ""} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 overflow-y-auto p-6 relative">
                {renderContent()}
                
                {!loading && activeTab !== "security" && (
                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                  onClick={() => setShowDeleteConfirm(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-[70] p-6 text-center"
                >
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account?</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    This will permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDeleteAccount}
                      className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

function InputGroup({ label, type = "text", value, onChange, placeholder, icon }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
        {icon} {label}
      </label>
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-50 rounded-xl px-4 py-2.5 text-sm border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
      />
    </div>
  );
}

function ToggleSwitch({ label, description, checked, onChange }) {
  return (
    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <p className="font-medium text-gray-800 text-sm">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <div className="relative ml-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className={`w-10 h-5 rounded-full transition-all ${checked ? 'bg-indigo-600' : 'bg-gray-300'}`}>
          <div className={`w-4 h-4 bg-white rounded-full transition-all mt-0.5 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
      </div>
    </label>
  );
}