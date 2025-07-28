import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Brain, FileText, MessageSquare, Download, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  const steps = [
    { icon: Brain, text: "Analyzing job requirements", duration: 1000 },
    { icon: FileText, text: "Connecting to AI to optimize resume", duration: 2000 },
    { icon: MessageSquare, text: "Generating tailored content", duration: 3000 },
    { icon: Download, text: "Finalizing your resume", duration: 1000 },
  ];

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
            // Wait for visual progression to complete
            setTimeout(() => {
              onComplete(data.tailoredResume);
            }, 1000);
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