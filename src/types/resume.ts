export interface ResumeData {
  name: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  summary: string;
  experience: {
    company: string;
    dates: string;
    role: string;
    bullets: string[];
    highlight?: string;
  }[];
  education: {
    school: string;
    degree: string;
  }[];
  skills: {
    tools: string[];
    skills: string[];
    it: string[];
  };
}