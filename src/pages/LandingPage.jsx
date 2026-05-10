import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FiFileText, 
  FiUsers, 
  FiPieChart, 
  FiZap, 
  FiShield, 
  FiArrowRight,
  FiPlay,
  FiCheck,
  FiX,
  FiCpu,
  FiMessageSquare,
  FiDownload,
  FiSend,
  FiMenu,
} from "react-icons/fi";
import { 
  SiStripe, 
  SiShopify, 
  SiPaypal, 
  SiWise, 
  SiZoom, 
  SiAirbnb 
} from "react-icons/si";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans overflow-x-hidden">
      {/* Background blobs for glass effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] animate-blob"></div>
        <div className="absolute top-[30%] right-[-10%] w-[35%] h-[35%] bg-purple-500/10 blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Navigation - Clean & Minimal */}
      <nav className={`fixed w-full z-40 transition-all duration-500 ${
        scrolled ? "glass-light py-3 border-b border-white/20" : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <FiFileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">InvoicePro</span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-6">
              {["Features", "How it Works", "Templates", "Pricing"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors relative group py-2"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-3 ml-4"
              >
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                  Sign in
                </Link>
                <Link to="/signup">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-xl hover:shadow-xl hover:shadow-blue-200 transition-all"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white border-b border-gray-100"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {["Features", "How it Works", "Templates", "Pricing"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block py-3 px-4 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 space-y-2">
                  <Link to="/login" className="block py-3 px-4 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium">
                    Sign in
                  </Link>
                  <Link to="/signup" className="block py-3 px-4 bg-blue-600 text-white rounded-lg font-medium text-center">
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-white pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial="hidden" animate="visible" variants={staggerChildren}>
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                Create Professional <br className="hidden sm:block" />
                Invoices in Seconds <br className="hidden sm:block" />
                with AI
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-gray-500 mb-8 leading-relaxed max-w-lg">
                Generate beautiful, accurate invoices instantly with AI. Save time, get paid faster, and grow your business.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/generate">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
                  >
                    Generate Invoice Now
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                >
                  View Templates
                </motion.button>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6">
                {[
                  { icon: FiZap, label: "AI-Powered", desc: "Smart invoice generation" },
                  { icon: FiFileText, label: "Customizable", desc: "Fully branded invoices" },
                  { icon: FiShield, label: "Secure", desc: "Your data is protected" }
                ].map((badge) => (
                  <div key={badge.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <badge.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{badge.label}</p>
                      <p className="text-xs text-gray-500">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Visual - Invoice Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="glass rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.01] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                
                <div className="relative space-y-5">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Invoice #INV-2024-001</p>
                      <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <FiFileText className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-medium">From</p>
                      <p className="font-semibold text-gray-900">Your Company Inc.</p>
                      <p className="text-gray-500 text-xs">hello@company.com</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 font-medium">To</p>
                      <p className="font-semibold text-gray-900">Client Name</p>
                      <p className="text-gray-500 text-xs">client@email.com</p>
                    </div>
                  </div>
                  
                  <div className="rounded-xl overflow-hidden border border-gray-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left py-3 px-4 text-gray-500 text-xs uppercase tracking-wider font-semibold">Service</th>
                          <th className="text-center py-3 px-4 text-gray-500 text-xs uppercase tracking-wider font-semibold">Qty</th>
                          <th className="text-right py-3 px-4 text-gray-500 text-xs uppercase tracking-wider font-semibold">Rate</th>
                          <th className="text-right py-3 px-4 text-gray-500 text-xs uppercase tracking-wider font-semibold">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        <tr>
                          <td className="py-3 px-4">
                            <p className="font-medium text-gray-900">Web Design</p>
                            <p className="text-xs text-gray-400">Homepage redesign</p>
                          </td>
                          <td className="py-3 px-4 text-center text-gray-600">20h</td>
                          <td className="py-3 px-4 text-right text-gray-600">₹850</td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">₹17,000</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4">
                            <p className="font-medium text-gray-900">Development</p>
                            <p className="text-xs text-gray-400">Frontend implementation</p>
                          </td>
                          <td className="py-3 px-4 text-center text-gray-600">15h</td>
                          <td className="py-3 px-4 text-right text-gray-600">₹1,200</td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">₹18,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t-2 border-gray-900">
                    <span className="text-lg font-bold text-gray-900">Total Due</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-blue-600">₹35,000.00</span>
                      <p className="text-xs text-gray-400">INR</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                      <FiDownload className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button className="flex-1 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
                      <FiSend className="w-4 h-4" />
                      Send Invoice
                    </button>
                  </div>
                </div>
              </div>
              
              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2 border border-gray-100"
              >
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">AI Generated</span>
                <FiCheck className="w-4 h-4 text-green-500" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Trusted Companies */}
        <div className="max-w-7xl mx-auto mt-20 pt-12 border-t border-gray-100">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-10">
            Trusted by freelancers, startups & businesses worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-30">
            <SiStripe className="w-20 h-8 text-gray-500" />
            <SiShopify className="w-20 h-8 text-gray-500" />
            <SiPaypal className="w-20 h-8 text-gray-500" />
            <SiWise className="w-20 h-8 text-gray-500" />
            <SiZoom className="w-20 h-8 text-gray-500" />
            <SiAirbnb className="w-20 h-8 text-gray-500" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <FiZap className="w-4 h-4" />
              POWERFUL FEATURES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Everything You Need to Create & Manage Invoices
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Powerful features to help you save time and get paid faster.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FiCpu,
                title: "AI Invoice Generation",
                description: "Create accurate invoices instantly from text, voice, or simple prompts.",
                stats: "Saves 15 mins per invoice"
              },
              {
                icon: FiFileText,
                title: "Beautiful Templates",
                description: "Choose from modern, customizable templates that match your brand.",
                stats: "50+ professional templates"
              },
              {
                icon: FiUsers,
                title: "Client Management",
                description: "Store client details, track history, and send invoices in one click.",
                stats: "Unlimited clients"
              },
              {
                icon: FiPieChart,
                title: "Reports & Analytics",
                description: "Track payments, overdue invoices, and cash flow with smart reports.",
                stats: "Real-time insights"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group glass rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-blue-100/20 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{feature.description}</p>
                  <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FiZap className="w-3 h-3" />
                    {feature.stats}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <FiPlay className="w-4 h-4" />
              HOW IT WORKS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Create an Invoice in 3 Simple Steps
            </h2>
            <p className="text-lg text-gray-500">Get from idea to sent invoice in under a minute</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>
            
            {[
              {
                step: "1",
                title: "Tell AI or Add Details",
                description: "Enter your invoice details or tell AI what you need. Describe your work in plain English.",
                icon: FiMessageSquare
              },
              {
                step: "2",
                title: "Review & Customize",
                description: "AI generates your invoice. Review and customize with your brand colors and logo.",
                icon: FiFileText
              },
              {
                step: "3",
                title: "Download & Send",
                description: "Download as PDF or send directly to your client. Get paid faster with online payments.",
                icon: FiSend
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center relative group"
              >
                <div className="w-16 h-16 glass border-2 border-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/10 relative z-10 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-2xl font-bold text-blue-600">{item.step}</span>
                </div>
                <div className="w-12 h-12 bg-blue-50/50 glass rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-[3rem] p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/90 mix-blend-multiply"></div>
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "10K+", label: "Active Shops" },
                { value: "₹5Cr+", label: "Invoices Generated" },
                { value: "99%", label: "AI Accuracy" },
                { value: "<2 sec", label: "Invoice Creation" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center text-white"
                >
                  <div className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">{stat.value}</div>
                  <div className="text-blue-200 text-sm font-semibold uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <FiZap className="w-4 h-4" />
              PRICING PLANS
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Simple Pricing for Indian Shops
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Choose the perfect plan for your business needs. No hidden charges.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "499",
                period: "month",
                features: ["50 Invoices/month", "Standard Templates", "Client Management", "Email Support"],
                recommended: false
              },
              {
                name: "Professional",
                price: "999",
                period: "month",
                features: ["Unlimited Invoices", "All Premium Templates", "AI Magic Create", "WhatsApp Integration", "Priority Support"],
                recommended: true
              },
              {
                name: "Enterprise",
                price: "2499",
                period: "month",
                features: ["Multi-user Access", "Custom Branding", "API Integration", "Dedicated Account Manager", "Custom Workflows"],
                recommended: false
              }
            ].map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className={`glass rounded-3xl p-8 relative overflow-hidden border-2 ${
                  plan.recommended ? "border-blue-500/50 scale-105 z-10" : "border-transparent"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                    Best Value
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-500 text-sm ml-1">/{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiCheck className="w-3 h-3 text-blue-600" />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    plan.recommended 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200" 
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 md:p-16 shadow-2xl shadow-blue-500/25 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                Ready to Save Time and Get Paid Faster?
              </h2>
              <p className="text-lg text-blue-100 mb-10 max-w-lg mx-auto">
                Join thousands of professionals using AI to create invoices in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-lg flex items-center justify-center gap-2 group"
                  >
                    Get Started Free
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link to="/dashboard/templates">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-4 bg-blue-500/20 text-white font-semibold rounded-xl border border-blue-400/30 hover:bg-blue-500/30 transition-all backdrop-blur-sm"
                  >
                    Explore Templates
                  </motion.button>
                </Link>
              </div>
              <p className="text-blue-200 text-sm mt-6">No credit card required • 14-day free trial • Cancel anytime</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FiFileText className="text-white w-4 h-4" />
                </div>
                <span className="text-xl font-bold text-white">InvoiceAI</span>
              </div>
              <p className="text-sm mb-4 max-w-xs leading-relaxed">
                AI-powered invoice generation for modern businesses. Save time, get paid faster, and grow your business.
              </p>
              <div className="flex space-x-4">
                {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                  <a key={social} href="#" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">
                    {social}
                  </a>
                ))}
              </div>
            </div>
            
            {[
              { title: "Product", links: [{label: "Features", href: "#features"}, {label: "Pricing", href: "#pricing"}, {label: "How it Works", href: "#how-it-works"}] },
              { title: "Legal", links: [{label: "Privacy", href: "#"}, {label: "Terms", href: "#"}] }
            ].map((section, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} InvoiceAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;