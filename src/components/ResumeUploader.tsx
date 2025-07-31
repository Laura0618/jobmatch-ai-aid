import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResumeUploaderProps {
  onResumeReady: (resumeText: string) => void;
}

export const ResumeUploader = ({ onResumeReady }: ResumeUploaderProps) => {
  const [resumeText, setResumeText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResumeText(text);
        setUploadedFile(file);
        toast({
          title: "Resume uploaded successfully!",
          description: "Your resume text has been loaded."
        });
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a TXT file.",
        variant: "destructive"
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      handleFileUpload(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setResumeText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleNext = () => {
    if (resumeText.trim()) {
      onResumeReady(resumeText.trim());
    } else {
      toast({
        title: "Resume required",
        description: "Please upload a resume or paste your resume text.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">Enter Your Resume</h2>
        <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
          Paste your resume content below to get started with AI-powered optimization
        </p>
      </div>

      {/* Text Area for Resume */}
      <Card className="p-8 bg-gradient-card shadow-elegant border-0">
        <div className="space-y-6">
          <label className="text-lg font-semibold text-foreground block">
            Resume Content
          </label>
          <Textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Copy and paste your resume content here... Include your contact info, experience, education, and skills."
            className="min-h-[300px] resize-none text-base leading-relaxed border-2 focus:border-primary/50 rounded-xl"
          />
        </div>
      </Card>

      {/* Next Button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="hero"
          size="lg"
          onClick={handleNext}
          disabled={!resumeText.trim()}
          className="px-16 py-6 h-auto text-lg font-semibold rounded-2xl shadow-2xl"
        >
          Continue to Job Details
        </Button>
      </div>
    </div>
  );
};