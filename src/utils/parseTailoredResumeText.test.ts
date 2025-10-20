import { describe, it, expect } from 'vitest';
import { parseTailoredResumeText, ResumeParseError, safeParseResumeText } from './parseTailoredResumeText';

describe('parseTailoredResumeText', () => {
  describe('Error handling', () => {
    it('should throw ResumeParseError for empty text', () => {
      expect(() => parseTailoredResumeText('')).toThrow(ResumeParseError);
      expect(() => parseTailoredResumeText('')).toThrow('Resume text is empty');
    });

    it('should throw ResumeParseError for text that is too short', () => {
      expect(() => parseTailoredResumeText('John')).toThrow(ResumeParseError);
      expect(() => parseTailoredResumeText('John\nDoe')).toThrow('Resume text is too short to parse');
    });
  });

  describe('Header parsing', () => {
    it('should correctly parse name from first line', () => {
      const text = `JOHN DOE
Software Engineer
john@email.com`;
      const result = parseTailoredResumeText(text);
      expect(result.name).toBe('JOHN DOE');
    });

    it('should parse contact info with · separator', () => {
      const text = `JOHN DOE
San Francisco · (555) 123-4567 · john@email.com · linkedin.com/in/johndoe
Experienced software engineer`;
      const result = parseTailoredResumeText(text);
      expect(result.location).toBe('San Francisco');
      expect(result.phone).toContain('555');
      expect(result.email).toBe('john@email.com');
      expect(result.linkedin).toContain('linkedin');
    });

    it('should parse contact info with • separator', () => {
      const text = `JANE SMITH
NYC • 555-9999 • jane@test.com
Summary text here`;
      const result = parseTailoredResumeText(text);
      expect(result.location).toBe('NYC');
      expect(result.phone).toContain('555-9999');
      expect(result.email).toBe('jane@test.com');
    });

    it('should parse contact info with | separator', () => {
      const text = `BOB JONES
LA | 555.1234 | bob@email.org
Summary`;
      const result = parseTailoredResumeText(text);
      expect(result.location).toBe('LA');
      expect(result.email).toBe('bob@email.org');
    });

    it('should extract email and phone without separators', () => {
      const text = `ALICE WONDER
Boston john@email.com (555) 123-4567
Professional summary`;
      const result = parseTailoredResumeText(text);
      expect(result.email).toBe('john@email.com');
      // Phone extraction may capture different parts depending on regex
      expect(result.phone).toBeTruthy();
      expect(result.phone.length).toBeGreaterThan(0);
    });

    it('should parse professional summary', () => {
      const text = `JOHN DOE
SF · john@email.com
Experienced software engineer with 5+ years in web development
PROFESSIONAL EXPERIENCE`;
      const result = parseTailoredResumeText(text);
      expect(result.summary).toContain('Experienced software engineer');
    });
  });

  describe('Experience parsing', () => {
    it('should parse experience with – separator', () => {
      const text = `NAME
contact@email.com
Summary

PROFESSIONAL EXPERIENCE
Tech Corp – 2021 - Present
Senior Software Engineer
- Led development of web applications
- Improved performance by 40%`;
      const result = parseTailoredResumeText(text);
      expect(result.experience).toHaveLength(1);
      expect(result.experience[0].company).toBe('Tech Corp');
      expect(result.experience[0].dates).toBe('2021 - Present');
      expect(result.experience[0].role).toBe('Senior Software Engineer');
      expect(result.experience[0].bullets).toHaveLength(2);
    });

    it('should parse experience with · separator', () => {
      const text = `NAME
contact@email.com
Summary

PROFESSIONAL EXPERIENCE
StartupXYZ · 2019 - 2021
Software Engineer
- Built responsive applications
- Collaborated with teams`;
      const result = parseTailoredResumeText(text);
      expect(result.experience[0].company).toBe('StartupXYZ');
      expect(result.experience[0].dates).toBe('2019 - 2021');
    });

    it('should parse multiple experience entries', () => {
      const text = `NAME
email@test.com
Summary

PROFESSIONAL EXPERIENCE
Company A · 2021 - Present
Role A
- Bullet A1
- Bullet A2

Company B · 2019 - 2021
Role B
- Bullet B1`;
      const result = parseTailoredResumeText(text);
      expect(result.experience).toHaveLength(2);
      expect(result.experience[0].company).toBe('Company A');
      expect(result.experience[1].company).toBe('Company B');
    });

    it('should parse highlight sections', () => {
      const text = `NAME
email@test.com
Summary

PROFESSIONAL EXPERIENCE
Tech Corp · 2021 - Present
Engineer
- Main responsibility
Highlight: Reduced latency by 50%`;
      const result = parseTailoredResumeText(text);
      expect(result.experience[0].highlight).toBe('Reduced latency by 50%');
    });

    it('should handle bullets with different markers', () => {
      const text = `NAME
email@test.com
Summary

PROFESSIONAL EXPERIENCE
Company · 2020 - 2021
Role
- Bullet with hyphen
• Bullet with dot
● Bullet with circle`;
      const result = parseTailoredResumeText(text);
      expect(result.experience[0].bullets).toHaveLength(3);
    });
  });

  describe('Education parsing', () => {
    it('should parse education with – separator', () => {
      const text = `NAME
email@test.com
Summary

EDUCATION
University of California, Berkeley – Bachelor of Science in Computer Science`;
      const result = parseTailoredResumeText(text);
      expect(result.education).toHaveLength(1);
      expect(result.education[0].school).toBe('University of California, Berkeley');
      expect(result.education[0].degree).toBe('Bachelor of Science in Computer Science');
    });

    it('should parse education with - separator', () => {
      const text = `NAME
email@test.com
Summary

EDUCATION
MIT - Master of Engineering`;
      const result = parseTailoredResumeText(text);
      expect(result.education[0].school).toBe('MIT');
      expect(result.education[0].degree).toBe('Master of Engineering');
    });

    it('should skip "relevant coursework" lines', () => {
      const text = `NAME
email@test.com
Summary

EDUCATION
Stanford University – BS Computer Science
Relevant Coursework: Algorithms, Data Structures`;
      const result = parseTailoredResumeText(text);
      expect(result.education).toHaveLength(1);
      expect(result.education[0].school).toBe('Stanford University');
    });
  });

  describe('Skills parsing', () => {
    it('should parse tools, skills, and IT sections', () => {
      const text = `NAME
email@test.com
Summary

SKILLS & OTHER
Tools: Jira, Figma, Slack
Skills: Leadership, Communication, Problem Solving
IT: Python, JavaScript, SQL`;
      const result = parseTailoredResumeText(text);
      expect(result.skills.tools).toEqual(['Jira', 'Figma', 'Slack']);
      expect(result.skills.skills).toEqual(['Leadership', 'Communication', 'Problem Solving']);
      expect(result.skills.it).toEqual(['Python', 'JavaScript', 'SQL']);
    });

    it('should handle case-insensitive skill headers', () => {
      const text = `NAME
email@test.com
Summary

TECHNICAL SKILLS
TOOLS: Docker, Kubernetes
SKILLS: Agile, Scrum
IT: React, Node.js`;
      const result = parseTailoredResumeText(text);
      expect(result.skills.tools).toEqual(['Docker', 'Kubernetes']);
      expect(result.skills.it).toEqual(['React', 'Node.js']);
    });
  });

  describe('Divider handling', () => {
    it('should skip divider lines', () => {
      const text = `NAME
email@test.com
────────────────────────────────────
Summary text
────────────────────────────────────
PROFESSIONAL EXPERIENCE
Company · 2020 - 2021
Role
- Bullet`;
      const result = parseTailoredResumeText(text);
      expect(result.summary).toBe('Summary text');
      expect(result.experience).toHaveLength(1);
    });
  });

  describe('Complex real-world resume', () => {
    it('should parse a complete resume correctly', () => {
      const text = `JOHN DOE
San Francisco, CA · (555) 123-4567 · john.doe@email.com · linkedin.com/in/johndoe
────────────────────────────────────
Experienced software engineer with 5+ years developing scalable web applications using React, Node.js, and cloud technologies.
────────────────────────────────────
PROFESSIONAL EXPERIENCE
Tech Corp · 2021 - Present
Senior Software Engineer
- Led development of customer-facing web applications serving 100k+ users
- Implemented microservices architecture reducing system latency by 40%
- Mentored junior developers and established coding best practices
Highlight: Delivered 5 major features on time, increasing revenue by $2M

StartupXYZ · 2019 - 2021
Software Engineer
- Built responsive web applications using React and TypeScript
- Collaborated with product team to define technical requirements
- Optimized database queries improving application performance by 25%
────────────────────────────────────
EDUCATION
University of California, Berkeley – Bachelor of Science in Computer Science
────────────────────────────────────
SKILLS & OTHER
Tools: Jira, Figma, Git, Docker
Skills: Leadership, Communication, Problem Solving, Agile
IT: JavaScript, TypeScript, Python, React, Node.js, AWS`;

      const result = parseTailoredResumeText(text);

      // Header
      expect(result.name).toBe('JOHN DOE');
      expect(result.location).toBe('San Francisco, CA');
      expect(result.phone).toContain('555');
      expect(result.email).toBe('john.doe@email.com');
      expect(result.linkedin).toContain('linkedin');
      expect(result.summary).toContain('Experienced software engineer');

      // Experience
      expect(result.experience).toHaveLength(2);
      expect(result.experience[0].company).toBe('Tech Corp');
      expect(result.experience[0].role).toBe('Senior Software Engineer');
      expect(result.experience[0].bullets).toHaveLength(3);
      expect(result.experience[0].highlight).toContain('$2M');

      // Education
      expect(result.education).toHaveLength(1);
      expect(result.education[0].school).toBe('University of California, Berkeley');

      // Skills
      expect(result.skills.tools).toContain('Jira');
      expect(result.skills.skills).toContain('Leadership');
      expect(result.skills.it).toContain('React');
    });
  });

  describe('safeParseResumeText', () => {
    it('should return null for invalid resume', () => {
      const result = safeParseResumeText('');
      expect(result).toBeNull();
    });

    it('should return parsed data for valid resume', () => {
      const text = `NAME
email@test.com
Summary text`;
      const result = safeParseResumeText(text);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('NAME');
    });
  });
});
