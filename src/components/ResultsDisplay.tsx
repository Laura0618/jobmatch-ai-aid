import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Copy, ArrowLeft, Star, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultsDisplayProps {
  originalResume: string;
  jobTitle: string;
  company: string;
  onBack: () => void;
  onStartOver: () => void;
}

export const ResultsDisplay = ({ 
  originalResume, 
  jobTitle, 
  company, 
  onBack, 
  onStartOver 
}: ResultsDisplayProps) => {
  const { toast } = useToast();

  // Mock tailored content (in real app, this would come from AI backend)
  const tailoredResume = `JOHN DOE
Software Engineer

📧 john.doe@email.com | 📱 (555) 123-4567 | 🔗 linkedin.com/in/johndoe | 🌐 github.com/johndoe

PROFESSIONAL SUMMARY
Results-driven Software Engineer with 5+ years of experience developing scalable web applications and APIs. Expertise in React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering high-quality software solutions that improve user experience and business metrics.

TECHNICAL SKILLS
• Frontend: React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Python, Express.js, RESTful APIs, GraphQL
• Databases: PostgreSQL, MongoDB, Redis
• Cloud & DevOps: AWS, Docker, CI/CD, Git, GitHub Actions
• Testing: Jest, Cypress, Unit Testing, Integration Testing

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp Inc. | 2021 - Present
• Led development of customer-facing React applications serving 100K+ daily users
• Architected and implemented microservices using Node.js and Docker
• Collaborated with product managers and designers to define technical requirements
• Mentored 3 junior developers and established coding best practices
• Improved application performance by 40% through code optimization

Software Engineer | StartupXYZ | 2019 - 2021
• Built responsive web applications using React and TypeScript
• Developed RESTful APIs and integrated third-party services
• Implemented automated testing strategies reducing bugs by 60%
• Participated in agile development process and sprint planning

PROJECTS
• E-commerce Platform: Built full-stack application with React, Node.js, and PostgreSQL
• Real-time Chat App: Developed using WebSocket, React, and MongoDB
• Task Management Tool: Created responsive SPA with advanced filtering and search

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2019

CERTIFICATIONS
• AWS Certified Developer Associate
• React Developer Certification`;

  const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position${company ? ` at ${company}` : ''}. With over 5 years of experience in software development and a proven track record of building scalable web applications, I am excited about the opportunity to contribute to your team.

In my current role as a Senior Software Engineer at TechCorp Inc., I have successfully led the development of customer-facing React applications that serve over 100,000 daily users. My expertise in React, Node.js, and cloud technologies directly aligns with the requirements outlined in your job posting. I have consistently delivered high-quality software solutions while collaborating effectively with cross-functional teams.

What particularly excites me about this role is the opportunity to work on challenging projects that make a real impact. My experience in architecting microservices, implementing CI/CD pipelines, and mentoring junior developers has prepared me to take on the responsibilities of this position and contribute to your team's success from day one.

I am passionate about clean code, best practices, and continuous learning. I stay current with the latest technologies and industry trends, and I believe in writing maintainable, scalable code that stands the test of time.

Thank you for considering my application. I would welcome the opportunity to discuss how my skills and experience can contribute to your team's goals.

Best regards,
John Doe`;

  const improvements = [
    "Added quantifiable achievements (100K+ users, 40% performance improvement)",
    "Aligned technical skills with job requirements",
    "Emphasized leadership and collaboration experience",
    "Highlighted relevant project experience",
    "Optimized keyword usage for ATS systems"
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Your Tailored Resume is Ready! 🎉
        </h2>
        <p className="text-muted-foreground text-lg">
          Here's your optimized resume and cover letter for the {jobTitle} position
        </p>
      </div>

      {/* Key Improvements */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Star className="w-5 h-5 text-primary mr-2" />
          Key Improvements Made
        </h3>
        <div className="grid gap-3">
          {improvements.map((improvement, index) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{improvement}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Tabs for Resume and Cover Letter */}
      <Tabs defaultValue="resume" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resume" className="flex items-center space-x-2">
            <span>Tailored Resume</span>
            <Badge variant="secondary">New</Badge>
          </TabsTrigger>
          <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
        </TabsList>

        <TabsContent value="resume" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Your Optimized Resume</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(tailoredResume, "Resume")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleDownload(tailoredResume, "tailored-resume.txt")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono text-foreground">
                {tailoredResume}
              </pre>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="cover-letter" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Personalized Cover Letter</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(coverLetter, "Cover Letter")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleDownload(coverLetter, "cover-letter.txt")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                {coverLetter}
              </pre>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Description</span>
        </Button>

        <div className="flex space-x-4">
          <Button variant="secondary" onClick={onStartOver}>
            Start Over
          </Button>
          <Button variant="hero" className="px-8">
            Tailor Another Resume
          </Button>
        </div>
      </div>

      {/* Next Steps */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">🚀 Next Steps</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>• Review and customize the resume further if needed</p>
          <p>• Update your LinkedIn profile with similar optimizations</p>
          <p>• Practice interview questions related to the highlighted skills</p>
          <p>• Consider connecting to our Supabase backend for advanced AI features</p>
        </div>
      </Card>
    </div>
  );
};