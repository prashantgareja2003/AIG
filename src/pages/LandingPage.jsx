import { useState, useEffect } from "react";
import { motion, useAnimation, useMotionValue, useSpring } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { 
  FiFileText, 
  FiUsers, 
  FiPieChart, 
  FiZap, 
  FiShield, 
  FiArrowRight,
  FiStar,
  FiTrendingUp,
  FiPlay,
  FiCheck,
  FiX,
  FiCpu,
  FiGlobe,
  FiDollarSign,
  FiMail,
  FiMessageSquare,
  FiBarChart2,
  FiLock,
  FiChevronRight,
  FiCopy,
  FiDownload,
  FiSend,
  FiSmartphone,
  FiMenu, 
  FiHeart 
} from "react-icons/fi";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const fullText = "Generate professional invoices in seconds with AI";
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleMagneticMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    mouseX.set(distanceX * 0.5);
    mouseY.set(distanceY * 0.5);
  };

  const handleMagneticLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans overflow-x-hidden selection:bg-indigo-200 selection:text-indigo-900">
      
      <motion.div
        className="fixed w-6 h-6 rounded-full bg-indigo-500/30 pointer-events-none z-50 mix-blend-screen hidden lg:block"
        animate={{ x: mousePosition.x - 12, y: mousePosition.y - 12 }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      
      <nav className={`fixed w-full z-40 transition-all duration-500 ${
        scrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-lg shadow-slate-200/20" : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur-lg opacity-50"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FiCpu className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                InvoiceAI
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {["Features", "How it Works", "Pricing"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-4 ml-4"
              >
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition">
                  Sign in
                </Link>
                <Link to="/signup">
                  <motion.button 
                    onMouseMove={handleMagneticMove}
                    onMouseLeave={handleMagneticLeave}
                    style={{ x: springX, y: springY }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all"
                  >
                    Start Free Trial
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <motion.div 
          initial={false}
          animate={{ height: isMenuOpen ? "auto" : 0, opacity: isMenuOpen ? 1 : 0 }}
          className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-slate-100"
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            {["Features", "How it Works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="block py-3 px-4 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-4 space-y-2">
              <Link to="/login" className="block py-3 px-4 text-slate-700 hover:bg-indigo-50 rounded-xl font-medium">
                Sign in
              </Link>
              <Link to="/signup" className="block py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-center">
                Start Free Trial
              </Link>
            </div>
          </div>
        </motion.div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse" style={{ animationDelay: '1000ms' }}></div>
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '2000ms' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial="hidden" animate="visible" variants={staggerChildren}>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full mb-8 border border-indigo-100">
                <div className="flex -space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-2 border-white" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-indigo-700">10,000+ businesses trust us</span>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-[1.2]">
                Create Invoices with{" "}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    AI Magic
                  </span>
                  <motion.span 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                  />
                </span>
              </motion.h1>
              
              <motion.div variants={fadeInUp} className="h-12 mb-6">
                <p className="text-lg lg:text-xl text-slate-600 font-medium">
                  {typedText}
                  <span className="animate-pulse ml-1">|</span>
                </p>
              </motion.div>
              
              <motion.p variants={fadeInUp} className="text-slate-600 mb-8 leading-relaxed">
                Stop wasting hours on manual invoicing. Our AI understands your business and creates 
                professional invoices in seconds. Smart, fast, and beautifully designed.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group"
                  >
                    <FiZap className="group-hover:rotate-12 transition-transform" />
                    Try AI Invoice Generator
                    <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
                >
                  <FiPlay className="text-indigo-600" />
                  Watch Demo (2 min)
                </motion.button>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <FiCheck className="text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheck className="text-green-500" />
                  <span>Free 14-day trial</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative z-10 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
              >
                <div className="border-b border-slate-100 p-2 bg-slate-50/50">
                  <div className="flex gap-1">
                    {["AI Generate", "Preview", "Send"].map((tab, i) => (
                      <button
                        key={tab}
                        onClick={() => setActiveDemoTab(i)}
                        className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
                          activeDemoTab === i 
                            ? "bg-white text-indigo-600 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-6">
                  <AnimatedDemoContent activeTab={activeDemoTab} />
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-6 -right-6 z-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiCpu className="text-white w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">AI Ready</p>
                  <p className="text-indigo-100 text-xs">98% accuracy</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -left-6 z-20 bg-white rounded-xl shadow-lg p-3 flex items-center gap-3 border border-slate-100"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 border-2 border-white" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">Loved by 10k+ users</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">Trusted by innovative companies</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            {["Stripe", "Shopify", "Slack", "Notion", "Figma"].map((company) => (
              <div key={company} className="flex justify-center">
                <span className="text-xl font-bold text-slate-400">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-sm font-semibold mb-6 inline-block border border-indigo-100">
              ✨ AI-Powered Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to get paid faster
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful AI automation combined with beautiful design. Create, send, and track invoices effortlessly.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FiCpu,
                title: "AI Smart Fill",
                description: "Describe your work in plain English. Our AI extracts line items, calculates totals, and applies correct tax rates automatically.",
                gradient: "from-blue-500 to-cyan-500",
                stats: "Saves 15 mins per invoice"
              },
              {
                icon: FiGlobe,
                title: "Multi-Currency & Language",
                description: "Automatically convert currencies and translate invoices. Perfect for international clients and remote teams.",
                gradient: "from-purple-500 to-pink-500",
                stats: "150+ currencies"
              },
              {
                icon: FiBarChart2,
                title: "Smart Analytics",
                description: "AI-powered insights show you payment patterns, client behavior, and cash flow predictions.",
                gradient: "from-orange-500 to-red-500",
                stats: "Predict with 94% accuracy"
              },
              {
                icon: FiMail,
                title: "Auto Reminders",
                description: "AI crafts personalized, friendly payment reminders that get results without damaging relationships.",
                gradient: "from-green-500 to-emerald-500",
                stats: "70% faster payments"
              },
              {
                icon: FiLock,
                title: "Bank-Level Security",
                description: "End-to-end encryption with automatic backups. Your financial data is always protected.",
                gradient: "from-indigo-600 to-blue-600",
                stats: "SOC 2 Type II certified"
              },
              {
                icon: FiSmartphone,
                title: "Mobile First Design",
                description: "Create and send invoices from anywhere. Clients can pay instantly on any device.",
                gradient: "from-violet-500 to-purple-600",
                stats: "iOS & Android apps"
              }
            ].map((feature, index) => (
              <EnhancedFeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-4 block">
                How AI Invoice Generation Works
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                From description to professional invoice in 30 seconds
              </h2>
              <p className="text-lg text-slate-600 mb-12">
                Our AI understands your business context and creates perfect invoices every time.
              </p>

              <div className="space-y-8">
                {[
                  {
                    step: "1",
                    title: "Describe Your Work",
                    description: "Type or speak what you did: 'Website redesign, 20 hours at $85/hr'. That's it.",
                    icon: FiMessageSquare
                  },
                  {
                    step: "2",
                    title: "AI Does the Magic",
                    description: "Our model extracts services, calculates totals, applies tax rules, and formats everything professionally.",
                    icon: FiCpu
                  },
                  {
                    step: "3",
                    title: "Review & Send",
                    description: "Preview the beautiful invoice, make any tweaks, and send. Clients can pay instantly.",
                    icon: FiSend
                  }
                ].map((item) => (
                  <motion.div 
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: parseInt(item.step) * 0.1 }}
                    className="flex gap-5"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        {item.step}
                      </div>
                      {item.step !== "3" && (
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-indigo-300 to-transparent"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <item.icon className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                      </div>
                      <p className="text-slate-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs text-indigo-200 ml-2">AI Terminal</span>
                </div>
                
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">$</span>
                    <span className="text-indigo-200">invoice --create</span>
                  </div>
                  <div className="pl-4 space-y-2">
                    <div className="text-slate-300">
                      <span className="text-purple-400">AI:</span> Analyzing description...
                    </div>
                    <div className="bg-indigo-800/30 rounded-lg p-3 border border-indigo-700/50">
                      <p className="text-indigo-100 mb-2">"Website redesign project, 20 hours at $85/hr"</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Service detected:</span>
                          <span className="text-green-400">Website Redesign</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Hours:</span>
                          <span className="text-green-400">20</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Rate:</span>
                          <span className="text-green-400">$85.00</span>
                        </div>
                        <div className="border-t border-indigo-700/50 my-2"></div>
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-400">Total:</span>
                          <span className="text-green-400">$1,700.00</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <FiCheck className="w-4 h-4" />
                      <span>Invoice #INV-2024-001 generated successfully!</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-2">
                  <button className="flex-1 py-2 bg-indigo-700/50 hover:bg-indigo-700 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                    <FiCopy className="w-4 h-4" />
                    Copy
                  </button>
                  <button className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                    <FiDownload className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Active Users", icon: FiUsers },
              { value: "$50M+", label: "Invoices Generated", icon: FiDollarSign },
              { value: "98%", label: "AI Accuracy", icon: FiCpu },
              { value: "24/7", label: "AI Support", icon: FiMessageSquare }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center text-white"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-indigo-100 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-sm font-semibold mb-6 inline-block border border-indigo-100">
              Simple Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Start free, scale as you grow
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              No hidden fees. All AI features included in every plan.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "0",
                description: "Perfect for freelancers",
                features: ["5 AI invoices/month", "Basic templates", "Email support", "PDF export"],
                cta: "Start Free",
                popular: false
              },
              {
                name: "Pro",
                price: "29",
                description: "For growing businesses",
                features: ["Unlimited AI invoices", "Custom branding", "Auto-reminders", "Analytics dashboard", "Priority support", "Multi-currency"],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "99",
                description: "For teams & agencies",
                features: ["Everything in Pro", "Team collaboration", "API access", "Dedicated support", "Custom integrations", "SLA guarantee"],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.popular 
                    ? "bg-gradient-to-b from-indigo-50 to-white border-2 border-indigo-200 shadow-xl" 
                    : "bg-white border border-slate-200 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                      <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}>
                    {plan.cta}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to revolutionize your invoicing?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Join thousands of businesses using AI to create professional invoices in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                >
                  <FiZap className="w-5 h-5" />
                  Start Free Trial
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:bg-slate-700 transition-all"
              >
                Schedule Demo
              </motion.button>
            </div>
            <p className="text-slate-400 text-sm mt-6">No credit card required • 14-day free trial • Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FiCpu className="text-white w-4 h-4" />
                </div>
                <span className="text-xl font-bold text-white">InvoiceAI</span>
              </div>
              <p className="text-sm mb-4 max-w-xs">
                AI-powered invoice generation for modern businesses.
              </p>
              <div className="flex space-x-4">
                {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                  <a key={social} href="#" className="text-slate-400 hover:text-white transition">
                    {social}
                  </a>
                ))}
              </div>
            </div>
            
            {[
              { title: "Product", links: ["Features", "Pricing", "API", "Changelog"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "Compliance"] }
            ].map((section, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-white mb-4 text-sm">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm hover:text-white transition">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} InvoiceAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AnimatedDemoContent = ({ activeTab }) => {
  const variants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const tabs = [
    {
      content: (
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Describe your work
            </label>
            <textarea 
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="e.g., Website redesign, 20 hours at $85/hr"
              defaultValue="Website redesign, 20 hours at $85/hr"
            />
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
            <FiCpu className="w-4 h-4" />
            Generate with AI
          </button>
        </div>
      )
    },
    {
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500">Invoice #</p>
                <p className="font-mono font-bold">INV-2024-001</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Date</p>
                <p className="font-mono">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-indigo-200">
                <span>Website Redesign (20h @ $85)</span>
                <span className="font-mono font-bold">$1,700.00</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-bold">Total</span>
                <span className="font-mono font-bold text-lg">$1,700.00</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 text-green-700 mb-3">
              <FiCheck className="w-5 h-5" />
              <span className="font-semibold">Invoice Ready!</span>
            </div>
            <div className="space-y-2">
              <input 
                type="email" 
                placeholder="client@company.com" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                defaultValue="client@company.com"
              />
              <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                <FiSend className="w-4 h-4" />
                Send Invoice
              </button>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div
      key={activeTab}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {tabs[activeTab].content}
    </motion.div>
  );
};

const EnhancedFeatureCard = ({ feature, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const controls = useAnimation();
  const Icon = feature.icon;
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl p-6 border border-slate-100 hover:border-indigo-100 transition-all duration-300 hover:shadow-xl cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1"
            >
              <FiZap className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-600">{feature.stats}</span>
            </motion.div>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
        
        <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Learn more <FiChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage;