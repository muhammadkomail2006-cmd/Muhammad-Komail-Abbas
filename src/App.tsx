import { useState, useEffect, useRef } from "react";
import { 
  FileText, Sparkles, Download, Printer, RotateCcw, 
  Trash2, Sliders, Edit3, CheckCircle2, RefreshCw, Layers
} from "lucide-react";
import ResumeEditor from "./components/ResumeEditor";
import ResumePreview from "./components/ResumePreview";
import TemplateSelector from "./components/TemplateSelector";
import { sampleResumeData } from "./data";
import { ResumeData, TemplateSettings } from "./types";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  // 1. STATE INITIALIZATION (Local Storage Persistent)
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem("cv_maker_resume_data_v1");
      return saved ? JSON.parse(saved) : sampleResumeData;
    } catch {
      return sampleResumeData;
    }
  });

  const [settings, setSettings] = useState<TemplateSettings>(() => {
    try {
      const saved = localStorage.getItem("cv_maker_template_settings_v1");
      return saved ? JSON.parse(saved) : {
        templateId: "classic",
        accentColor: "indigo",
        fontFamily: "font-sans",
        spacing: "normal",
        showAvatar: true
      };
    } catch {
      return {
        templateId: "classic",
        accentColor: "indigo",
        fontFamily: "font-sans",
        spacing: "normal",
        showAvatar: true
      };
    }
  });

  // Editor Sub-tabs Toggle (Content Editing vs Style customization)
  const [activeTab, setActiveTab] = useState<"content" | "design">("content");
  const [isExporting, setIsExporting] = useState(false);
  const [showResetDone, setShowResetDone] = useState(false);

  // Reference node to capture the resume canvas for PDF compilation
  const previewRef = useRef<HTMLDivElement | null>(null);

  // 2. SYNCHRONIZE STATE TO CLIENT-STORAGE ON MUTATIONS
  useEffect(() => {
    localStorage.setItem("cv_maker_resume_data_v1", JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem("cv_maker_template_settings_v1", JSON.stringify(settings));
  }, [settings]);

  // 3. EXPORT RESUME AS MULTI-PAGE RASTER PDF (Using canvas + jsPDF)
  const handleExportPDF = async () => {
    const element = previewRef.current;
    if (!element) return;

    try {
      setIsExporting(true);
      
      // Compute high-resolution canvas with CORS configurations
      const canvas = await html2canvas(element, {
        scale: 2, // 2x device scale for extremely sharp font displays
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      
      // Standard A4 Paper Sheet properties (mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 Width in mm
      const pageHeight = 297; // A4 Height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Draw the computed image asset onto page canvases
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const clientName = resumeData.personalInfo.name || "My_Resume";
      pdf.save(`${clientName.replace(/\s+/g, "_")}_Resume.pdf`);
    } catch (err) {
      console.error("PDF engine exception compiled:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // 4. TRIGGER SYSTEM PRINTING DIALOGUE (Triggers native layout overrides)
  const handlePrintResume = () => {
    window.print();
  };

  // 5. RESTORE PREFILLED SAMPLE/DEMO PORTFOLIO
  const handleResetToSample = () => {
    setResumeData(sampleResumeData);
    setSettings({
      templateId: "classic",
      accentColor: "indigo",
      fontFamily: "font-sans",
      spacing: "normal",
      showAvatar: true
    });
    setShowResetDone(true);
    setTimeout(() => setShowResetDone(false), 3000);
  };

  // 6. PURGE FORM FOR A FRESH START
  const handleClearForm = () => {
    setResumeData({
      personalInfo: {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedin: "",
        github: "",
        avatar: ""
      },
      summary: "",
      workExperience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: []
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-gray-900 pb-12">
      {/* 
        Aesthetic Navigation Header Row 
        (Automatically hidden under printing media triggers via CSS definitions)
      */}
      <header className="no-print bg-slate-900 border-b border-slate-800 text-white shadow-md w-full shrink-0 px-4 sm:px-6 py-4" id="main-navigation-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-600 rounded flex items-center justify-center text-white shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-wide bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">CV MAKER</span>
                <span className="text-[9px] bg-indigo-950 font-extrabold text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-900 tracking-wider uppercase">POLISHER AI</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Build and export standard executive resumes in minutes</p>
            </div>
          </div>

          {/* Core Controls Row: Reset, Clear, Sync info */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <button
              onClick={handleResetToSample}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded font-semibold transition flex items-center gap-1.5"
              title="Restore demo content to test layouts instantly"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Draft
            </button>

            <button
              onClick={handleClearForm}
              className="px-3 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-800 font-semibold transition flex items-center gap-1.5"
              title="Clear entire entry forms for a fresh canvas"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
              Clear Entire Form
            </button>

            {showResetDone && (
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2.5 py-1.5 rounded text-[11px] font-bold animate-fade-in animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" /> Prefilled draft loaded!
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Primary Split View Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-6 pt-6" id="main-content-layout">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* 
            LEFT COLUMN: THE FORM EDITOR PANEL & STYLE SELECTORS
            (Width: 5/12 columns on desktop)
          */}
          <div className="no-print lg:col-span-5 bg-white border border-gray-200 rounded shadow-md overflow-hidden flex flex-col" id="editor-column">
            
            {/* Split Switcher Tabs */}
            <div className="flex bg-gray-50 border-b border-gray-100">
              <button
                onClick={() => setActiveTab("content")}
                className={`flex-1 py-3 text-center text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === "content" 
                    ? "bg-white text-indigo-600 border-b-2 border-indigo-600" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
                id="tab-edit-form"
              >
                <Edit3 className="w-4 h-4" />
                1. Edit Content Draft
              </button>
              <button
                onClick={() => setActiveTab("design")}
                className={`flex-1 py-3 text-center text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === "design" 
                    ? "bg-white text-indigo-600 border-b-2 border-indigo-600" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
                id="tab-edit-design"
              >
                <Sliders className="w-4 h-4" />
                2. Design & Templates
              </button>
            </div>

            {/* Panel Tab Viewports */}
            <div className="p-4" style={{ minHeight: "500px" }}>
              {activeTab === "content" ? (
                <ResumeEditor 
                  data={resumeData} 
                  onChange={setResumeData} 
                />
              ) : (
                <TemplateSelector 
                  settings={settings} 
                  onSelectSettings={setSettings} 
                  resumeData={resumeData}
                  onUpdateResumeData={setResumeData}
                />
              )}
            </div>
          </div>

          {/* 
            RIGHT COLUMN: THE DYNAMIC LIVE RESUME SHEET PREVIEW 
            (Width: 7/12 columns on desktop)
          */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Top Toolbar overlay next to preview page (Hidden under printing) */}
            <div className="no-print bg-white p-3 border border-gray-200 rounded shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3.5" id="control-head">
              <div className="flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-slate-500" />
                <div>
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Interactive PDF Sheet Preview</span>
                  <p className="text-[10px] text-gray-400">Live preview of paper rendering dimensions</p>
                </div>
              </div>

              {/* PDF & Vector Prints trigger buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                  title="Generate high fidelity direct download PDF"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrintResume}
                  className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded shadow-sm transition flex items-center gap-1.5"
                  title="Open system printer dialog (highly recommended for machine-readable A4 PDFs)"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  Print Resume
                </button>
              </div>
            </div>

            {/* Dynamic visual preview element wrapper */}
            <ResumePreview 
              data={resumeData} 
              settings={settings} 
              previewRef={previewRef} 
            />

          </div>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="no-print max-w-7xl mx-auto w-full px-6 pt-12 text-center text-xs text-slate-400 border-t border-slate-200/50 mt-12">
        <p>© {new Date().getFullYear()} CV Maker. Design with Tailwind CSS & Google Gemini AI integration parameters.</p>
        <p className="text-[10px] text-slate-300 mt-1">Exporting standard A4/Letter size structures for instant professional download.</p>
      </footer>
    </div>
  );
}
