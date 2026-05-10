import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout, Check, Sparkles } from "lucide-react";

export default function Templates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { apiGet } = await import('../api.js');
        const data = await apiGet('/templates');
        setTemplates(data);
      } catch (error) {
        // Fallback or toast error
        console.error("Failed to fetch templates", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleSelectTemplate = (templateId) => {
    localStorage.setItem("selectedTemplateId", templateId);
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

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Template Preview Area */}
              <div className={`h-64 ${template.previewBg || 'bg-slate-50'} p-4 flex items-center justify-center relative overflow-hidden`}>
                {/* Background accent */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${template.color || 'from-indigo-500 to-purple-600'}`}></div>
                
                <div className="w-full max-w-[240px] h-full shadow-lg transform group-hover:scale-105 transition-transform duration-500 ease-out bg-white rounded border border-gray-100 p-2 overflow-hidden">
                   {template.thumbnail ? (
                     <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center gap-2 p-4">
                        <Layout className="w-8 h-8 text-slate-300" />
                        <div className="h-2 w-full bg-slate-200 rounded"></div>
                        <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                        <div className="h-10 w-full bg-slate-200 rounded mt-auto"></div>
                     </div>
                   )}
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <button 
                    onClick={() => handleSelectTemplate(template.id)}
                    className={`bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:scale-105`}
                  >
                    <Sparkles size={18} />
                    Use Template
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
      )}
    </div>
  );
}
