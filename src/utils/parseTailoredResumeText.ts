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
    const lower = line.toLowerCase();

    // Detect section changes
    if (lower.includes("professional experience")) {
      section = "experience";
      continue;
    }
    if (lower.includes("education")) {
      section = "education";
      continue;
    }
    if (lower.includes("skills") || lower.includes("skills and other")) {
      section = "skills";
      continue;
    }

    // Header (name, contact, summary)
    if (section === null && !data.name) {
      data.name = line;
      continue;
    }

    if (section === null && data.name && !data.phone) {
      const parts = line.split("·").map(p => p.trim());
      const [location, phone, email, linkedin] = [...parts, "", "", "", ""].slice(0, 4);
      Object.assign(data, { location, phone, email, linkedin });
      continue;
    }

    if (section === null && !data.summary) {
      data.summary = line;
      continue;
    }

    // Experience parsing
    if (section === "experience") {
      // Company line (with "–" or "·" as separator)
      if ((line.includes("–") || line.includes("·")) && !line.startsWith("-") && !line.toLowerCase().startsWith("highlight:")) {
        if (currentExp) data.experience.push(currentExp);
        const match = line.match(/^(.*?)\s[·–]\s(.*)$/);
        if (match) {
          const [_, company, dates] = match;
          currentExp = { company: company.trim(), dates: dates.trim(), role: "", bullets: [] };
        }
        continue;
      }

      // Role
      if (currentExp && !line.startsWith("-") && !line.toLowerCase().startsWith("highlight:") && !currentExp.role) {
        currentExp.role = line;
        continue;
      }

      // Bullet
      if (currentExp && /^[-•●]/.test(line)) {
        currentExp.bullets.push(line.replace(/^[-•●]\s*/, "").trim());
        continue;
      }

      // Highlight
      if (currentExp && lower.startsWith("highlight:")) {
        currentExp.highlight = line.replace(/^highlight:\s*/i, "").trim();
        continue;
      }
    }

    // Education
    if (section === "education") {
      const match = line.match(/^(.*?)\s[–-]\s(.*)$/);
      if (match) {
        data.education.push({
          school: match[1].trim(),
          degree: match[2].trim(),
        });
      }
      continue;
    }

    // Skills
    if (section === "skills") {
      if (lower.startsWith("tools:")) {
        data.skills.tools = line.replace(/tools:/i, "").split(",").map(s => s.trim());
      }
      if (lower.startsWith("skills:")) {
        data.skills.skills = line.replace(/skills:/i, "").split(",").map(s => s.trim());
      }
      if (lower.startsWith("it:")) {
        data.skills.it = line.replace(/it:/i, "").split(",").map(s => s.trim());
      }
    }
  }

  if (currentExp) data.experience.push(currentExp);

  return data;
}