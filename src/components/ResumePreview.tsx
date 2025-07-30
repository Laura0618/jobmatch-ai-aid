import React, { useRef } from "react";

interface ResumeData {
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

interface Props {
  data: ResumeData;
}

const ResumePreview: React.FC<Props> = ({ data }) => {
  const baseFont = "Inter, Helvetica Neue, Arial, sans-serif";

  return (
    <div
      id="resume-preview"
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        padding: "15mm",
        fontFamily: baseFont,
        fontSize: "10pt",
        lineHeight: 1.4,
        color: "#000",
        backgroundColor: "#fff",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "18pt", textTransform: "uppercase" }}>
        {data.name}
      </div>
      <div style={{ textAlign: "center", marginTop: "4px", fontSize: "9.5pt" }}>
        {data.location} · {data.phone} · {data.email} · {data.linkedin}
      </div>
      <hr style={{ margin: "12pt 0" }} />

      {/* SUMMARY */}
      <div style={{ textAlign: "center", fontSize: "10pt" }}>{data.summary}</div>
      <hr style={{ margin: "12pt 0" }} />

      {/* EXPERIENCE */}
      <div
        style={{
          fontWeight: "bold",
          fontSize: "12pt",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        Professional Experience
      </div>
      {data.experience.map((exp, i) => (
        <div key={i} style={{ marginTop: "12pt", fontSize: "9.5pt" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5pt" }}>
            <span style={{ fontWeight: "bold" }}>{exp.company}</span>
            <span>{exp.dates}</span>
          </div>
          <div style={{ fontWeight: "normal", fontSize: "10pt" }}>{exp.role}</div>
          <ul style={{ paddingLeft: "16px", marginTop: "4px" }}>
            {exp.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
          {exp.highlight && (
            <div style={{ marginTop: "4px" }}>
              <strong>Highlight:</strong> {exp.highlight}
            </div>
          )}
        </div>
      ))}

      <hr style={{ margin: "12pt 0" }} />

      {/* EDUCATION */}
      <div
        style={{
          fontWeight: "bold",
          fontSize: "12pt",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        Education
      </div>
      <div style={{ marginTop: "10pt", fontSize: "9.5pt" }}>
        {data.education.map((edu, i) => (
          <div key={i}>
            <span style={{ textTransform: "uppercase" }}>{edu.school}</span> – <strong>{edu.degree}</strong>
          </div>
        ))}
      </div>

      <hr style={{ margin: "12pt 0" }} />

      {/* SKILLS */}
      <div
        style={{
          fontWeight: "bold",
          fontSize: "12pt",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        Skills and Other
      </div>
      <div style={{ marginTop: "10pt", fontSize: "9.5pt" }}>
        <div>
          <strong>Tools:</strong> {data.skills.tools.join(", ")}
        </div>
        <div>
          <strong>Skills:</strong> {data.skills.skills.join(", ")}
        </div>
        <div>
          <strong>IT:</strong> {data.skills.it.join(", ")}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;