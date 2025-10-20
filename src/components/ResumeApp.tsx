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
  const [currentStep, setCurrentStep] = useState<AppStep>("hero");
  const [previewMode, setPreviewMode] = useState(false); // Mode to navigate without API calls
  const [appData, setAppData] = useState<AppData>({
    resumeText: "",
    jobTitle: "",
    company: "",
    jobDescription: ""
  });
  const { toast } = useToast();

  // Mock data for testing
  const mockData = {
    resumeText: `JOHN DOE
Software Engineer

CONTACT INFORMATION
Email: john.doe@email.com
Phone: (555) 123-4567
Location: San Francisco, CA

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years developing scalable web applications using React, Node.js, and cloud technologies. Proven track record of delivering high-quality solutions and leading development teams.

EXPERIENCE
Senior Software Engineer | Tech Corp | 2021 - Present
• Led development of customer-facing web applications serving 100k+ users
• Implemented microservices architecture reducing system latency by 40%
• Mentored junior developers and established coding best practices

Software Engineer | StartupXYZ | 2019 - 2021
• Built responsive web applications using React and TypeScript
• Collaborated with product team to define technical requirements
• Optimized database queries improving application performance by 25%

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2019

SKILLS
• Programming: JavaScript, TypeScript, Python, Java
• Frontend: React, Vue.js, HTML/CSS, Tailwind
• Backend: Node.js, Express, PostgreSQL, MongoDB
• Cloud: AWS, Docker, Kubernetes`,
    jobTitle: "Senior Frontend Developer",
    company: "Google",
    jobDescription: `We are looking for a Senior Frontend Developer to join our team and help build the next generation of user interfaces for our products.

RESPONSIBILITIES:
• Develop responsive web applications using React and modern JavaScript
• Collaborate with designers to implement pixel-perfect UI components
• Optimize application performance and ensure cross-browser compatibility
• Mentor junior developers and participate in code reviews
• Work with backend teams to integrate APIs and services

REQUIREMENTS:
• 5+ years of experience in frontend development
• Expert knowledge of React, TypeScript, and modern CSS
• Experience with state management (Redux, Zustand)
• Familiarity with testing frameworks (Jest, Cypress)
• Strong understanding of web performance optimization
• Experience with design systems and component libraries

PREFERRED:
• Experience with Next.js or similar frameworks
• Knowledge of GraphQL and REST APIs
• Familiarity with cloud platforms (AWS, GCP)
• Understanding of accessibility standards (WCAG)`,
    tailoredResume: `JOHN DOE
Senior Frontend Developer

CONTACT INFORMATION
Email: john.doe@email.com
Phone: (555) 123-4567
Location: San Francisco, CA

PROFESSIONAL SUMMARY
Senior Frontend Developer with 5+ years of expertise in React, TypeScript, and modern web technologies. Proven track record of building scalable user interfaces, optimizing performance, and mentoring development teams. Specialized in creating responsive applications and implementing design systems.

TECHNICAL SKILLS
• Frontend Technologies: React, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS
• State Management: Redux, Zustand, Context API
• Testing: Jest, Cypress, React Testing Library
• Performance: Web Vitals optimization, lazy loading, code splitting
• Tools: Webpack, Vite, ESLint, Prettier
• Cloud & DevOps: AWS, Docker, CI/CD pipelines

PROFESSIONAL EXPERIENCE

Senior Software Engineer | Tech Corp | 2021 - Present
• Led frontend development of customer-facing React applications serving 100,000+ daily users
• Implemented responsive design systems and component libraries improving development efficiency by 50%
• Optimized application performance through code splitting and lazy loading, reducing initial load time by 40%
• Mentored 3 junior frontend developers on React best practices and modern JavaScript
• Collaborated with UX/UI teams to translate designs into pixel-perfect, accessible web interfaces
• Established frontend coding standards and participated in architecture decisions

Software Engineer | StartupXYZ | 2019 - 2021
• Built responsive web applications using React, TypeScript, and modern CSS frameworks
• Integrated RESTful APIs and GraphQL endpoints for seamless data flow
• Implemented cross-browser compatible solutions ensuring 99% compatibility across modern browsers
• Collaborated closely with product and design teams to define technical requirements
• Optimized frontend performance through database query optimization and caching strategies

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2019
Relevant Coursework: Web Development, Human-Computer Interaction, Software Engineering

KEY ACHIEVEMENTS
• Reduced application bundle size by 35% through strategic code splitting and optimization
• Led migration from JavaScript to TypeScript improving code maintainability and reducing bugs by 60%
• Implemented automated testing pipeline achieving 90% code coverage
• Contributed to open-source React component library with 1000+ GitHub stars`
  };

  const handleGetStarted = () => {
    setCurrentStep("upload");
  };

  const handleResumeReady = (resumeText: string) => {
    setAppData(prev => ({ ...prev, resumeText }));
    setCurrentStep("job-description");
  };

  const handleJobDescriptionReady = async (jobTitle: string, company: string, jobDescription: string) => {
    setAppData(prev => ({ ...prev, jobTitle, company, jobDescription }));
    
    // If in preview mode, use mock data
    if (previewMode) {
      setTimeout(() => {
        handleProcessingComplete(mockData.tailoredResume);
        toast({
          title: "Preview Mode",
          description: "Using sample data - No API credits consumed",
        });
      }, 1000);
      return;
    }
    
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
        throw new Error(`API Error: ${error.message}`);
      }

      if (data?.tailoredResume) {
        handleProcessingComplete(data.tailoredResume);
      } else {
        throw new Error('Failed to generate resume');
      }
    } catch (err) {
      console.error('Error generating resume:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleProcessingComplete = (tailoredResume: string) => {
    try {
      const structuredResume = parseTailoredResumeText(tailoredResume);
      setAppData(prev => ({ ...prev, tailoredResume, structuredResume }));
      setCurrentStep("results");
    } catch (error) {
      console.error("Error parsing resume:", error);
      toast({
        title: "Parsing Warning",
        description: "Resume generated but some formatting may be imperfect. Please review carefully.",
        variant: "default"
      });
      // Still set the data and proceed, but without structured version
      setAppData(prev => ({ ...prev, tailoredResume }));
      setCurrentStep("results");
    }
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

  const loadMockData = () => {
    setAppData({
      resumeText: mockData.resumeText,
      jobTitle: mockData.jobTitle,
      company: mockData.company,
      jobDescription: mockData.jobDescription,
      tailoredResume: mockData.tailoredResume,
      structuredResume: parseTailoredResumeText(mockData.tailoredResume)
    });
    setPreviewMode(true);
    toast({
      title: "Preview Mode Activated",
      description: "Navigation without consuming API credits",
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case "hero":
        return <HeroSection onGetStarted={handleGetStarted} onLoadMockData={loadMockData} />;
      
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
        return <HeroSection onGetStarted={handleGetStarted} onLoadMockData={loadMockData} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Progress indicator for non-hero steps */}
      {currentStep !== "hero" && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-black text-foreground tracking-tight">
                  Resume Tailor
                </h1>
                {previewMode && (
                  <span className="px-3 py-1 bg-accent/20 text-accent font-semibold text-sm rounded-full">
                    Preview Mode
                  </span>
                )}
              </div>
              
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
                        className={`w-4 h-4 rounded-full transition-all duration-500 cursor-pointer ${
                          step === currentStep
                            ? "bg-primary scale-125 shadow-glow ring-4 ring-primary/20"
                            : ["upload", "job-description", "results"].indexOf(currentStep) > index
                            ? "bg-primary/80 scale-110"
                            : "bg-muted border-2 border-muted-foreground/20"
                        }`}
                        onClick={() => previewMode && setCurrentStep(step as AppStep)}
                        title={previewMode ? `Go to ${step}` : undefined}
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