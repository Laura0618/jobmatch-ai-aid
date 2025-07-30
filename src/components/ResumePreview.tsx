import React from "react";

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
  return (
    <div style={{ width: "800px", margin: "0 auto", fontFamily: "Helvetica, Arial, sans-serif", fontSize: "11px", lineHeight: 1.5 }}>
      {/* HEADER */}
      <div style={{ textAlign: "center", fontWeight: "bold" }}>{data.name.toUpperCase()}</div>
      <div style={{ textAlign: "center", marginTop: "2px" }}>
        {data.location} · {data.phone} · {data.email} · {data.linkedin}
      </div>
      <hr style={{ margin: "12px 0" }} />

      {/* SUMMARY */}
      <div style={{ textAlign: "center" }}>{data.summary}</div>
      <hr style={{ margin: "12px 0" }} />

      {/* EXPERIENCE */}
      <div style={{ fontWeight: "bold", fontSize: "12px", textAlign: "center", textTransform: "uppercase" }}>Professional Experience</div>
      {data.experience.map((exp, i) => (
        <div key={i} style={{ marginTop: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{exp.company}</span>
            <span>{exp.dates}</span>
          </div>
          <div style={{ fontWeight: "bold" }}>{exp.role}</div>
          <ul style={{ paddingLeft: "16px", marginTop: "2px" }}>
            {exp.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
          {exp.highlight && (
            <div>
              <strong>Highlight:</strong> {exp.highlight}
            </div>
          )}
        </div>
      ))}

      <hr style={{ margin: "12px 0" }} />

      {/* EDUCATION */}
      <div style={{ fontWeight: "bold", fontSize: "12px", textAlign: "center", textTransform: "uppercase" }}>Education</div>
      <div style={{ marginTop: "10px" }}>
        {data.education.map((edu, i) => (
          <div key={i}>
            <span style={{ textTransform: "uppercase" }}>{edu.school}</span> - <strong>{edu.degree}</strong>
          </div>
        ))}
      </div>

      <hr style={{ margin: "12px 0" }} />

      {/* SKILLS */}
      <div style={{ fontWeight: "bold", fontSize: "12px", textAlign: "center", textTransform: "uppercase" }}>Skills and Other</div>
      <div style={{ marginTop: "10px" }}>
        <div><strong>Tools:</strong> {data.skills.tools.join(", ")}</div>
        <div><strong>Skills:</strong> {data.skills.skills.join(", ")}</div>
        <div><strong>IT:</strong> {data.skills.it.join(", ")}</div>
      </div>
    </div>
  );
};

export default ResumePreview;
