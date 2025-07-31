import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Copy, ArrowLeft, Star, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ResumePreview from "@/components/ResumePreview";
import type { ResumeData } from "@/types/resume";

interface ResultsDisplayProps {
  originalResume: string;
  tailoredResume: string;
  jobTitle: string;
  company: string;
  onBack: () => void;
  onStartOver: () => void;
  structuredResume?: ResumeData; // <-- nueva prop
}

export const ResultsDisplay = ({
  originalResume,
  tailoredResume,
  jobTitle,
  company,
  onBack,
  onStartOver,
  structuredResume
}: ResultsDisplayProps) => {
  const { toast } = useToast();

  const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position${company ? ` at ${company}` : ''}. After carefully reviewing the job requirements, I believe my background and experience make me an excellent candidate for this role.

My professional experience and skills align well with the qualifications you're seeking. I have taken the time to tailor my resume specifically for this position, highlighting the most relevant aspects of my background that directly relate to your needs.

I am particularly drawn to this opportunity because it represents a chance to apply my expertise in a meaningful way while contributing to your organization's continued success. My approach to work emphasizes collaboration, continuous learning, and delivering high-quality results.

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team's goals. Thank you for considering my application, and I look forward to hearing from you.

Best regards,
[Your Name]

Note: Please personalize this letter with your specific details and experiences.`;

  const improvements = [
    "Aligned content with specific job requirements",
    "Optimized keywords for ATS compatibility",
    "Restructured experience to highlight relevant skills",
    "Enhanced formatting for better readability",
    "Focused on achievements most relevant to the target role"
  ];

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded successfully!",
      description: `${filename} has been saved to your downloads folder.`
    });
  };

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard!",
      description: `${type} has been copied to your clipboard.`
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-8 animate-float backdrop-blur-sm">
          ✨ Resume Successfully Optimized
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
          Your Tailored Resume is Ready!
        </h2>
        <p className="text-xl text-muted-foreground font-light max-w-3xl mx-auto">
          Here's your optimized resume and cover letter for the <span className="font-semibold text-primary">{jobTitle}</span> position
        </p>
      </div>

      {/* Key Improvements */}
      <Card className="p-8 bg-gradient-to-br from-primary/5 via-white to-accent/5 border-0 shadow-elegant">
        <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
          <Star className="w-6 h-6 text-primary mr-3" />
          Key Improvements Made
        </h3>
        <div className="grid gap-4">
          {improvements.map((improvement, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-xl bg-white/50 border border-white/20">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-base text-foreground font-medium">{improvement}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Tabs for Resume and Cover Letter */}
      <Tabs defaultValue="resume" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 h-14 bg-muted/50 rounded-2xl p-1">
          <TabsTrigger value="resume" className="flex items-center space-x-2 h-12 rounded-xl text-base font-semibold">
            <span>Tailored Resume</span>
            <Badge variant="secondary" className="bg-primary text-white">New</Badge>
          </TabsTrigger>
          <TabsTrigger value="cover-letter" className="h-12 rounded-xl text-base font-semibold">Cover Letter</TabsTrigger>
        </TabsList>

        <TabsContent value="resume" className="space-y-6">
          <Card className="p-8 bg-gradient-card shadow-elegant border-0">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-foreground">Your Optimized Resume</h3>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(tailoredResume, "Resume")}
                  className="px-6 py-3 h-auto font-medium rounded-xl border-2"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleDownload(tailoredResume, "tailored-resume.txt")}
                  className="px-6 py-3 h-auto font-medium rounded-xl shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-h-[1100px] overflow-y-auto border border-white/20">
              {structuredResume ? (
                <ResumePreview data={structuredResume} />
              ) : (
                <pre className="whitespace-pre-wrap text-sm font-mono text-foreground leading-relaxed">
                  {tailoredResume}
                </pre>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="cover-letter" className="space-y-6">
          <Card className="p-8 bg-gradient-card shadow-elegant border-0">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-foreground">Personalized Cover Letter</h3>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(coverLetter, "Cover Letter")}
                  className="px-6 py-3 h-auto font-medium rounded-xl border-2"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleDownload(coverLetter, "cover-letter.txt")}
                  className="px-6 py-3 h-auto font-medium rounded-xl shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-h-96 overflow-y-auto border border-white/20">
              <pre className="whitespace-pre-wrap text-base text-foreground leading-relaxed">
                {coverLetter}
              </pre>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
        <Button
          variant="outline"
          onClick={onStartOver}
          className="flex items-center space-x-2 px-8 py-4 h-auto rounded-xl border-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Start Over</span>
        </Button>

        <Button 
          variant="hero" 
          onClick={onStartOver}
          className="px-12 py-4 h-auto text-lg font-semibold rounded-2xl shadow-2xl"
        >
          Tailor Another Resume
        </Button>
      </div>

      {/* Next Steps */}
      <Card className="p-8 bg-gradient-to-br from-accent/5 via-white to-primary/5 border-0 shadow-elegant">
        <h3 className="text-2xl font-bold text-foreground mb-6">🚀 Next Steps</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/50 border border-white/20">
            <p className="font-medium text-foreground">📝 Review and customize the resume further if needed</p>
          </div>
          <div className="p-4 rounded-xl bg-white/50 border border-white/20">
            <p className="font-medium text-foreground">💼 Update your LinkedIn profile with similar optimizations</p>
          </div>
          <div className="p-4 rounded-xl bg-white/50 border border-white/20">
            <p className="font-medium text-foreground">💬 Practice interview questions related to the highlighted skills</p>
          </div>
          <div className="p-4 rounded-xl bg-white/50 border border-white/20">
            <p className="font-medium text-foreground">⭐ Prepare specific examples that demonstrate your relevant experience</p>
          </div>
        </div>
      </Card>
    </div>
  );
};