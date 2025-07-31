import { useState } from "react";
import { HeroSection } from "./HeroSection";
import { ResumeUploader } from "./ResumeUploader";
import { JobDescriptionInput } from "./JobDescriptionInput";
import { ResultsDisplay } from "./ResultsDisplay";
import { parseTailoredResumeText } from "@/utils/parseTailoredResumeText";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ResumeData } from "@/types/resume";

type AppStep = "hero" | "upload" | "job-description" | "results";

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
  const { toast } = useToast();

  const handleGetStarted = () => {
    setCurrentStep("upload");
  };

  const handleResumeReady = (resumeText: string) => {
    setAppData(prev => ({ ...prev, resumeText }));
    setCurrentStep("job-description");
  };

  const handleJobDescriptionReady = async (jobTitle: string, company: string, jobDescription: string) => {
    setAppData(prev => ({ ...prev, jobTitle, company, jobDescription }));
    
    // Call the AI function directly
    try {
      const { data, error } = await supabase.functions.invoke('generate-tailored-resume', {
        body: {
          resumeText: appData.resumeText,
          jobTitle,
          company,
          jobDescription
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Error de API: ${error.message}`);
      }

      if (data?.tailoredResume) {
        handleProcessingComplete(data.tailoredResume);
      } else {
        throw new Error('No se pudo generar el currículum');
      }
    } catch (err) {
      console.error('Error generating resume:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive"
      });
    }
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
      {/* Modern Progress indicator for non-hero steps */}
      {currentStep !== "hero" && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-foreground tracking-tight">
                Resume Tailor
              </h1>
              <div className="flex items-center space-x-6">
                <div className="hidden md:block">
                  {currentStep === "upload" && (
                    <span className="text-foreground font-semibold text-lg">📝 Enter Resume Content</span>
                  )}
                  {currentStep === "job-description" && (
                    <span className="text-foreground font-semibold text-lg">💼 Add Job Details</span>
                  )}
                  {currentStep === "results" && (
                    <span className="text-foreground font-semibold text-lg">✨ Your Tailored Resume</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  {["upload", "job-description", "results"].map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-4 h-4 rounded-full transition-all duration-500 ${
                          step === currentStep
                            ? "bg-primary scale-125 shadow-glow ring-4 ring-primary/20"
                            : ["upload", "job-description", "results"].indexOf(currentStep) > index
                            ? "bg-primary/80 scale-110"
                            : "bg-muted border-2 border-muted-foreground/20"
                        }`}
                      />
                      {index < 2 && (
                        <div className={`w-8 h-0.5 mx-1 transition-colors duration-500 ${
                          ["upload", "job-description", "results"].indexOf(currentStep) > index
                            ? "bg-primary/60"
                            : "bg-muted"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
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