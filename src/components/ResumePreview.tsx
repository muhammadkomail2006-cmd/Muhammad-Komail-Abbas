import { RefObject } from "react";
import { 
  Mail, Phone, MapPin, Globe, Linkedin, Github, 
  Briefcase, GraduationCap, Award, FolderGit2 
} from "lucide-react";
import { ResumeData, TemplateSettings } from "../types";

interface ResumePreviewProps {
  data: ResumeData;
  settings: TemplateSettings;
  previewRef: RefObject<HTMLDivElement | null>;
}

export default function ResumePreview({ data, settings, previewRef }: ResumePreviewProps) {
  const { personalInfo, summary, workExperience, education, skills, projects, certifications } = data;
  const { templateId, accentColor, fontFamily, spacing, showAvatar } = settings;

  // Spacing Class Maps
  const marginSpacing = {
    compact: "space-y-3",
    normal: "space-y-5",
    relaxed: "space-y-7",
  }[spacing];

  const sectionSpacing = {
    compact: "mb-3",
    normal: "mb-5",
    relaxed: "mb-7",
  }[spacing];

  const itemSpacing = {
    compact: "space-y-1",
    normal: "space-y-2",
    relaxed: "space-y-3",
  }[spacing];

  const paddingClass = {
    compact: "p-6 sm:p-8",
    normal: "p-8 sm:p-12",
    relaxed: "p-10 sm:p-16",
  }[spacing];

  // Colors Class Maps
  const colors = {
    indigo: {
      text: "text-indigo-600",
      accent: "bg-indigo-600",
      pill: "bg-indigo-50 border-indigo-100 text-indigo-700",
      border: "border-indigo-600",
      lightText: "text-indigo-500",
      banner: "bg-indigo-900 text-white",
    },
    emerald: {
      text: "text-emerald-600",
      accent: "bg-emerald-600",
      pill: "bg-emerald-50 border-emerald-100 text-emerald-700",
      border: "border-emerald-600",
      lightText: "text-emerald-500",
      banner: "bg-emerald-900 text-white",
    },
    slate: {
      text: "text-slate-800",
      accent: "bg-slate-800",
      pill: "bg-slate-100 border-slate-200 text-slate-800",
      border: "border-slate-800",
      lightText: "text-slate-500",
      banner: "bg-slate-800 text-white",
    },
    amber: {
      text: "text-amber-700",
      accent: "bg-amber-600",
      pill: "bg-amber-50 border-amber-100 text-amber-800",
      border: "border-amber-600",
      lightText: "text-amber-500",
      banner: "bg-amber-900 text-white",
    },
    rose: {
      text: "text-rose-600",
      accent: "bg-rose-600",
      pill: "bg-rose-50 border-rose-100 text-rose-700",
      border: "border-rose-600",
      lightText: "text-rose-500",
      banner: "bg-rose-900 text-white",
    },
    violet: {
      text: "text-violet-600",
      accent: "bg-violet-600",
      pill: "bg-violet-50 border-violet-100 text-violet-700",
      border: "border-violet-600",
      lightText: "text-violet-500",
      banner: "bg-violet-900 text-white",
    },
    sky: {
      text: "text-sky-600",
      accent: "bg-sky-600",
      pill: "bg-sky-50 border-sky-100 text-sky-700",
      border: "border-sky-600",
      lightText: "text-sky-500",
      banner: "bg-sky-900 text-white",
    },
  }[accentColor];

  // Font Matcher
  const fontClass = {
    "font-sans": "font-sans",
    "font-serif": "font-serif",
    "font-mono": "font-mono text-sm",
  }[fontFamily];

  // Helper to format dates cleanly
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const parts = dateStr.split("-");
      if (parts.length >= 2) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      }
    } catch (e) {
      /* ignore */
    }
    return dateStr;
  };

  // -------------------------------------------------------------
  // TEMPLATE 1: CLASSIC PROFESSIONAL (Traditional, Splitless, Clean divider grids)
  // -------------------------------------------------------------
  const renderClassic = () => (
    <div id="classic-template" className={`w-full h-full bg-white leading-relaxed ${marginSpacing}`}>
      {/* Header Info */}
      <div className="border-b pb-5 border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-1">
              {personalInfo.name || "Add Your Name"}
            </h1>
            <p className={`text-lg font-medium tracking-wide ${colors.text}`}>
              {personalInfo.title || "Target Job Role"}
            </p>
          </div>
          {showAvatar && personalInfo.avatar && (
            <img 
              src={personalInfo.avatar} 
              alt={personalInfo.name} 
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-sm border border-gray-100"
            />
          )}
        </div>

        {/* Contacts Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 mt-4 text-xs text-gray-600">
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`} id="contact-email" className="flex items-center gap-1.5 hover:underline">
              <Mail className="w-3.5 h-3.5 text-gray-400" /> {personalInfo.email}
            </a>
          )}
          {personalInfo.phone && (
            <span id="contact-phone" className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span id="contact-location" className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:underline text-gray-500">
              <Globe className="w-3.5 h-3.5 text-gray-400" /> {personalInfo.website.replace(/^https?:\/\//, "")}
            </a>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-gray-400" /> {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-gray-400" /> {personalInfo.github}
            </span>
          )}
        </div>
      </div>

      {/* Summary Section */}
      {summary && (
        <div id="section-summary" className={sectionSpacing}>
          <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience Section */}
      {workExperience.length > 0 && (
        <div id="section-experience" className={sectionSpacing}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b pb-1.5 mb-3">
            Professional Experience
          </h2>
          <div className={itemSpacing}>
            {workExperience.map((exp) => (
              <div key={exp.id} className="group">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                  <div>
                    <span className="font-bold text-gray-900 text-base">{exp.role}</span>
                    <span className="hidden sm:inline text-gray-300 mx-2">|</span>
                    <span className="font-semibold text-gray-700 text-sm block sm:inline">{exp.company}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">
                    <span>{formatDate(exp.startDate)}</span>
                    <span className="mx-1">–</span>
                    <span>{exp.current ? "Present" : formatDate(exp.endDate)}</span>
                    {exp.location && <span className="ml-2 font-medium">({exp.location})</span>}
                  </div>
                </div>
                <div className="text-xs text-gray-700 whitespace-pre-line mt-1 font-normal leading-relaxed">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Matrix */}
      {skills.length > 0 && (
        <div id="section-skills" className={sectionSpacing}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b pb-1.5 mb-3">
            Core Competencies & Skills
          </h2>
          <div className="space-y-2">
            {skills.map((skillGroup) => (
              <div key={skillGroup.id} className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-sm">
                <span className="font-semibold text-gray-800 w-full sm:w-40 shrink-0 text-xs uppercase tracking-wider">{skillGroup.category}</span>
                <div className="flex flex-wrap gap-1.5">
                  {skillGroup.items.map((item, idx) => (
                    <span key={idx} className={`px-2 py-0.5 text-xs rounded border ${colors.pill}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Education & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education column */}
        {education.length > 0 && (
          <div id="section-education" className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b pb-1.5">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-gray-900 text-sm">{edu.degree}</div>
                  <div className="text-xs text-gray-600 font-medium">{edu.school}</div>
                  <div className="text-[10px] text-gray-400">
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate)} {edu.location && `| ${edu.location}`}
                  </div>
                  {edu.description && (
                    <p className="text-xs text-gray-500 mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects column */}
        {projects.length > 0 && (
          <div id="section-projects" className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b pb-1.5">
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-gray-900 text-sm">{proj.name}</span>
                    {proj.link && (
                      <span className="text-[10px] text-gray-400 hover:underline cursor-pointer">{proj.link}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{proj.description}</p>
                  {proj.technologies && (
                    <p className={`text-[10px] uppercase font-mono tracking-wider mt-1 ${colors.text}`}>
                      {proj.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Certifications Row */}
      {certifications.length > 0 && (
        <div id="section-certifications" className={`${sectionSpacing} mt-4`}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b pb-1.5 mb-3">
            Certifications & Licenses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-start gap-1.5">
                <Award className={`w-4 h-4 mt-0.5 ${colors.text} shrink-0`} />
                <div>
                  <div className="font-semibold text-gray-800 text-xs">{cert.name}</div>
                  <div className="text-[10px] text-gray-500">{cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------
  // TEMPLATE 2: MODERN SLATE (Asymmetric Left and Right Columns)
  // -------------------------------------------------------------
  const renderModern = () => (
    <div id="modern-template" className="w-full h-full bg-white flex flex-col sm:flex-row gap-6">
      {/* Left Sidebar Info Card */}
      <div className="w-full sm:w-1/3 shrink-0 rounded-lg bg-gray-50 p-5 flex flex-col space-y-5">
        <div className="text-center sm:text-left">
          {showAvatar && personalInfo.avatar && (
            <img 
              src={personalInfo.avatar} 
              alt={personalInfo.name} 
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover shadow-sm mx-auto sm:mx-0 border-2 border-white ring-2 ring-gray-100 mb-3"
            />
          )}
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            {personalInfo.name || "Full Name"}
          </h1>
          <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${colors.text}`}>
            {personalInfo.title || "Wanted Job Title"}
          </p>
        </div>

        {/* Left Contact Details Panel */}
        <div className="space-y-3 pt-3 border-t border-gray-200/60 text-xs">
          <div className="font-bold text-gray-900 tracking-wider uppercase text-[10px]">Contact Info</div>
          {personalInfo.email && (
            <div className="flex items-center gap-2 text-gray-600 truncate">
              <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <a href={`mailto:${personalInfo.email}`} className="hover:underline truncate">{personalInfo.email}</a>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2 text-gray-600 truncate">
              <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{personalInfo.website}</a>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2 text-gray-600 truncate">
              <Linkedin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2 text-gray-600 truncate">
              <Github className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{personalInfo.github}</span>
            </div>
          )}
        </div>

        {/* Left Sidebar Skills List */}
        {skills.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-gray-200/60">
            <div className="font-bold text-gray-900 tracking-wider uppercase text-[10px]">Skills Matrix</div>
            <div className="space-y-3">
              {skills.map((skillGroup) => (
                <div key={skillGroup.id}>
                  <div className="font-semibold text-gray-700 text-xs mb-1.5">{skillGroup.category}</div>
                  <div className="flex flex-wrap gap-1">
                    {skillGroup.items.map((item, idx) => (
                      <span key={idx} className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${colors.pill}`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column Body */}
      <div className={`flex-1 ${marginSpacing}`}>
        {/* Summary Card */}
        {summary && (
          <div className="border-l-2 pl-4 border-gray-200 py-0.5 text-sm text-gray-700 leading-relaxed">
            {summary}
          </div>
        )}

        {/* Experience Section */}
        {workExperience.length > 0 && (
          <div className={sectionSpacing}>
            <div className="flex items-center gap-1.5 border-b pb-1.5 mb-3">
              <Briefcase className={`w-4 h-4 ${colors.text}`} />
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900">Experience History</h2>
            </div>
            <div className={itemSpacing}>
              {workExperience.map((exp) => (
                <div key={exp.id} className="relative pl-3 border-l border-gray-100">
                  <div className="absolute w-2 h-2 rounded-full border border-white -left-[4.5px] top-1.5 group-hover:bg-slate-400 bg-gray-300 shadow-md"></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                    <div>
                      <span className="font-black text-gray-900 text-sm">{exp.role}</span>
                      <span className={`text-xs ml-1.5 px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold`}>
                        {exp.company}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">
                      {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 whitespace-pre-line leading-relaxed pl-1.5">
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <div className={sectionSpacing}>
            <div className="flex items-center gap-1.5 border-b pb-1.5 mb-3">
              <GraduationCap className={`w-4 h-4 ${colors.text}`} />
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900">Education</h2>
            </div>
            <div className="space-y-3 container">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>{edu.degree}</span>
                    <span className="text-[10px] text-gray-400">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                  </div>
                  <div className="text-gray-500 font-medium">{edu.school} {edu.location && `(${edu.location})`}</div>
                  {edu.description && <p className="text-gray-600 mt-1 pl-1 border-l border-gray-100">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div className={sectionSpacing}>
            <div className="flex items-center gap-1.5 border-b pb-1.5 mb-3">
              <FolderGit2 className={`w-4 h-4 ${colors.text}`} />
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900">Featured Projects</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs rounded bg-gray-50/50 p-2.5 hover:bg-gray-50 transition border border-gray-100">
                  <div className="flex justify-between items-baseline font-bold text-gray-900">
                    <span>{proj.name}</span>
                    {proj.link && (
                      <span className="text-[10px] text-gray-400 font-normal hover:underline">{proj.link}</span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1 leading-relaxed">{proj.description}</p>
                  {proj.technologies && (
                    <div className="flex flex-wrap mt-2 gap-1">
                      {proj.technologies.split(",").map((tech, i) => (
                        <span key={i} className="px-1 text-[9px] font-mono rounded bg-white text-gray-500 border border-gray-100 shadow-sm">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Row */}
        {certifications.length > 0 && (
          <div className={sectionSpacing}>
            <div className="flex items-center gap-1.5 border-b pb-1.5 mb-3">
              <Award className={`w-4 h-4 ${colors.text}`} />
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900">Certifications</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-2 border border-gray-100 rounded">
                  <div className="font-bold text-gray-800">{cert.name}</div>
                  <div className="text-[10px] text-gray-500">{cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // TEMPLATE 3: MINIMALIST EDITORIAL (Serif, Negative-space focused, Refined details)
  // -------------------------------------------------------------
  const renderEditorial = () => (
    <div id="editorial-template" className={`w-full h-full bg-white font-serif tracking-normal ${marginSpacing}`}>
      {/* Title block */}
      <h1 className="text-4xl text-center font-serif italic text-gray-900 mb-1 leading-normal font-normal">
        {personalInfo.name || "Enter Full Name"}
      </h1>
      <p className="text-xs uppercase font-sans tracking-[0.2em] text-center text-gray-500 mb-4 h-5 font-bold">
        {personalInfo.title || "Selected Professional Field"}
      </p>

      {/* Compact Horizontal Contact Row */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[11px] font-sans border-t border-b border-gray-100 py-2.5 text-gray-500">
        {personalInfo.email && <span className="hover:underline">{personalInfo.email}</span>}
        {personalInfo.phone && <span>{personalInfo.phone}</span>}
        {personalInfo.location && <span>{personalInfo.location}</span>}
        {personalInfo.website && <span className="hover:underline text-gray-400">{personalInfo.website.replace(/^https?:\/\//, "")}</span>}
        {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
      </div>

      {/* Summary Row */}
      {summary && (
        <div className={`italic text-sm text-center font-serif text-gray-600 max-w-2xl mx-auto my-3 px-4 ${sectionSpacing}`}>
          “{summary}”
        </div>
      )}

      {/* Experience Segment */}
      {workExperience.length > 0 && (
        <div className={sectionSpacing}>
          <div className="text-center font-sans uppercase tracking-[0.14em] text-[10px] font-bold text-gray-400 my-4 border-b pb-1">
            Professional Chronicle
          </div>
          <div className={itemSpacing}>
            {workExperience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-sans text-xs">
                  <div className="font-bold text-gray-900 text-sm">
                    {exp.role} <span className="font-serif italic font-normal text-gray-500 mx-1">at</span> {exp.company}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.location && <div className="text-[10px] font-mono text-gray-400 italic font-normal">{exp.location}</div>}
                <p className="text-xs text-gray-700 font-serif leading-relaxed pt-1 pl-4 border-l border-gray-100 whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Education & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Editorial Skills list */}
        {skills.length > 0 && (
          <div>
            <div className="font-sans uppercase tracking-[0.14em] text-[10px] font-bold text-gray-400 mb-3 border-b pb-1">
              Skills Checklist
            </div>
            <div className="space-y-2">
              {skills.map((sg) => (
                <div key={sg.id} className="text-xs font-serif leading-relaxed">
                  <div className="font-sans font-bold text-gray-800 text-[10px] uppercase tracking-wider mb-0.5">{sg.category}</div>
                  <span className="text-gray-600 leading-normal">
                    {sg.items.join(" • ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editorial Education info */}
        {education.length > 0 && (
          <div>
            <div className="font-sans uppercase tracking-[0.14em] text-[10px] font-bold text-gray-400 mb-3 border-b pb-1">
              Education Registry
            </div>
            <div className="space-y-3 font-serif">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs leading-relaxed">
                  <div className="font-bold text-gray-800 text-sm">{edu.degree}</div>
                  <div className="text-gray-500 italic font-normal">{edu.school} {edu.location && `• ${edu.location}`}</div>
                  <div className="text-[10px] font-sans text-gray-400">
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                  </div>
                  {edu.description && <p className="text-gray-600 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Editorial Tech Projects List */}
      {projects.length > 0 && (
        <div className={`${sectionSpacing} mt-4`}>
          <div className="font-sans uppercase tracking-[0.14em] text-[10px] font-bold text-gray-400 mb-3 border-b pb-1">
            Projects Portfolio
          </div>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs font-serif">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-950 font-sans">{proj.name}</span>
                  {proj.link && <span className="text-[10px] text-gray-400 font-mono hover:underline">{proj.link}</span>}
                </div>
                <p className="text-gray-600 mt-0.5 leading-relaxed">{proj.description}</p>
                {proj.technologies && (
                  <p className="text-[9px] text-gray-400 font-sans italic tracking-wider mt-0.5">
                    Stack: {proj.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editorial Credentials List */}
      {certifications.length > 0 && (
        <div className={`${sectionSpacing} mt-4`}>
          <div className="font-sans uppercase tracking-[0.14em] text-[10px] font-bold text-gray-400 mb-3 border-b pb-1">
            Certifications & Affiliations
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-serif text-gray-600 leading-normal">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex flex-col">
                <span className="font-bold text-gray-800 font-sans text-[11px]">{cert.name}</span>
                <span className="text-[10px] text-gray-400 italic">
                  Issued by {cert.issuer} {cert.date && `• ${formatDate(cert.date)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------
  // TEMPLATE 4: TECH MONOSPACE (Retro Bracket Grid / Sleek Tech Feel)
  // -------------------------------------------------------------
  const renderTechnical = () => (
    <div id="technical-template" className={`w-full h-full bg-white font-mono text-xs leading-normal ${marginSpacing}`}>
      {/* Top Console Box */}
      <div className="p-4 bg-gray-50/80 rounded border border-gray-100 flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div>
          <div className={`text-xs select-none tracking-widest font-semibold uppercase mb-1 ${colors.text}`}>
            // DEVELOPER_CARD_v1.0
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-0.5">
            {personalInfo.name || "INSERT_NAME"}
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            {personalInfo.title?.toUpperCase() || "INSERT_TITLE"}
          </p>
        </div>
        {showAvatar && personalInfo.avatar && (
          <img 
            src={personalInfo.avatar} 
            alt={personalInfo.name} 
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded object-cover shadow-sm grayscale border border-gray-200 shrink-0"
          />
        )}
      </div>

      {/* Contact variables list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 px-1 text-[10px] border-b pb-3 border-gray-100">
        <div><span className="text-gray-400">EMAIL:</span> {personalInfo.email || "N/A"}</div>
        <div><span className="text-gray-400">PHONE:</span> {personalInfo.phone || "N/A"}</div>
        <div><span className="text-gray-400">LOC:</span> {personalInfo.location || "N/A"}</div>
        {personalInfo.website && (
          <div><span className="text-gray-400">WEB:</span> <span className="hover:underline cursor-pointer text-gray-500">{personalInfo.website.replace(/^https?:\/\//, "")}</span></div>
        )}
        {personalInfo.github && (
          <div><span className="text-gray-400">GIT:</span> {personalInfo.github}</div>
        )}
        {personalInfo.linkedin && (
          <div><span className="text-gray-400">LNK:</span> {personalInfo.linkedin}</div>
        )}
      </div>

      {/* Code-like Executive Summary */}
      {summary && (
        <div className={`bg-slate-50/50 p-2.5 rounded border border-gray-100/60 leading-relaxed text-[11px] ${sectionSpacing}`}>
          <span className={`font-bold ${colors.text}`}>summary_desc_t</span> {"{"}
          <p className="text-gray-700 pl-4 py-1.5">{summary}</p>
          {"}"}
        </div>
      )}

      {/* Experience block as functions */}
      {workExperience.length > 0 && (
        <div className={sectionSpacing}>
          <div className={`font-bold border-b pb-1 mb-3 text-gray-800 ${colors.text}`}>
            ## 01_EMPLOYMENT_REGISTRY()
          </div>
          <div className={itemSpacing}>
            {workExperience.map((exp) => (
              <div key={exp.id} className="relative pl-3 border-l border-gray-100">
                <div className="flex justify-between items-baseline mb-1 flex-wrap">
                  <div className="font-bold text-gray-900 text-xs">
                    [{exp.company.toUpperCase()}] :: {exp.role.toUpperCase()}
                  </div>
                  <div className="text-[10px] text-gray-400 tracking-wider">
                    {formatDate(exp.startDate)} {"=>"} {exp.current ? "present" : formatDate(exp.endDate)}
                  </div>
                </div>
                <div className="text-[10px] text-gray-600 pl-2 whitespace-pre-line leading-relaxed border-l-2 border-gray-100">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Matrix layout */}
      {skills.length > 0 && (
        <div className={sectionSpacing}>
          <div className={`font-bold border-b pb-1 mb-2 text-gray-800 ${colors.text}`}>
            ## 02_SKILLS_EXPORT()
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-1.5">
            {skills.map((skillg) => (
              <div key={skillg.id} className="p-2 bg-gray-50/40 rounded border border-gray-100/80">
                <div className="font-bold text-gray-700 text-[10px] mb-1 uppercase">_ {skillg.category}</div>
                <div className="text-[10px] text-gray-500 leading-normal">
                  {skillg.items.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech education & certifications grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {education.length > 0 && (
          <div>
            <div className={`font-bold border-b pb-1 mb-2 text-gray-800 ${colors.text}`}>
              ## 03_ACADEMIC_LOGS()
            </div>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="text-[11px] leading-relaxed">
                  <span className="font-bold text-gray-800">{edu.degree}</span>
                  <div className="text-gray-500 italic block">{edu.school} {edu.location && `[${edu.location}]`}</div>
                  <div className="text-[9px] text-gray-400">
                    DATES: {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                  {edu.description && <p className="text-gray-500 pl-2 border-l border-gray-100 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <div className={`font-bold border-b pb-1 mb-2 text-gray-800 ${colors.text}`}>
              ## 04_PROJECTS_PROFILES()
            </div>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="text-[11px]">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>&gt; {proj.name}</span>
                    {proj.link && <span className="text-[9px] text-gray-400">{proj.link}</span>}
                  </div>
                  <p className="text-gray-500 mt-0.5">{proj.description}</p>
                  {proj.technologies && (
                    <span className={`text-[8px] font-mono block mt-1 ${colors.text}`}>
                      STACK_TAGS: [{proj.technologies}]
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tech Credentials */}
      {certifications.length > 0 && (
        <div className={`mt-4 ${sectionSpacing}`}>
          <div className={`font-bold border-b pb-1 mb-2 text-gray-800 ${colors.text}`}>
            ## 05_ACC_CREDENTIALS()
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
            {certifications.map((cert) => (
              <div key={cert.id} className="p-1.5 border border-gray-100 rounded">
                <span className="font-bold text-gray-800"># {cert.name}</span>
                <p className="text-gray-400 italic font-normal text-[9px]">{cert.issuer} ({formatDate(cert.date)})</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Selector functions based on selected TemplateId
  const loadTemplate = () => {
    switch (templateId) {
      case "classic":
        return renderClassic();
      case "modern":
        return renderModern();
      case "editorial":
        return renderEditorial();
      case "technical":
        return renderTechnical();
      default:
        return renderClassic();
    }
  };

  return (
    <div id="resume-container-outer" className="w-full bg-slate-200/50 flex justify-center py-6 sm:py-10 px-2 sm:px-6 overflow-auto">
      {/* 
        This is a responsive interactive wrapper layout card.
        The wrapper is styled to standard A4 sheet aspect specifications 
        on high definition viewports, but responds organically to narrower screens.
       */}
      <div 
        ref={previewRef}
        id="resume-a4-surface"
        className={`w-full max-w-[820px] bg-white text-gray-950 font-sans shadow-xl shadow-slate-300/60 rounded-sm border border-slate-200/40 relative antialiased leading-relaxed ${fontClass} ${paddingClass}`}
        style={{ minHeight: "297mm", boxSizing: "border-box" }}
      >
        {loadTemplate()}
      </div>
    </div>
  );
}
