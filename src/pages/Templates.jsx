import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout, Check, Sparkles } from "lucide-react";

export default function Templates() {
  const navigate = useNavigate();

  const templates = [
    {
      id: "default",
      name: "Standard Professional",
      description: "A clean, classic layout perfect for most business needs.",
      color: "from-slate-700 to-slate-900",
      previewBg: "bg-white",
      previewElements: (
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg shadow-sm bg-white h-full">
          <div className="flex justify-between items-start border-b border-gray-200 pb-3">
            <div className="w-1/2 space-y-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-100 rounded w-1/2"></div>
            </div>
            <div className="w-1/3 space-y-1 text-right flex flex-col items-end">
              <div className="h-4 bg-gray-800 rounded w-1/2"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
          <div className="flex justify-between pt-2">
            <div className="w-1/3 space-y-1">
              <div className="h-2 bg-gray-300 rounded w-1/2"></div>
              <div className="h-2 bg-gray-100 rounded w-3/4"></div>
            </div>
            <div className="w-1/3 space-y-1 text-right flex flex-col items-end">
              <div className="h-2 bg-gray-300 rounded w-1/2"></div>
              <div className="h-2 bg-gray-100 rounded w-3/4"></div>
            </div>
          </div>
          <div className="mt-4 border border-gray-100 rounded">
            <div className="h-6 bg-gray-800 w-full rounded-t"></div>
            <div className="h-4 bg-gray-50 w-full mt-1"></div>
            <div className="h-4 bg-gray-100 w-full mt-1"></div>
          </div>
          <div className="flex justify-end mt-2">
            <div className="w-1/3 space-y-1 text-right flex flex-col items-end">
              <div className="h-3 bg-indigo-600 rounded w-full"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "modern",
      name: "Modern Gradient",
      description: "A bold, modern design with a splash of color.",
      color: "from-indigo-600 to-purple-600",
      previewBg: "bg-slate-50",
      previewElements: (
        <div className="space-y-3 h-full overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm relative">
          <div className="h-12 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center px-4 justify-between">
            <div className="h-4 bg-white/30 rounded w-1/3"></div>
            <div className="h-4 bg-white/50 rounded w-1/4"></div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between">
              <div className="w-1/2 space-y-2">
                <div className="h-2 bg-indigo-100 rounded w-1/3"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
              <div className="w-1/3 space-y-2 flex flex-col items-end">
                <div className="h-2 bg-indigo-100 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between">
                <div className="h-2 bg-indigo-200 rounded w-1/2"></div>
                <div className="h-2 bg-indigo-200 rounded w-1/4"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-2 bg-indigo-200 rounded w-1/3"></div>
                <div className="h-2 bg-indigo-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-indigo-50 pt-2">
              <div className="h-2 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-indigo-600 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "minimal",
      name: "Ultra Minimal",
      description: "Stripped back to the essentials. Elegant and clean.",
      color: "from-emerald-600 to-teal-600",
      previewBg: "bg-gray-100",
      previewElements: (
        <div className="p-5 h-full bg-[#f9fafb] border border-gray-200 space-y-5">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-900 rounded-sm w-1/3"></div>
            <div className="h-2 bg-gray-400 rounded-sm w-1/4"></div>
          </div>
          <div className="space-y-1 pt-4">
            <div className="h-1.5 bg-gray-300 rounded-sm w-1/4"></div>
            <div className="h-3 bg-gray-800 rounded-sm w-1/2"></div>
            <div className="h-2 bg-gray-400 rounded-sm w-1/3"></div>
          </div>
          <div className="border-t-2 border-black pt-4 space-y-2">
            <div className="flex justify-between">
              <div className="h-2 bg-gray-800 rounded-sm w-1/2"></div>
              <div className="h-2 bg-gray-800 rounded-sm w-1/4"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-2 bg-gray-400 rounded-sm w-1/3"></div>
              <div className="h-2 bg-gray-400 rounded-sm w-1/4"></div>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <div className="h-4 bg-black rounded-sm w-1/3"></div>
          </div>
        </div>
      )
    }
  ];

  const handleSelectTemplate = (templateId) => {
    // Navigate to Magic Create, passing the selected template ID
    navigate("/dashboard/magic-create", { state: { selectedTemplate: templateId } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
          <Layout className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Choose a Template</h1>
          <p className="text-gray-500 mt-1">Select a design to start generating your invoice</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Template Preview Area */}
            <div className={`h-64 ${template.previewBg} p-4 flex items-center justify-center relative overflow-hidden`}>
              {/* Background accent */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${template.color}`}></div>
              
              <div className="w-full max-w-[280px] h-full shadow-lg transform group-hover:scale-105 transition-transform duration-500 ease-out">
                {template.previewElements}
              </div>
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <button 
                  onClick={() => handleSelectTemplate(template.id)}
                  className={`bg-gradient-to-r ${template.color} text-white px-6 py-3 rounded-full font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:scale-105`}
                >
                  <Sparkles size={18} />
                  Use with AI
                </button>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-5 border-t border-gray-100 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{template.name}</h3>
              <p className="text-sm text-gray-500 mb-4 flex-1">{template.description}</p>
              
              <button 
                onClick={() => handleSelectTemplate(template.id)}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:border-indigo-600 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
              >
                Select Template
                <Check size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
