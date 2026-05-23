import { useState, DragEvent } from "react";
import { 
  User, Briefcase, GraduationCap, Code2, FolderGit2, 
  Award, Sparkles, Plus, Trash2, ChevronDown, ChevronUp, Check, 
  Upload, Image as ImageIcon, AlertCircle, RefreshCw 
} from "lucide-react";
import { ResumeData, WorkExperience, Education, SkillCategory, Project, Certification } from "../types";

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (updater: (prev: ResumeData) => ResumeData) => void;
}

export default function ResumeEditor({ data, onChange }: ResumeEditorProps) {
  const { personalInfo, summary, workExperience, education, skills, projects, certifications } = data;

  // Track which collapsible sections are open
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    experience: false,
    education: false,
    skills: false,
    projects: false,
    certifications: false
  });

  // Track loading state for each AI assistant call
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // -------------------------------------------------------------
  // HELPER: TRIGGER GEMINI PROCESSORS
  // -------------------------------------------------------------
  const callAIAssistant = async (action: string, text: string, context?: any, onResult?: (res: string) => void) => {
    if (!text || text.trim() === "") {
      setErrorMessage("Please input some draft text first so the AI assistant can polish it.");
      return;
    }
    setErrorMessage(null);
    setAiLoading(prev => ({ ...prev, [action]: true }));

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, text, context })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to contact resume AI assistant.");
      }

      if (onResult && resData.result) {
        onResult(resData.result);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Could not connect to AI services. Verify your API key configuration.");
    } finally {
      setAiLoading(prev => ({ ...prev, [action]: false }));
    }
  };

  // -------------------------------------------------------------
  // PERSONAL DETAILS EDITORS
  // -------------------------------------------------------------
  const handlePersonalChange = (field: keyof typeof personalInfo, value: string) => {
    onChange(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  // Drag and Drop Base64 Avatar Uploader
  const [isDragging, setIsDragging] = useState(false);

  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select or drop an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        handlePersonalChange("avatar", e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // -------------------------------------------------------------
  // PROFESSIONAL SUMMARY EDITORS
  // -------------------------------------------------------------
  const handleSummaryChange = (val: string) => {
    onChange(prev => ({ ...prev, summary: val }));
  };

  const handleAISummaryPolish = () => {
    callAIAssistant("polish-summary", summary, {
      title: personalInfo.title,
      skills: skills.map(s => s.items.join(", ")).join(", ")
    }, (result) => {
      onChange(prev => ({ ...prev, summary: result }));
    });
  };

  // -------------------------------------------------------------
  // WORK EXPERIENCE HANDLERS
  // -------------------------------------------------------------
  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: "work_" + Date.now(),
      role: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    };
    onChange(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, newExp]
    }));
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    onChange(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "current" && value === true) {
            updated.endDate = ""; // reset end date if current
          }
          return updated;
        }
        return item;
      })
    }));
  };

  const removeWorkExperience = (id: string) => {
    onChange(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(item => item.id !== id)
    }));
  };

  const handleAIExperiencePolish = (id: string, currentRole: string, currentCompany: string, text: string) => {
    callAIAssistant("polish-experience", text, {
      title: currentRole,
      company: currentCompany
    }, (result) => {
      updateWorkExperience(id, "description", result);
    });
  };

  // -------------------------------------------------------------
  // EDUCATION HANDLERS
  // -------------------------------------------------------------
  const addEducation = () => {
    const newEdu: Education = {
      id: "edu_" + Date.now(),
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    onChange(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeEducation = (id: string) => {
    onChange(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
  };

  // -------------------------------------------------------------
  // SKILLS MATRIX HANDLERS
  // -------------------------------------------------------------
  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      id: "skill_" + Date.now(),
      category: "Technical Stack",
      items: []
    };
    onChange(prev => ({
      ...prev,
      skills: [...prev.skills, newCat]
    }));
  };

  const updateSkillCategory = (id: string, field: "category", value: string) => {
    onChange(prev => ({
      ...prev,
      skills: prev.skills.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const updateSkillItems = (id: string, rawText: string) => {
    const items = rawText.split(",").map(val => val.trim()).filter(val => val !== "");
    onChange(prev => ({
      ...prev,
      skills: prev.skills.map(item => item.id === id ? { ...item, items } : item)
    }));
  };

  const removeSkillCategory = (id: string) => {
    onChange(prev => ({
      ...prev,
      skills: prev.skills.filter(item => item.id !== id)
    }));
  };

  // AI Skill Suggestions Helper
  const handleAISuggestSkills = (id: string, titleText: string) => {
    if (!titleText) {
      setErrorMessage("Please write a job title or category target to search skill arrays. (e.g., Frontend React Architect)");
      return;
    }
    callAIAssistant("suggest-skills", titleText, {}, (result) => {
      updateSkillItems(id, result);
    });
  };

  // -------------------------------------------------------------
  // PROJECTS HANDLERS
  // -------------------------------------------------------------
  const addProject = () => {
    const newProj: Project = {
      id: "proj_" + Date.now(),
      name: "",
      description: "",
      technologies: "",
      link: ""
    };
    onChange(prev => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    onChange(prev => ({
      ...prev,
      projects: prev.projects.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeProject = (id: string) => {
    onChange(prev => ({
      ...prev,
      projects: prev.projects.filter(item => item.id !== id)
    }));
  };

  // -------------------------------------------------------------
  // CERTIFICATION HANDLERS
  // -------------------------------------------------------------
  const addCertification = () => {
    const newCert: Certification = {
      id: "cert_" + Date.now(),
      name: "",
      issuer: "",
      date: ""
    };
    onChange(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    onChange(prev => ({
      ...prev,
      certifications: prev.certifications.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeCertification = (id: string) => {
    onChange(prev => ({
      ...prev,
      certifications: prev.certifications.filter(item => item.id !== id)
    }));
  };

  return (
    <div className="space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
      
      {/* AI Notification or Error Ribbon Toast */}
      {errorMessage && (
        <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 p-3 rounded text-xs text-rose-700 font-medium shadow-sm animate-fade-in mb-2" id="error-ribbon">
          <AlertCircle className="w-4.5 h-4.5 text-rose-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <span className="font-bold block mb-0.5">Integration Note</span>
            <p>{errorMessage}</p>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-rose-600 font-bold ml-1">×</button>
        </div>
      )}

      {/* -------------------------------------------------------------
          1. SECTION: PERSONAL DETAILS
          ------------------------------------------------------------- */}
      <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm hover:border-slate-200 transition">
        <button 
          onClick={() => toggleSection("personal")}
          className="w-full flex justify-between items-center px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50 transition text-left"
        >
          <span className="flex items-center gap-2 font-bold text-sm text-gray-800">
            <User className="w-4.5 h-4.5 text-slate-500" />
            1. Personal Info & Contact
          </span>
          {openSections.personal ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {openSections.personal && (
          <div className="p-4 space-y-3.5 border-t border-gray-100 animate-slide-down">
            {/* Avatar Uploader box */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-b pb-4 border-gray-50">
              <div className="md:col-span-1 flex flex-col items-center">
                {personalInfo.avatar ? (
                  <div className="relative group">
                    <img 
                      src={personalInfo.avatar} 
                      alt="Avatar Preview" 
                      className="w-16 h-16 rounded-full object-cover border shadow-sm ring-2 ring-indigo-50"
                    />
                    <button 
                      onClick={() => handlePersonalChange("avatar", "")}
                      className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 text-[8px] hover:bg-rose-600 shadow-md"
                      title="Clear image"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-50 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <span className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Profile photo</span>
              </div>

              {/* Drag Drop Area */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`md:col-span-3 border-2 border-dashed rounded p-3 transition text-center text-xs flex flex-col items-center justify-center cursor-pointer ${
                  isDragging ? "border-indigo-500 bg-indigo-50/30 text-indigo-700" : "border-gray-200 hover:border-gray-300 text-gray-500"
                }`}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files && files.length > 0) processImageFile(files[0]);
                  };
                  input.click();
                }}
              >
                <Upload className="w-4 h-4 mb-1 text-gray-400" />
                <p className="font-medium text-[11px]">Drag & Drop Image or <span className="text-indigo-600 underline">Browse</span></p>
                <span className="text-[9px] text-gray-400">Supports PNG, JPG (ratio 1:1)</span>
              </div>
            </div>

            {/* General input arrays */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={personalInfo.name} 
                  onChange={(e) => handlePersonalChange("name", e.target.value)}
                  placeholder="Alex Sterling" 
                  className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Professional Title</label>
                <input 
                  type="text" 
                  value={personalInfo.title} 
                  onChange={(e) => handlePersonalChange("title", e.target.value)}
                  placeholder="Senior Full Stack Engineer" 
                  className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Email ID</label>
                <input 
                  type="email" 
                  value={personalInfo.email} 
                  onChange={(e) => handlePersonalChange("email", e.target.value)}
                  placeholder="alex@example.com" 
                  className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={personalInfo.phone} 
                  onChange={(e) => handlePersonalChange("phone", e.target.value)}
                  placeholder="+1 (555) 019-2834" 
                  className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Location</label>
                <input 
                  type="text" 
                  value={personalInfo.location} 
                  onChange={(e) => handlePersonalChange("location", e.target.value)}
                  placeholder="San Francisco, CA" 
                  className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Website URL</label>
                <input 
                  type="text" 
                  value={personalInfo.website} 
                  onChange={(e) => handlePersonalChange("website", e.target.value)}
                  placeholder="https://sterlingcodes.dev" 
                  className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">LinkedIn Handle</label>
                <input 
                  type="text" 
                  value={personalInfo.linkedin} 
                  onChange={(e) => handlePersonalChange("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/username" 
                  className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">GitHub Profile</label>
                <input 
                  type="text" 
                  value={personalInfo.github} 
                  onChange={(e) => handlePersonalChange("github", e.target.value)}
                  placeholder="github.com/username" 
                  className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          2. SECTION: PROFESSIONAL SUMMARY
          ------------------------------------------------------------- */}
      <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm hover:border-slate-200 transition">
        <button 
          onClick={() => toggleSection("summary")}
          className="w-full flex justify-between items-center px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50 transition text-left"
        >
          <span className="flex items-center gap-2 font-bold text-sm text-gray-800">
            <Sparkles className="w-4.5 h-4.5 text-indigo-500" />
            2. Professional Summary
          </span>
          {openSections.summary ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {openSections.summary && (
          <div className="p-4 space-y-3 border-t border-gray-100">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Summary Text Draft</label>
              
              {/* AI helper button */}
              <button 
                onClick={handleAISummaryPolish}
                disabled={aiLoading["polish-summary"] || !summary.trim()}
                className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[10px] font-bold rounded transition border border-indigo-100 disabled:opacity-50"
              >
                {aiLoading["polish-summary"] ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Polishing with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-100" />
                    AI Optimize & Polish Summary
                  </>
                )}
              </button>
            </div>
            
            <textarea 
              rows={4}
              value={summary}
              onChange={(e) => handleSummaryChange(e.target.value)}
              placeholder="Results-focused Full Stack Developer with 5+ years..." 
              className="w-full text-xs border rounded p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none leading-relaxed"
            />
            <p className="text-[10px] text-gray-400">
              Provide 2-3 sentences outlining your career tenure, key tech skillsets, and signature value. Use the AI helper to rewrite drafts into impact-focused recruiter language.
            </p>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          3. SECTION: WORK HISTORY
          ------------------------------------------------------------- */}
      <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm hover:border-slate-200 transition">
        <button 
          onClick={() => toggleSection("experience")}
          className="w-full flex justify-between items-center px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50 transition text-left"
        >
          <span className="flex items-center gap-2 font-bold text-sm text-gray-800">
            <Briefcase className="w-4.5 h-4.5 text-slate-500" />
            3. Professional Work History ({workExperience.length})
          </span>
          {openSections.experience ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {openSections.experience && (
          <div className="p-4 space-y-4 border-t border-gray-100">
            {workExperience.map((exp, index) => (
              <div key={exp.id} className="p-3 border rounded-md relative bg-gray-50/40 border-gray-100 hover:bg-white transition space-y-3">
                <div className="flex justify-between items-center border-b pb-2 mb-2 border-gray-100">
                  <span className="text-[11px] font-black text-indigo-700 uppercase tracking-widest">
                    Role #{index + 1}
                  </span>
                  <button 
                    onClick={() => removeWorkExperience(exp.id)}
                    className="text-gray-400 hover:text-rose-500 transition p-1"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Role Title</label>
                    <input 
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateWorkExperience(exp.id, "role", e.target.value)}
                      placeholder="e.g. Lead Software Architect"
                      className="w-full text-xs border rounded p-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Company Name</label>
                    <input 
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateWorkExperience(exp.id, "company", e.target.value)}
                      placeholder="e.g. InnovateTech Solutions"
                      className="w-full text-xs border rounded p-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Location</label>
                    <input 
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateWorkExperience(exp.id, "location", e.target.value)}
                      placeholder="e.g. San Francisco (or Remote)"
                      className="w-full text-xs border rounded p-1.5 bg-white"
                    />
                  </div>
                  
                  {/* Date pickers */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Start Date</label>
                      <input 
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateWorkExperience(exp.id, "startDate", e.target.value)}
                        className="w-full text-xs border rounded p-1.5 bg-white"
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-bold uppercase tracking-wider mb-0.5 ${exp.current ? 'text-gray-300' : 'text-gray-500'}`}>End Date</label>
                      <input 
                        type="month"
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={(e) => updateWorkExperience(exp.id, "endDate", e.target.value)}
                        className="w-full text-xs border rounded p-1.5 bg-white disabled:opacity-40"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <input 
                    type="checkbox" 
                    id={`curr_${exp.id}`}
                    checked={exp.current}
                    onChange={(e) => updateWorkExperience(exp.id, "current", e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                  />
                  <label htmlFor={`curr_${exp.id}`} className="text-xs font-semibold text-gray-700 cursor-pointer">
                    I currently work in this role
                  </label>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Responsibilities & Accomplishments
                    </label>
                    <button 
                      onClick={() => handleAIExperiencePolish(exp.id, exp.role, exp.company, exp.description)}
                      disabled={aiLoading[`polish-work-${exp.id}`] || !exp.description.trim()}
                      className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-[10px] font-bold text-indigo-700 rounded transition border border-indigo-100 disabled:opacity-50"
                    >
                      {aiLoading["polish-experience"] ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Format bullets...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                          Transform to AI Bullet Points
                        </>
                      )}
                    </button>
                  </div>
                  <textarea 
                    rows={4}
                    value={exp.description}
                    onChange={(e) => updateWorkExperience(exp.id, "description", e.target.value)}
                    placeholder="We increased customer signup by... Draft bullet points with leading '• ' delimiters."
                    className="w-full text-xs border rounded p-2 bg-white leading-relaxed font-mono"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1">
                    💡 Starting each achievement line with "• " or separate lines. Rely on Gemini AI above to convert messy, raw details into clean impact-driven action-verb bullet points immediately.
                  </span>
                </div>
              </div>
            ))}

            <button 
              onClick={addWorkExperience}
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 text-center rounded border border-dashed border-gray-200 transition flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Work Experience Card
            </button>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          4. SECTION: EDUCATION
          ------------------------------------------------------------- */}
      <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm hover:border-slate-200 transition">
        <button 
          onClick={() => toggleSection("education")}
          className="w-full flex justify-between items-center px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50 transition text-left"
        >
          <span className="flex items-center gap-2 font-bold text-sm text-gray-800">
            <GraduationCap className="w-4.5 h-4.5 text-slate-500" />
            4. Education Chronicle ({education.length})
          </span>
          {openSections.education ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {openSections.education && (
          <div className="p-4 space-y-4 border-t border-gray-100">
            {education.map((edu, idx) => (
              <div key={edu.id} className="p-3 border rounded bg-gray-50/40 relative space-y-3">
                <div className="flex justify-between items-center pb-1 border-b">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Degree #{idx + 1}</span>
                  <button onClick={() => removeEducation(edu.id)} className="text-gray-400 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Degree / Certificate</label>
                    <input 
                      type="text" 
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      placeholder="e.g. B.S. in Computer Science" 
                      className="w-full text-xs border rounded p-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">School / University</label>
                    <input 
                      type="text" 
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                      placeholder="e.g. UC Berkeley" 
                      className="w-full text-xs border rounded p-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Location</label>
                    <input 
                      type="text" 
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                      placeholder="e.g. Berkeley, CA" 
                      className="w-full text-xs border rounded p-1.5 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Start Date</label>
                      <input 
                        type="month" 
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                        className="w-full text-xs border rounded p-1.5 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">End Date</label>
                      <input 
                        type="month" 
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                        className="w-full text-xs border rounded p-1.5 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Additional description (optional)</label>
                  <input 
                    type="text"
                    value={edu.description}
                    onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                    placeholder="e.g. Graduated with Honors. Specialized in Databases."
                    className="w-full text-xs border rounded p-2"
                  />
                </div>
              </div>
            ))}

            <button 
              onClick={addEducation}
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 text-center rounded border border-dashed border-gray-200 transition flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Education Card
            </button>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          5. SECTION: SKILLS MATRIX
          ------------------------------------------------------------- */}
      <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm hover:border-slate-200 transition">
        <button 
          onClick={() => toggleSection("skills")}
          className="w-full flex justify-between items-center px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50 transition text-left"
        >
          <span className="flex items-center gap-2 font-bold text-sm text-gray-800">
            <Code2 className="w-4.5 h-4.5 text-slate-500" />
            5. Core Competencies & Skills ({skills.length})
          </span>
          {openSections.skills ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {openSections.skills && (
          <div className="p-4 space-y-4 border-t border-gray-100">
            {skills.map((skillGroup, idx) => (
              <div key={skillGroup.id} className="p-3 border rounded bg-gray-50/40 relative space-y-3 hover:bg-white transition">
                <div className="flex justify-between items-center border-b pb-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Skill Array #{idx + 1}</span>
                  <button onClick={() => removeSkillCategory(skillGroup.id)} className="text-gray-400 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Category Name</label>
                    <input 
                      type="text"
                      value={skillGroup.category}
                      onChange={(e) => updateSkillCategory(skillGroup.id, "category", e.target.value)}
                      placeholder="e.g. Frontend Development"
                      className="w-full text-xs border rounded p-1.5 bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex justify-between items-center mb-0.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Comma Separated Items</label>
                      <button 
                        onClick={() => handleAISuggestSkills(skillGroup.id, personalInfo.title || skillGroup.category)}
                        disabled={aiLoading[`suggest-${skillGroup.id}`]}
                        className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-[9px] font-bold text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-indigo-500" /> AI Suggestions
                      </button>
                    </div>
                    <input 
                      type="text"
                      value={skillGroup.items.join(", ")}
                      onChange={(e) => updateSkillItems(skillGroup.id, e.target.value)}
                      placeholder="React, TypeScript, Next.js, Redux"
                      className="w-full text-xs border rounded p-1.5 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={addSkillCategory}
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 text-center rounded border border-dashed border-gray-200 transition flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Skill Category Group
            </button>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          6. SECTION: PROJECTS PORTFOLIO
          ------------------------------------------------------------- */}
      <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm hover:border-slate-200 transition">
        <button 
          onClick={() => toggleSection("projects")}
          className="w-full flex justify-between items-center px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50 transition text-left"
        >
          <span className="flex items-center gap-2 font-bold text-sm text-gray-800">
            <FolderGit2 className="w-4.5 h-4.5 text-slate-500" />
            6. Featured Projects ({projects.length})
          </span>
          {openSections.projects ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {openSections.projects && (
          <div className="p-4 space-y-4 border-t border-gray-100">
            {projects.map((proj, idx) => (
              <div key={proj.id} className="p-3 border rounded bg-gray-50/40 relative space-y-3">
                <div className="flex justify-between items-center pb-1 border-b">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Project #{idx + 1}</span>
                  <button onClick={() => removeProject(proj.id)} className="text-gray-400 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Project Name</label>
                    <input 
                      type="text" 
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                      placeholder="e.g. Task Matcher Engine" 
                      className="w-full text-xs border rounded p-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Repository or Live URL</label>
                    <input 
                      type="text" 
                      value={proj.link}
                      onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                      placeholder="e.g. github.com/user/project" 
                      className="w-full text-xs border rounded p-1.5 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Brief Description</label>
                  <input 
                    type="text" 
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                    placeholder="Brief description of the goals, accomplishments, and tech capabilities used." 
                    className="w-full text-xs border rounded p-1.5 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Technologies Used (comma separated)</label>
                  <input 
                    type="text" 
                    value={proj.technologies}
                    onChange={(e) => updateProject(proj.id, "technologies", e.target.value)}
                    placeholder="Go, Node.js, Redis, React" 
                    className="w-full text-xs border rounded p-1.5 bg-white"
                  />
                </div>
              </div>
            ))}

            <button 
              onClick={addProject}
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 text-center rounded border border-dashed border-gray-200 transition flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Project Portfolio Card
            </button>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          7. SECTION: CERTIFICATIONS & CREDENTIALS
          ------------------------------------------------------------- */}
      <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm hover:border-slate-200 transition">
        <button 
          onClick={() => toggleSection("certifications")}
          className="w-full flex justify-between items-center px-4 py-3.5 bg-gray-50/50 hover:bg-gray-50 transition text-left"
        >
          <span className="flex items-center gap-2 font-bold text-sm text-gray-800">
            <Award className="w-4.5 h-4.5 text-slate-500" />
            7. Certifications & Affiliations ({certifications.length})
          </span>
          {openSections.certifications ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {openSections.certifications && (
          <div className="p-4 space-y-4 border-t border-gray-100">
            {certifications.map((cert, idx) => (
              <div key={cert.id} className="p-3 border rounded bg-gray-50/40 relative space-y-3">
                <div className="flex justify-between items-center pb-1 border-b">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Cert #{idx + 1}</span>
                  <button onClick={() => removeCertification(cert.id)} className="text-gray-400 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Credential Name</label>
                    <input 
                      type="text" 
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                      placeholder="e.g. AWS Solutions Architect" 
                      className="w-full text-xs border rounded p-1.5 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Issuing Authority</label>
                    <input 
                      type="text" 
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                      placeholder="Amazon Web Services" 
                      className="w-full text-xs border rounded p-1.5 bg-white"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Issue Date</label>
                    <input 
                      type="month" 
                      value={cert.date}
                      onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                      className="w-full text-xs border rounded p-1.5 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={addCertification}
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 text-center rounded border border-dashed border-gray-200 transition flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Certification Card
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
