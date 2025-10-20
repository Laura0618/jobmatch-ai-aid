import type { ResumeData } from "@/types/resume";

interface ParseError {
  line?: number;
  message: string;
}

export class ResumeParseError extends Error {
  public errors: ParseError[];

  constructor(message: string, errors: ParseError[] = []) {
    super(message);
    this.name = "ResumeParseError";
    this.errors = errors;
  }
}

/**
 * Validates the parsed resume data for completeness
 */
function validateResumeData(data: ResumeData): ParseError[] {
  const errors: ParseError[] = [];

  if (!data.name || data.name.length < 2) {
    errors.push({ message: "Name is missing or too short" });
  }

  if (!data.email && !data.phone) {
    errors.push({ message: "At least one contact method (email or phone) is required" });
  }

  if (data.experience.length === 0) {
    errors.push({ message: "No work experience found" });
  }

  // Validate each experience entry
  data.experience.forEach((exp, index) => {
    if (!exp.company) {
      errors.push({ message: `Experience entry ${index + 1}: Missing company name` });
    }
    if (!exp.role) {
      errors.push({ message: `Experience entry ${index + 1}: Missing role/title` });
    }
  });

  return errors;
}

/**
 * Extracts email from a string using regex
 */
function extractEmail(text: string): string {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return emailMatch ? emailMatch[0] : "";
}

/**
 * Extracts phone number from a string using regex
 */
function extractPhone(text: string): string {
  const phoneMatch = text.match(/[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}/);
  return phoneMatch ? phoneMatch[0] : "";
}

/**
 * Parses tailored resume text into structured data with error handling and validation
 */
export function parseTailoredResumeText(text: string): ResumeData {
  if (!text || text.trim().length === 0) {
    throw new ResumeParseError("Resume text is empty");
  }

  const lines = text.split("\n").map(line => line.trim());
  const nonEmptyLines = lines.filter(Boolean);

  if (nonEmptyLines.length < 3) {
    throw new ResumeParseError("Resume text is too short to parse");
  }

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
  const parseErrors: ParseError[] = [];

  for (let i = 0; i < nonEmptyLines.length; i++) {
    const line = nonEmptyLines[i];
    const lower = line.toLowerCase();

    // Skip divider lines
    if (line.match(/^[-─=_]{3,}$/)) {
      continue;
    }

    try {
      // Detect section changes (only match section headers, not content lines)
      if (lower.includes("professional experience") || lower.includes("work experience")) {
        section = "experience";
        continue;
      }
      if (lower.includes("education") && !lower.match(/^(tools|skills|it):/i)) {
        section = "education";
        continue;
      }
      // Match skills section headers but not skills content lines (e.g., "Skills: Leadership, ...")
      if ((lower.includes("skills") || lower.includes("technical skills")) && !lower.match(/^skills:/i)) {
        section = "skills";
        continue;
      }

      // Header parsing (name, contact, summary)
      if (section === null && !data.name) {
        // First non-empty line is the name
        data.name = line;
        continue;
      }

      // Contact information parsing with fallback strategies
      if (section === null && data.name && !data.phone && !data.email) {
        // Try to parse contact line with various separators
        const separators = ["·", "•", "|", "–", "-"];
        let parts: string[] = [];

        for (const sep of separators) {
          if (line.includes(sep)) {
            parts = line.split(sep).map(p => p.trim());
            break;
          }
        }

        // Fallback: if no separators found, try to extract email and phone directly
        if (parts.length === 0) {
          data.email = extractEmail(line);
          data.phone = extractPhone(line);
          if (data.email || data.phone) {
            data.location = line.replace(data.email, "").replace(data.phone, "").trim();
          }
        } else {
          // Try to intelligently assign parts
          parts.forEach(part => {
            if (!data.email && part.includes("@")) {
              data.email = extractEmail(part) || part;
            } else if (!data.phone && /\d{3}/.test(part)) {
              data.phone = extractPhone(part) || part;
            } else if (!data.linkedin && part.toLowerCase().includes("linkedin")) {
              data.linkedin = part;
            } else if (!data.location) {
              data.location = part;
            }
          });
        }
        continue;
      }

      // Professional summary (appears before any section header)
      if (section === null && data.name && !data.summary && (data.phone || data.email)) {
        data.summary = line;
        continue;
      }

      // Experience parsing with improved robustness
      if (section === "experience") {
        // Company line detection (contains separator and doesn't start with bullet)
        const hasDateSeparator = (line.includes("–") || line.includes("·") || line.includes("|"));
        const isNotBullet = !line.match(/^[-•●]/);
        const isNotHighlight = !lower.startsWith("highlight:");

        if (hasDateSeparator && isNotBullet && isNotHighlight) {
          if (currentExp) {
            data.experience.push(currentExp);
          }

          // Try multiple separator patterns
          const separatorPattern = /\s+[·–|]\s+/;
          const match = line.match(separatorPattern);

          if (match) {
            const parts = line.split(separatorPattern);
            currentExp = {
              company: parts[0].trim(),
              dates: parts[parts.length - 1].trim(),
              role: "",
              bullets: [],
            };
          } else {
            // Fallback: assume entire line is company
            currentExp = {
              company: line,
              dates: "",
              role: "",
              bullets: [],
            };
            parseErrors.push({
              line: i + 1,
              message: `Could not parse company/dates separator: "${line}"`,
            });
          }
          continue;
        }

        // Role/title (first non-bullet line after company)
        if (currentExp && !line.match(/^[-•●]/) && !lower.startsWith("highlight:") && !currentExp.role) {
          currentExp.role = line;
          continue;
        }

        // Bullet points
        if (currentExp && line.match(/^[-•●]/)) {
          const bulletText = line.replace(/^[-•●]\s*/, "").trim();
          if (bulletText) {
            currentExp.bullets.push(bulletText);
          }
          continue;
        }

        // Highlight
        if (currentExp && lower.startsWith("highlight:")) {
          currentExp.highlight = line.replace(/^highlight:\s*/i, "").trim();
          continue;
        }
      }

      // Education parsing
      if (section === "education") {
        // Try to match "School – Degree" or "School - Degree" pattern
        const match = line.match(/^(.*?)\s+[–-]\s+(.*)$/);
        if (match) {
          data.education.push({
            school: match[1].trim(),
            degree: match[2].trim(),
          });
        } else if (line && !lower.includes("relevant coursework")) {
          // Fallback: treat entire line as school name
          data.education.push({
            school: line,
            degree: "",
          });
        }
        continue;
      }

      // Skills parsing
      if (section === "skills") {
        const skillsMatch = line.match(/^(tools|skills|it):\s*(.*)$/i);
        if (skillsMatch) {
          const [_, category, content] = skillsMatch;
          const items = content
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);

          const categoryLower = category.toLowerCase();
          if (categoryLower === "tools") {
            data.skills.tools = items;
          } else if (categoryLower === "skills") {
            data.skills.skills = items;
          } else if (categoryLower === "it") {
            data.skills.it = items;
          }
        }
      }
    } catch (error) {
      parseErrors.push({
        line: i + 1,
        message: error instanceof Error ? error.message : "Unknown parsing error",
      });
    }
  }

  // Push last experience entry if exists
  if (currentExp) {
    data.experience.push(currentExp);
  }

  // Validate the parsed data
  const validationErrors = validateResumeData(data);

  // If critical validation errors exist, throw with details
  if (validationErrors.length > 0) {
    console.warn("Resume parsing validation warnings:", validationErrors);
    // Note: We log warnings but don't throw - allows partial resumes to render
  }

  // Log any parsing errors for debugging
  if (parseErrors.length > 0) {
    console.warn("Resume parsing encountered errors:", parseErrors);
  }

  return data;
}

/**
 * Safely parses resume text with a fallback to basic structure
 */
export function safeParseResumeText(text: string): ResumeData | null {
  try {
    return parseTailoredResumeText(text);
  } catch (error) {
    console.error("Failed to parse resume:", error);
    return null;
  }
}
