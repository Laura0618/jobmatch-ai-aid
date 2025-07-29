import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Brain, FileText, MessageSquare, Download, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';

interface ProcessingStepProps {
  onComplete: (tailoredResume: string) => void;
  resumeText: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
}

export const ProcessingStep = ({ onComplete, resumeText, jobTitle, company, jobDescription }: ProcessingStepProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const steps = [
    { icon: Brain, text: "Analyzing job requirements", duration: 1000 },
    { icon: FileText, text: "Connecting to AI to optimize resume", duration: 2000 },
    { icon: MessageSquare, text: "Generating tailored content", duration: 3000 },
    { icon: Download, text: "Generating PDF and cover letter", duration: 1500 },
    { icon: Download, text: "Finalizing downloads", duration: 500 },
  ];

  const generatePDF = (content: string, filename: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    // Split content into lines that fit
    const lines = doc.splitTextToSize(content, maxWidth);
    
    // Add content to PDF
    doc.text(lines, margin, 20);
    
    // Save the PDF
    doc.save(filename);
  };

  const generateCoverLetter = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });

    return `${currentDate}

Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position${company ? ` at ${company}` : ''}. Having carefully reviewed the job requirements, I am excited about the opportunity to contribute my skills and experience to your team.

Based on my background and the qualifications outlined in your job posting, I believe I would be an excellent fit for this role. My experience aligns well with your requirements, and I am particularly drawn to the challenges and opportunities this position offers.

I have taken the time to tailor my resume specifically for this role, highlighting the most relevant aspects of my experience that directly relate to your needs. This demonstrates not only my qualifications but also my genuine interest in your organization and this particular opportunity.

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team's continued success. Thank you for considering my application, and I look forward to hearing from you.

Best regards,
[Your Name]

---
Note: This cover letter has been generated based on the job requirements you provided. Please personalize it further with your specific details and experiences.`;
  };

  useEffect(() => {
    const generateResume = async () => {
      try {
        // Start the visual progression
        let totalDuration = 0;
        const timers: NodeJS.Timeout[] = [];

        steps.forEach((step, index) => {
          const timer = setTimeout(() => {
            setCurrentStep(index + 1);
            setProgress(((index + 1) / steps.length) * 100);
          }, totalDuration);
          
          timers.push(timer);
          totalDuration += step.duration;
        });

        // Call the AI function after the visual starts
        setTimeout(async () => {
          const { data, error } = await supabase.functions.invoke('generate-tailored-resume', {
            body: {
              resumeText,
              jobTitle,
              company,
              jobDescription
            }
          });

          if (error) {
            throw error;
          }

          if (data?.tailoredResume) {
            // Generate and download PDF
            setTimeout(() => {
              try {
                console.log("Generando PDF...");
                generatePDF(data.tailoredResume, 'tailored-resume.pdf');
                
                toast({
                  title: "Resume PDF Generated!",
                  description: "Your tailored resume has been downloaded as PDF."
                });
                console.log("PDF generado exitosamente");
              } catch (error) {
                console.error("Error generando PDF:", error);
                toast({
                  title: "Error generating PDF",
                  description: "There was an issue creating the PDF file.",
                  variant: "destructive"
                });
              }
            }, 1000);

            // Generate and download cover letter
            setTimeout(() => {
              try {
                console.log("Generando cover letter...");
                const coverLetter = generateCoverLetter();
                const blob = new Blob([coverLetter], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cover-letter.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                toast({
                  title: "Cover Letter Generated!",
                  description: "Your personalized cover letter has been downloaded."
                });
                console.log("Cover letter generado exitosamente");
              } catch (error) {
                console.error("Error generando cover letter:", error);
                toast({
                  title: "Error generating cover letter",
                  description: "There was an issue creating the cover letter file.",
                  variant: "destructive"
                });
              }
            }, 1500);

            // Wait for visual progression to complete and proceed
            setTimeout(() => {
              onComplete(data.tailoredResume);
            }, 2000);
          } else {
            throw new Error('No se pudo generar el currículum');
          }
        }, 2000);

        return () => {
          timers.forEach(timer => clearTimeout(timer));
        };
      } catch (err) {
        console.error('Error generating resume:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };

    generateResume();
  }, [onComplete, resumeText, jobTitle, company, jobDescription]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="p-8 bg-destructive/5 border-destructive/20">
          <div className="flex items-center space-x-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <div>
              <h3 className="text-lg font-semibold text-destructive">Error al generar el currículum</h3>
              <p className="text-muted-foreground mt-2">{error}</p>
              <p className="text-sm text-muted-foreground mt-4">
                Asegúrate de que la API key de OpenAI esté configurada correctamente.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          AI is Working Its Magic ✨
        </h2>
        <p className="text-muted-foreground text-lg">
          Please wait while we tailor your resume and create your cover letter
        </p>
      </div>

      {/* Progress Bar */}
      <Card className="p-8 bg-gradient-card shadow-card">
        <div className="space-y-6">
          <Progress value={progress} className="h-3" />
          <div className="text-center">
            <p className="text-lg font-medium text-primary">{progress}% Complete</p>
          </div>
        </div>
      </Card>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;
          
          return (
            <Card
              key={index}
              className={`p-6 transition-all duration-500 ${
                isActive
                  ? "bg-primary/5 border-primary shadow-elegant scale-105"
                  : isCompleted
                  ? "bg-muted/30 border-muted"
                  : "bg-card border-border opacity-50"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isActive
                      ? "bg-primary/20 text-primary animate-pulse"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium transition-colors duration-300 ${
                      isActive
                        ? "text-primary"
                        : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.text}
                  </p>
                </div>
                {isActive && (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
};