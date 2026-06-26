"use client";

import { useEffect, useState } from "react";

interface AnalysisLoaderProps {
  onComplete: () => void;
}

const STEPS = [
  "Analyzing Resume...",
  "Checking ATS Compatibility...",
  "Scanning Keywords...",
  "Comparing Skills...",
  "Evaluating Experience...",
  "Calculating Score...",
];

export default function AnalysisLoader({ onComplete }: AnalysisLoaderProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Progress increment timer
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500); // Trigger complete callback slightly after reaching 100%
          return 100;
        }
        return prev + 1;
      });
    }, 40); // Takes ~4 seconds total

    // 2. Step index rotator
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 650);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 bg-[#1d2022] border border-[#ffffff14] rounded-2xl max-w-lg mx-auto relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute w-[200px] h-[200px] bg-[#2294f4]/5 blur-[60px] rounded-full pointer-events-none"></div>

      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Animated outer spinning rings */}
        <div className="absolute inset-0 border-4 border-transparent border-t-[#2294f4] border-b-[#a0caff] rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-2 border-dashed border-[#ffffff0a] rounded-full"></div>

        {/* Circular progress text */}
        <span className="font-['Geist'] text-2xl font-extrabold text-white">
          {progress}%
        </span>
      </div>

      <div className="space-y-1.5 relative z-10">
        <h4 className="font-['Geist'] text-base font-bold text-white tracking-tight transition-all duration-300">
          {STEPS[currentStepIndex]}
        </h4>
        <p className="text-xs text-[#bfc7d4]/60 font-['Inter']">
          Evaluating compatibility against applicant screening models.
        </p>
      </div>

      {/* Progress slider bar */}
      <div className="w-full max-w-xs bg-[#111415] h-1.5 rounded-full overflow-hidden relative z-10">
        <div
          className="bg-gradient-to-r from-[#2294f4] to-[#a0caff] h-full rounded-full transition-all duration-75"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
