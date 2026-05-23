import { useState } from "react";
import { 
  Palette, Sun, Type, Sliders, Sparkles, Check, HelpCircle, 
  Settings2, Eye, EyeOff, Layout, FileText, Compass, HardDrive, RefreshCw
} from "lucide-react";
import { TemplateSettings, TemplateId, AccentColor, FontFamily, SpacingSize, ResumeData } from "../types";

interface TemplateSelectorProps {
  settings: TemplateSettings;
  onSelectSettings: (updater: (prev: TemplateSettings) => TemplateSettings) => void;
  resumeData: ResumeData;
  onUpdateResumeData: (updater: (prev: ResumeData) => ResumeData) => void;
}

export default function TemplateSelector({ 
  settings, 
  onSelectSettings, 
  resumeData, 
  onUpdateResumeData 
}: TemplateSelectorProps) {
  const { templateId, accentColor, fontFamily, spacing, showAvatar } = settings;

  // Local state for full Job Description tailoring
  const [jobDescription, setJobDescription] = useState("");
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailorSuccess, setTailorSuccess] = useState(false);
  const [tailorError, setTailorError] = useState<string | null>(null);

  const setTemplate = (id: TemplateId) => {
    onSelectSettings(prev => ({ ...prev, templateId: id }));
  };

  const setAccent = (color: AccentColor) => {
    onSelectSettings(prev => ({ ...prev, accentColor: color }));
  };

  const setFont = (font: FontFamily) => {
    onSelectSettings(prev => ({ ...prev, fontFamily: font }));
  };

  const setSpacingSize = (space: SpacingSize) => {
    onSelectSettings(prev => ({ ...prev, spacing: space }));
  };

  const toggleAvatar = () => {
    onSelectSettings(prev => ({ ...prev, showAvatar: !prev.showAvatar }));
  };

  // AI Tailoring dispatch function
  const handleAITailorClick = async () => {
    if (!jobDescription || jobDescription.trim() === "") {
      setTailorError("Please paste a target job description in the text box below.");
      return;
    }
    setTailorError(null);
    setIsTailoring(true);
    setTailorSuccess(false);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "tailor-job",
          text: resumeData.summary,
          context: {
            jobDescription: jobDescription
          }
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to tailor candidate details.");
      }

      if (resData.result) {
        onUpdateResumeData(prev => ({
          ...prev,
          summary: resData.result
        }));
        setTailorSuccess(true);
      }
    } catch (err: any) {
      console.error(err);
      setTailorError(err.message || "An error occurred with Gemini matching.");
    } finally {
      setIsTailoring(false);
    }
  };

  // List of available templates
  const templates: { id: TemplateId; label: string; desc: string }[] = [
    { id: "classic", label: "Classic Corporate", desc: "Clean traditional split layout, best for enterprise or conservative fields" },
    { id: "modern", label: "Modern Slate", desc: "Sophisticated dual balanced design featuring rich sidebar highlight panels" },
    { id: "editorial", label: "Minimalist Editorial", desc: "Beautiful literary spacing utilizing spacious margins and italic typography" },
    { id: "technical", label: "Creative Tech-Mono", desc: "Code-like tabular variables, best for developer and software staff portfolios" }
  ];

  // Presets of accent colors
  const accentColors: { id: AccentColor; colorClass: string; label: string }[] = [
    { id: "indigo", colorClass: "bg-indigo-600", label: "Slate Blue" },
    { id: "emerald", colorClass: "bg-emerald-600", label: "Mint Green" },
    { id: "slate", colorClass: "bg-slate-800", label: "Tech Gray" },
    { id: "amber", colorClass: "bg-amber-600", label: "Warm Amber" },
    { id: "rose", colorClass: "bg-rose-600", label: "Crimson Rose" },
    { id: "violet", colorClass: "bg-violet-600", label: "Deep Lilac" },
    { id: "sky", colorClass: "bg-sky-500", label: "Sky Azure" }
  ];

  // Presets of font choices
  const fonts: { id: FontFamily; label: string; desc: string }[] = [
    { id: "font-sans", label: "Inter (Sans-Serif)", desc: "Clean, highly readable text" },
    { id: "font-serif", label: "Playfair (Elegant Serif)", desc: "Sophisticated and literary look" },
    { id: "font-mono", label: "Fira Code (Tech Mono)", desc: "Perfect for software engineers" }
  ];

  // Spacing options
  const spacingOptions: { id: SpacingSize; label: string }[] = [
    { id: "compact", label: "Compact Density" },
    { id: "normal", label: "Standard Density" },
    { id: "relaxed", label: "Relaxed Spacing" }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. TEMPLATE VISUAL CONTROLS */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <Layout className="w-4 h-4 text-gray-500" /> Choose Style Template
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {templates.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => setTemplate(tpl.id)}
              className={`text-left p-3 border rounded-md transition relative bg-white ${
                templateId === tpl.id 
                  ? "border-indigo-600 ring-1 ring-indigo-600/20 bg-indigo-50/10" 
                  : "border-gray-200/70 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-900">{tpl.label}</span>
                {templateId === tpl.id && (
                  <Check className="w-4.5 h-4.5 text-indigo-600" />
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">{tpl.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 2. ACCENT COLORS PRESETS */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-gray-500" /> Theme Accent Colors
        </h3>
        <div className="flex flex-wrap gap-2 pt-1">
          {accentColors.map(color => (
            <button
              key={color.id}
              onClick={() => setAccent(color.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition relative ${color.colorClass} shadow-inner hover:scale-105`}
              title={color.label}
            >
              {accentColor === color.id && (
                <span className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className={`w-2 h-2 rounded-full ${color.colorClass}`}></span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. FONTS TYPEFACE SELECTION */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <Type className="w-4 h-4 text-gray-500" /> Document Typography
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {fonts.map(f => (
            <button
              key={f.id}
              onClick={() => setFont(f.id)}
              className={`text-left px-3 py-2 border rounded-md transition ${
                fontFamily === f.id 
                  ? "border-slate-800 bg-slate-50" 
                  : "border-gray-200/70 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="text-xs font-bold text-gray-800">{f.label}</div>
              <p className="text-[9px] text-gray-400">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 4. MARGINS, SPACING & AVATARS Toggles */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <Settings2 className="w-4 h-4 text-gray-500" /> Layout & Spacing
        </h3>

        {/* Spacing Buttons */}
        <div className="grid grid-cols-3 gap-1.5">
          {spacingOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSpacingSize(opt.id)}
              className={`py-1.5 text-center text-[10px] font-bold border rounded transition ${
                spacing === opt.id 
                  ? "border-indigo-600 bg-indigo-50/20 text-indigo-700" 
                  : "border-gray-200 hover:bg-gray-50 text-gray-600"
              }`}
            >
              {opt.label.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Toggle photo preview */}
        <button
          onClick={toggleAvatar}
          className="w-full flex items-center justify-between border rounded p-2.5 hover:bg-gray-50 transition bg-white text-xs font-semibold text-gray-700 mt-2"
        >
          <span className="flex items-center gap-2">
            {showAvatar ? <Eye className="w-4 h-4 text-indigo-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
            Preview profile photo
          </span>
          <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${showAvatar ? "bg-indigo-50 text-indigo-700" : "bg-gray-100 text-gray-500"}`}>
            {showAvatar ? "ENABLED" : "DISABLED"}
          </span>
        </button>
      </div>

      {/* 5. AI RESUME KEYWORD TAILOR ASSISTANT */}
      <div className="border-t border-gray-100/60 pt-5 space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-100" /> AI Target-Job Tailoring
        </h3>
        
        <div className="bg-slate-50 border border-slate-100 p-3 rounded space-y-2.5">
          <p className="text-[10px] text-gray-600 leading-normal">
            Paste the target job post description here. Gemini AI will automatically align your Professional Summary to stress matching key qualifications and technologies.
          </p>

          <textarea
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste description requirements: (e.g., We are seeking a React developer proficient in TypeScript, Redux systems...)"
            className="w-full text-[10px] border border-gray-200 rounded p-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
          />

          {tailorSuccess && (
            <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-150 p-2 rounded">
              ✓ Professional Summary successfully tailored to target qualifications!
            </div>
          )}

          {tailorError && (
            <div className="text-[10px] text-rose-700 font-bold bg-rose-50 border border-rose-150 p-2 rounded">
              × {tailorError}
            </div>
          )}

          <button
            onClick={handleAITailorClick}
            disabled={isTailoring || !jobDescription.trim()}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold transition flex items-center justify-center gap-1 shadow-sm disabled:opacity-50"
          >
            {isTailoring ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                Rewriting Summary with Gemini...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 fill-indigo-200" />
                Tailor Summary For Job Post
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
