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
    if (file.type === "application/pdf") {
      toast({
        title: "PDF Upload",
        description: "PDF text extraction will be available when connected to Supabase backend.",
        variant: "destructive"
      });
      return;
    }

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
        description: "Please upload a PDF or TXT file.",
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
        <h2 className="text-3xl font-bold text-foreground mb-4">Upload Your Resume</h2>
        <p className="text-muted-foreground text-lg">
          Upload a file or paste your resume text to get started
        </p>
      </div>

      {/* File Upload Area */}
      <Card
        className={`relative border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? "border-primary bg-primary/5 scale-105"
            : "border-border hover:border-primary/50"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        <div className="p-8 text-center">
          {uploadedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3 text-primary">
                <FileText className="w-8 h-8" />
                <span className="font-medium">{uploadedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-16 h-16 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-medium text-foreground mb-2">
                  Drop your resume here, or click to browse
                </p>
                <p className="text-muted-foreground">
                  Supports PDF and TXT files
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="mt-4"
              >
                Choose File
              </Button>
            </div>
          )}
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Text Area Alternative */}
      <div className="space-y-4">
        <div className="text-center">
          <span className="text-muted-foreground">or</span>
        </div>
        
        <div className="space-y-2">
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