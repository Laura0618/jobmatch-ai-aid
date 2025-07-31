import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobDescriptionInputProps {
  onJobDescriptionReady: (jobTitle: string, company: string, description: string) => void;
  onBack: () => void;
}

export const JobDescriptionInput = ({ onJobDescriptionReady, onBack }: JobDescriptionInputProps) => {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in the job description.",
        variant: "destructive"
      });
      return;
    }

    onJobDescriptionReady(jobTitle.trim(), company.trim(), jobDescription.trim());
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">Job Description</h2>
        <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
          Tell us about the position you're applying for so we can optimize your resume perfectly
        </p>
      </div>

      <Card className="p-10 bg-gradient-card shadow-elegant border-0">
        <div className="space-y-8">
          {/* Job Title */}
          <div className="space-y-3">
            <Label htmlFor="jobTitle" className="text-lg font-semibold text-foreground">
              Job Title
            </Label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="text-lg h-14 border-2 focus:border-primary/50 rounded-xl"
            />
          </div>

          {/* Company */}
          <div className="space-y-3">
            <Label htmlFor="company" className="text-lg font-semibold text-foreground">
              Company <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google, Microsoft, Startup Inc."
              className="text-lg h-14 border-2 focus:border-primary/50 rounded-xl"
            />
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            <Label htmlFor="jobDescription" className="text-lg font-semibold text-foreground">
              Job Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here, including requirements, responsibilities, and qualifications..."
              className="min-h-[300px] resize-none text-base leading-relaxed border-2 focus:border-primary/50 rounded-xl"
            />
            <p className="text-sm text-muted-foreground font-medium bg-accent/10 p-3 rounded-lg">
              💡 The more detailed the job description, the better we can tailor your resume.
            </p>
          </div>
        </div>
      </Card>


      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center space-x-2 px-8 py-4 h-auto rounded-xl border-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        <Button
          variant="hero"
          size="lg"
          onClick={handleSubmit}
          disabled={!jobDescription.trim()}
          className="px-16 py-6 h-auto text-lg font-semibold rounded-2xl shadow-2xl"
        >
          Generate Tailored Resume
        </Button>
      </div>
    </div>
  );
};