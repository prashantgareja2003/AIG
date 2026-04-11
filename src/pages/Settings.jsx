import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Bell, Shield, Save, 
  Mail, Phone, Briefcase, Camera, 
  Lock, Eye, EyeOff,
  Edit2, X
} from "lucide-react";
import toast from 'react-hot-toast';

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(true);
  
  // Profile Data
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    company: "Tech Solutions Inc.",
    position: "Senior Developer",
    bio: "Passionate developer with 8+ years of experience in building amazing web applications.",
    avatar: null
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    invoiceReminders: true,
    paymentConfirmations: true,
    marketingEmails: false,
    pushNotifications: true
  });

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    loginAlerts: true
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Settings saved successfully!");
    setIsSaving(false);
    handleClosePopup();
  };

  const handleClosePopup = () => {
    setShowSettingsPopup(false);
    // Navigate back to dashboard after popup closes
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result });
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User, color: "indigo" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "blue" },
    { id: "security", label: "Security", icon: Shield, color: "red" }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case "profile":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    profileData.firstName[0] + profileData.lastName[0]
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera size={14} className="text-gray-600" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{profileData.firstName} {profileData.lastName}</h3>
                <p className="text-sm text-gray-500">{profileData.position}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup 
                label="First Name" 
                value={profileData.firstName}
                onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                icon={<User size={14} />}
              />
              <InputGroup 
                label="Last Name" 
                value={profileData.lastName}
                onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                icon={<User size={14} />}
              />
            </div>
            <InputGroup 
              label="Email Address" 
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              icon={<Mail size={14} />}
            />
            <InputGroup 
              label="Phone Number" 
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              icon={<Phone size={14} />}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputGroup 
                label="Company" 
                value={profileData.company}
                onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                icon={<Briefcase size={14} />}
              />
              <InputGroup 
                label="Position" 
                value={profileData.position}
                onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                icon={<Briefcase size={14} />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Edit2 size={12} /> Bio
              </label>
              <textarea 
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
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
              label="Email Alerts" 
              description="Receive email notifications about important updates"
              checked={notifications.emailAlerts}
              onChange={(e) => setNotifications({...notifications, emailAlerts: e.target.checked})}
            />
            <ToggleSwitch 
              label="Invoice Reminders" 
              description="Get reminders for pending and overdue invoices"
              checked={notifications.invoiceReminders}
              onChange={(e) => setNotifications({...notifications, invoiceReminders: e.target.checked})}
            />
            <ToggleSwitch 
              label="Payment Confirmations" 
              description="Receive confirmation when payments are received"
              checked={notifications.paymentConfirmations}
              onChange={(e) => setNotifications({...notifications, paymentConfirmations: e.target.checked})}
            />
            <ToggleSwitch 
              label="Marketing Emails" 
              description="Receive updates about new features and offers"
              checked={notifications.marketingEmails}
              onChange={(e) => setNotifications({...notifications, marketingEmails: e.target.checked})}
            />
            <ToggleSwitch 
              label="Push Notifications" 
              description="Get real-time notifications in your browser"
              checked={notifications.pushNotifications}
              onChange={(e) => setNotifications({...notifications, pushNotifications: e.target.checked})}
            />
          </motion.div>
        );

      case "security":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Lock size={14} /> Change Password
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Current Password"
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 pr-10 text-sm border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <input 
                  type="password" 
                  placeholder="New Password" 
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
                <input 
                  type="password" 
                  placeholder="Confirm New Password" 
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>
            </div>

            <ToggleSwitch 
              label="Two-Factor Authentication" 
              description="Add an extra layer of security to your account"
              checked={security.twoFactorAuth}
              onChange={(e) => setSecurity({...security, twoFactorAuth: e.target.checked})}
            />
            <ToggleSwitch 
              label="Login Alerts" 
              description="Get notified when someone logs into your account"
              checked={security.loginAlerts}
              onChange={(e) => setSecurity({...security, loginAlerts: e.target.checked})}
            />

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Session Timeout (minutes)</label>
              <select 
                value={security.sessionTimeout}
                onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="never">Never</option>
              </select>
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClosePopup}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-5xl h-[85vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
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

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Sidebar */}
              <div className="w-64 border-r border-gray-100 p-4 overflow-y-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const getColorClass = (color, type) => {
                    const colors = {
                      indigo: {
                        bg: "bg-indigo-50",
                        text: "text-indigo-600",
                        dot: "bg-indigo-500"
                      },
                      blue: {
                        bg: "bg-blue-50",
                        text: "text-blue-600",
                        dot: "bg-blue-500"
                      },
                      red: {
                        bg: "bg-red-50",
                        text: "text-red-600",
                        dot: "bg-red-500"
                      }
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
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={18} className={activeTab === tab.id ? getColorClass(tab.color, "text") : ""} />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div 
                          layoutId="activeTab"
                          className={`ml-auto w-1.5 h-1.5 rounded-full ${getColorClass(tab.color, "dot")}`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {renderContent()}
                
                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Helper Components
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