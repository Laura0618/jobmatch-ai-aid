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
    if (!jobTitle.trim() || !jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in the job title and description.",
        variant: "destructive"
      });
      return;
    }

    onJobDescriptionReady(jobTitle.trim(), company.trim(), jobDescription.trim());
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Job Description</h2>
        <p className="text-muted-foreground text-lg">
          Tell us about the position you're applying for
        </p>
      </div>

      <Card className="p-8 bg-gradient-card shadow-card">
        <div className="space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-base font-medium">
              Job Title *
            </Label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="text-lg h-12"
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company" className="text-base font-medium">
              Company (Optional)
            </Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google, Microsoft, Startup Inc."
              className="text-lg h-12"
            />
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="jobDescription" className="text-base font-medium">
              Job Description *
            </Label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here, including requirements, responsibilities, and qualifications..."
              className="min-h-[300px] resize-none text-base"
            />
            <p className="text-sm text-muted-foreground">
              The more detailed the job description, the better we can tailor your resume.
            </p>
          </div>
        </div>
      </Card>

      {/* Example Job Description */}
      <Card className="p-6 bg-muted/30 border-muted">
        <div className="flex items-start space-x-3">
          <Briefcase className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-foreground mb-2">💡 Pro Tip</h4>
            <p className="text-sm text-muted-foreground">
              Include the entire job posting - requirements, preferred skills, company culture, 
              and any specific technologies mentioned. This helps our AI understand exactly 
              what the employer is looking for.
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        <Button
          variant="hero"
          size="lg"
          onClick={handleSubmit}
          disabled={!jobTitle.trim() || !jobDescription.trim()}
          className="px-12"
        >
          Generate Resume
        </Button>
      </div>
    </div>
  );
};