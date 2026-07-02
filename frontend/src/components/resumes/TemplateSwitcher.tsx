"use client";

import { useEffect } from "react";

interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  atsCompatible: boolean;
}

const templates: TemplateInfo[] = [
  {
    id: "modern-ats",
    name: "Modern ATS",
    description: "Highly structured, clean sans-serif layout optimized for Applicant Tracking Systems.",
    image: "/templates/modern-ats.webp",
    atsCompatible: true,
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Sleek sans-serif layout with top color accent bands and left-bordered headers.",
    image: "/templates/corporate.webp",
    atsCompatible: true,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Classic centered layout with elegant serif typography, perfect for executive roles.",
    image: "/templates/executive.webp",
    atsCompatible: true,
  },
  {
    id: "two-column",
    name: "Professional Two Column",
    description: "Asymmetrical grid split layout featuring side-by-side content panels.",
    image: "/templates/two-column.webp",
    atsCompatible: true,
  },
  {
    id: "developer",
    name: "Developer",
    description: "Monospace font with custom command-line styling designed for programmers and tech roles.",
    image: "/templates/developer.webp",
    atsCompatible: false,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Spacious layout with faint divider lines, standard-case headers, and clean margins.",
    image: "/templates/minimal.jpeg",
    atsCompatible: true,
  },
  {
    id: "startup",
    name: "Startup",
    description: "Modern punchy layout featuring tag capsules for skills and custom tech stacks.",
    image: "/templates/startup.webp",
    atsCompatible: true,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Artistic off-white template with Playfair headers, warm backgrounds, and terracota accents.",
    image: "/templates/creative.webp",
    atsCompatible: false,
  },
];

interface TemplateSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export default function TemplateSwitcher({
  isOpen,
  onClose,
  currentTemplate,
  onSelectTemplate,
}: TemplateSwitcherProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Normalize current template
  const activeTemplate = currentTemplate === "professional-classic" || currentTemplate === "professional" ? "executive" 
                       : currentTemplate === "dev-focus" ? "developer" 
                       : currentTemplate === "bronzor" || currentTemplate === "onyx" ? "two-column"
                       : currentTemplate;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Geist']">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-[#0c0f10] border-l border-[#ffffff14] text-[#e1e2e4] shadow-2xl flex flex-col h-full animate-slide-in">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#ffffff14] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Choose a Template</h2>
              <p className="text-xs text-[#bfc7d4] opacity-75 mt-0.5">Switch instantly to preview styles</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/5 text-[#bfc7d4] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Template Cards List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {templates.map((template) => {
              const isActive = activeTemplate === template.id;

              return (
                <div
                  key={template.id}
                  onClick={() => {
                    onSelectTemplate(template.id);
                    onClose();
                  }}
                  className={`group relative flex flex-col bg-[#1d2022]/40 rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                    isActive
                      ? "border-[#a0caff] shadow-[0_0_15px_rgba(160,202,255,0.15)]"
                      : "border-[#ffffff14] hover:border-[#ffffff33]"
                  }`}
                >
                  {/* Image container */}
                  <div className="aspect-[16/10] bg-[#191c1e] relative overflow-hidden border-b border-[#ffffff0a]">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover object-top opacity-85 transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    
                    {/* Badge */}
                    {template.atsCompatible && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#10b981]/20 text-[#10b981] text-[9px] font-bold uppercase tracking-wider rounded border border-[#10b981]/30 backdrop-blur-md">
                        ATS Friendly
                      </span>
                    )}

                    {isActive && (
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-[#a0caff] text-[#003259] text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1 shadow-md border border-[#a0caff]/30">
                        <span className="material-symbols-outlined text-[10px] fill-icon">check</span>
                        Active
                      </span>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-4 bg-[#111415]/40">
                    <h3 className="font-bold text-white group-hover:text-[#a0caff] transition-colors flex items-center justify-between">
                      {template.name}
                      <span className="material-symbols-outlined text-sm text-[#bfc7d4] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                        arrow_forward
                      </span>
                    </h3>
                    <p className="text-xs text-[#bfc7d4] opacity-70 mt-1 leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
