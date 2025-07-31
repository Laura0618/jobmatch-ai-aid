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
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Enter Your Resume</h2>
      </div>

      {/* Text Area for Resume */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">
          Paste your resume text
        </label>
        <Textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Copy and paste your resume content here..."
          className="min-h-[200px] resize-none"
        />
      </div>

      {/* Next Button */}
      <div className="flex justify-center">
        <Button
          variant="hero"
          size="lg"
          onClick={handleNext}
          disabled={!resumeText.trim()}
          className="px-12"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};