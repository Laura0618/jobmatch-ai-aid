import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Brain, FileText, MessageSquare, Download } from "lucide-react";

interface ProcessingStepProps {
  onComplete: () => void;
}

export const ProcessingStep = ({ onComplete }: ProcessingStepProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { icon: Brain, text: "Analyzing job requirements", duration: 2000 },
    { icon: FileText, text: "Optimizing resume content", duration: 3000 },
    { icon: MessageSquare, text: "Crafting cover letter", duration: 2500 },
    { icon: Download, text: "Preparing downloads", duration: 1500 },
  ];

  useEffect(() => {
    let totalDuration = 0;
    const timers: NodeJS.Timeout[] = [];

    steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index + 1);
        if (index === steps.length - 1) {
          setTimeout(() => {
            onComplete();
          }, 1000);
        }
      }, totalDuration);
      
      timers.push(timer);
      totalDuration += step.duration;
    });

    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 1;
      });
    }, totalDuration / 100);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      clearInterval(progressTimer);
    };
  }, [onComplete]);

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

      {/* Fun Message */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <div className="text-center">
          <p className="text-foreground font-medium">
            🎯 Matching your skills to the job requirements...
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            This usually takes about 30 seconds
          </p>
        </div>
      </Card>
    </div>
  );
};