"use client";

import { useState, useRef } from "react";

interface ResumeUploaderProps {
  onUploadSuccess: (filename: string, textContent: string) => void;
  onNext: () => void;
}

export default function ResumeUploader({
  onUploadSuccess,
  onNext,
}: ResumeUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const startSimulatedUpload = (fileObj: File) => {
    setFile({
      name: fileObj.name,
      size: formatFileSize(fileObj.size),
    });
    setIsUploading(true);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        setIsUploading(false);
        // Pass mock text content to simulation service
        onUploadSuccess(
          fileObj.name,
          `Mock uploaded content for ${fileObj.name}. Senior product designer with Docker, AWS, GraphQL and CI/CD skills.`
        );
      } else {
        setUploadProgress(progress);
      }
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const ext = droppedFile.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf" || ext === "docx") {
        startSimulatedUpload(droppedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      startSimulatedUpload(selectedFile);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-['Geist'] text-lg font-bold text-white mb-1">
          Upload Resume File
        </h3>
        <p className="text-xs text-[#bfc7d4] opacity-75">
          Upload a PDF or DOCX version of your resume to compare against job descriptions.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleChange}
        className="hidden"
      />

      {!file && !isUploading ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-[#2294f4] bg-[#2294f4]/5"
              : "border-[#ffffff14] bg-[#191c1e]/50 hover:bg-[#191c1e] hover:border-[#ffffff20]"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-[#2294f4]/10 flex items-center justify-center text-[#2294f4]">
            <span className="material-symbols-outlined text-[28px]">upload_file</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white font-['Geist']">
              Drag & Drop your resume here
            </p>
            <p className="text-xs text-[#bfc7d4]/60 mt-1 font-['Inter']">
              Supports PDF, DOCX up to 5MB
            </p>
          </div>
          <button
            type="button"
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-['Geist'] font-bold text-xs py-2 px-4 rounded-lg active:scale-95 transition-all cursor-pointer"
          >
            Browse Files
          </button>
        </div>
      ) : (
        <div className="bg-[#191c1e] border border-[#ffffff14] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#2294f4] bg-[#2294f4]/10 p-3 rounded-lg text-[24px]">
                description
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-white font-['Geist'] line-clamp-1 max-w-[280px]">
                  {file?.name}
                </p>
                <p className="text-[11px] text-[#bfc7d4]/60 mt-0.5">{file?.size}</p>
              </div>
            </div>

            {!isUploading && (
              <button
                onClick={resetUpload}
                className="text-[#ef4444] hover:bg-[#ef4444]/15 p-1.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            )}
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#bfc7d4] font-['Geist'] font-medium">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[#111415] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#2294f4] h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {!isUploading && uploadProgress === 100 && (
            <div className="flex items-center gap-1.5 text-xs text-[#10b981] font-bold font-['Geist']">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Upload Complete</span>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end pt-4 border-t border-[#ffffff0a]">
        <button
          onClick={onNext}
          disabled={isUploading || uploadProgress < 100}
          className="bg-[#2294f4] text-[#002b4e] hover:opacity-90 active:scale-95 px-6 py-2.5 rounded-lg text-xs font-bold font-['Geist'] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Continue</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
