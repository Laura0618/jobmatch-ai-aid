import type { ResumeData } from "@/types/resume";

export function parseTailoredResumeText(text: string): ResumeData {
  const lines = text.split("\n").map(line => line.trim()).filter(Boolean);

  const data: ResumeData = {
    name: "",
    location: "",
    phone: "",
    email: "",
    linkedin: "",
    summary: "",
    experience: [],
    education: [],
    skills: {
      tools: [],
      skills: [],
      it: [],
    },
  };

  let section: string | null = null;
  let currentExp: any = null;

  for (let line of lines) {
    if (line.toLowerCase().includes("professional experience")) {
      section = "experience";
      continue;
    }
    if (line.toLowerCase().includes("education")) {
      section = "education";
      continue;
    }
    if (line.toLowerCase().includes("skills") || line.toLowerCase().includes("skills and other")) {
      section = "skills";
      continue;
    }

    if (section === null && !data.name) {
      data.name = line;
      continue;
    }

    if (section === null && data.name) {
      const parts = line.split("·").map(p => p.trim());
      if (parts.length >= 4) {
        [data.location, data.phone, data.email, data.linkedin] = parts;
      }
      continue;
    }

    if (section === null && !data.summary) {
      data.summary = line;
      continue;
    }

    if (section === "experience") {
      if (line.includes("–") && !line.startsWith("-")) {
        if (currentExp) data.experience.push(currentExp);
        const [company, dates] = line.split("–").map(p => p.trim());
        currentExp = { company, dates, role: "", bullets: [] };
      } else if (!line.startsWith("-") && currentExp && !currentExp.role) {
        currentExp.role = line;
      } else if (line.startsWith("-") && currentExp) {
        currentExp.bullets.push(line.replace(/^[-•]\s*/, ""));
      } else if (line.toLowerCase().startsWith("highlight:") && currentExp) {
        currentExp.highlight = line.replace(/^highlight:\s*/i, "");
      }
    }

    if (section === "education") {
      const match = line.match(/^(.*) – (.*)$/);
      if (match) {
        data.education.push({
          school: match[1].trim(),
          degree: match[2].trim(),
        });
      }
    }

    if (section === "skills") {
      if (line.toLowerCase().startsWith("tools:")) {
        data.skills.tools = line.replace(/tools:/i, "").split(",").map(s => s.trim());
      }
      if (line.toLowerCase().startsWith("skills:")) {
        data.skills.skills = line.replace(/skills:/i, "").split(",").map(s => s.trim());
      }
      if (line.toLowerCase().startsWith("it:")) {
        data.skills.it = line.replace(/it:/i, "").split(",").map(s => s.trim());
      }
    }
  }

  if (currentExp) data.experience.push(currentExp);

  return data;
}