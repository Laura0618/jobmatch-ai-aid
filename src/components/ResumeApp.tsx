import { useState } from "react";
import { HeroSection } from "./HeroSection";
import { ResumeUploader } from "./ResumeUploader";
import { JobDescriptionInput } from "./JobDescriptionInput";
import { ProcessingStep } from "./ProcessingStep";
import { ResultsDisplay } from "./ResultsDisplay";
import { parseTailoredResumeText } from "@/utils/parseTailoredResumeText";
import type { ResumeData } from "@/types/resume";

type AppStep = "hero" | "upload" | "job-description" | "processing" | "results";

interface AppData {
  resumeText: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  tailoredResume?: string;
  structuredResume?: ResumeData;
}

export const ResumeApp = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>("upload");
  const [appData, setAppData] = useState<AppData>({
    resumeText: "",
    jobTitle: "",
    company: "",
    jobDescription: ""
  });

  const handleGetStarted = () => {
    setCurrentStep("upload");
  };

  const handleResumeReady = (resumeText: string) => {
    setAppData(prev => ({ ...prev, resumeText }));
    setCurrentStep("job-description");
  };

  const handleJobDescriptionReady = (jobTitle: string, company: string, jobDescription: string) => {
    setAppData(prev => ({ ...prev, jobTitle, company, jobDescription }));
    setCurrentStep("processing");
  };

  const handleProcessingComplete = (tailoredResume: string) => {
  const structuredResume = parseTailoredResumeText(tailoredResume);
  setAppData(prev => ({ ...prev, tailoredResume, structuredResume }));
  setCurrentStep("results");
};

  const handleBackToUpload = () => {
    setCurrentStep("upload");
  };

  const handleBackToJobDescription = () => {
    setCurrentStep("job-description");
  };

  const handleStartOver = () => {
    setAppData({
      resumeText: "",
      jobTitle: "",
      company: "",
      jobDescription: "",
      tailoredResume: ""
    });
    setCurrentStep("hero");
  };

  const renderStep = () => {
    switch (currentStep) {
      case "hero":
        return <HeroSection onGetStarted={handleGetStarted} />;
      
      case "upload":
        return <ResumeUploader onResumeReady={handleResumeReady} />;
      
      case "job-description":
        return (
          <JobDescriptionInput
            onJobDescriptionReady={handleJobDescriptionReady}
            onBack={handleBackToUpload}
          />
        );
      
      case "processing":
        return (
          <ProcessingStep 
            onComplete={handleProcessingComplete}
            resumeText={appData.resumeText}
            jobTitle={appData.jobTitle}
            company={appData.company}
            jobDescription={appData.jobDescription}
          />
        );
      
      case "results":
        return (
          <ResultsDisplay
            originalResume={appData.resumeText}
            tailoredResume={appData.tailoredResume || ""}
            jobTitle={appData.jobTitle}
            company={appData.company}
            structuredResume={appData.structuredResume}
            onBack={handleBackToJobDescription}
            onStartOver={handleStartOver}
          />
        );
      
      default:
        return <HeroSection onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress indicator for non-hero steps */}
      {currentStep !== "hero" && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-foreground">
                Resume Tailor
              </h1>
              <div className="flex space-x-2">
                {["upload", "job-description", "processing", "results"].map((step, index) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      step === currentStep
                        ? "bg-primary scale-125 shadow-glow"
                        : ["upload", "job-description", "processing", "results"].indexOf(currentStep) > index
                        ? "bg-primary/60"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={currentStep !== "hero" ? "pt-20" : ""}>
        <div className="container mx-auto px-6 py-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};