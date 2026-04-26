import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mic, Square, ArrowRight, Wand2, Layout } from 'lucide-react';
import toast from 'react-hot-toast';

const MagicCreate = () => {
  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTemplate = location.state?.selectedTemplate || "default";

  useEffect(() => {
    // Initialize Web Speech API if supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-IN'; // Indian English to help with names and "rupees"

      recog.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setPrompt(prev => {
          // A bit of logic to avoid overwriting existing text completely
          // For simplicity in this demo, just replace if it's the first time, 
          // or append carefully. We will just use the current transcript if it's new
          return currentTranscript; 
        });
      };

      recog.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error !== 'no-speech') {
          toast.error("Microphone error: " + event.error);
          setIsListening(false);
        }
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      if (!recognition) {
        toast.error("Speech recognition is not supported in your browser.");
        return;
      }
      setPrompt(""); // Clear before new voice
      recognition.start();
      setIsListening(true);
      toast.success("Listening... Speak your prompt!");
    }
  };

  // Smart Heuristic Parser to simulate AI extraction
  const parsePrompt = (text) => {
    const lowerPrompt = text.toLowerCase();
    let clientName = "";
    let amount = 0;
    let taxRate = 0;

    const words = text.split(" ");
    
    // Name extraction
    const payIndex = words.findIndex(w => w.toLowerCase() === 'pay' || w.toLowerCase() === 'paid');
    if (payIndex > 0) {
      clientName = words.slice(0, payIndex).join(" ");
    } else if (words.length > 0) {
      clientName = words[0]; // fallback
    }

    // Capitalize name
    clientName = clientName.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    // Clean up if name has punctuation
    clientName = clientName.replace(/[^\w\s]/g, "");

    // Amount extraction
    const amountMatch = lowerPrompt.match(/(?:rs\.?|rupees?)?\s*(\d+)\s*(?:rupees?|rs\.?)?/);
    if (amountMatch) {
      amount = parseInt(amountMatch[1], 10);
    }

    // GST/Tax extraction
    const gstMatch = lowerPrompt.match(/(\d+)%\s*gst/);
    if (gstMatch) {
      taxRate = parseInt(gstMatch[1], 10);
    } else {
      const percentMatch = lowerPrompt.match(/(\d+)%/);
      if (percentMatch) taxRate = parseInt(percentMatch[1], 10);
    }

    return { clientName, amount, taxRate };
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    const parsedData = parsePrompt(prompt);
    
    if (!parsedData.clientName && parsedData.amount === 0) {
      toast.error("Could not understand the prompt clearly. Please try again.");
      return;
    }

    toast.success("Prompt analyzed successfully!");
    
    // Navigate to Create Invoice with parsed data and selected template
    navigate("/dashboard/create", { state: { parsedData, selectedTemplate } });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4">
          <Wand2 className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Magic Create
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Simply type or speak what you need, and our smart engine will automatically craft the perfect invoice for you.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
      >
        <div className="p-8">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'Rahul pay 1500 rupees with 9% GST'"
              className="w-full min-h-[200px] p-6 text-xl bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all resize-none outline-none placeholder:text-slate-400"
            />
            
            {/* Voice Button */}
            <button
              onClick={toggleListening}
              className={`absolute right-6 bottom-6 p-4 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
                isListening 
                  ? "bg-red-500 text-white animate-pulse" 
                  : "bg-white text-indigo-600 hover:bg-indigo-50 border border-slate-200"
              }`}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-6 h-6" />}
            </button>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded-lg">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Try saying: "Rahul pay 1500 rupees with 9% gst"</span>
            </div>

            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
            >
              Generate Invoice
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MagicCreate;
