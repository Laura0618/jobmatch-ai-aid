import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// 🔍 DEBUG: Verifica si la variable existe
console.log("OPENAI_API_KEY presente:", !!openAIApiKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobTitle, company, jobDescription } = await req.json();

    // Validación de campos
    if (!resumeText || !jobTitle || !company || !jobDescription) {
      return new Response(JSON.stringify({ error: 'Missing fields in request' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!openAIApiKey) {
      console.error("❌ ERROR: Falta la variable OPENAI_API_KEY en entorno Supabase");
      return new Response(JSON.stringify({ error: 'Missing OpenAI API key' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Generating tailored resume for:', jobTitle, 'at', company);


const prompt = `You are an expert in human resources and resume writing for tech startups and fast-growing companies.

Your task is to tailor an existing resume to a specific job posting. The candidate is applying to the job described below and has NOT worked there. Do not fabricate experience or imply they are already part of the company. Do not add new responsibilities or projects that are not mentioned in the original resume or project grid.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

────────────────────────────────────

SPECIAL INSTRUCTION: Skill Prioritization Logic

To improve relevance in the SKILLS & OTHER section, apply the following logic:

CASE 1: If a keyword from the candidate’s existing SKILLS & OTHER section (Tools, Skills, or IT) appears in the job description:
1. Check if the keyword is mentioned in a context that implies it is a desired or relevant skill.
2. If yes, move the keyword to the beginning of its corresponding sublist (Tools, Skills, or IT).
3. If not, leave the section unchanged.

CASE 2: If a keyword from the predefined list of “Secondary Tools, Skills & IT” appears in the job description but is not present in the candidate’s original SKILLS & OTHER section:
1. Check if the keyword appears in a context that implies it is desired or relevant.
2. If yes, add the keyword to the beginning of the relevant sublist.
3. Then, remove the least relevant existing item from that same sublist to maintain balance.
4. If not relevant, leave the section unchanged.

Only apply this logic if at least one keyword from the list matches the job description in a relevant context. If no such keyword is found, leave the SKILLS & OTHER section unchanged.

Here is the list of “Secondary Tools, Skills & IT” keywords:

[Miro, Monday.com, Notion, OKR tracking tools, Google Analytics, Power BI, Adobe Analytics, Microsoft Teams, Zoom, Mural, Discord, Loom, SharePoint, Dropbox, Box, Google Workspace, Microsoft 365, Airtable, Hotjar, FullStory, UserVoice, Usabilla, Pendo, Qualtrics, Maze, UserTesting, Typeform, SurveyMonkey, Intercom, Zendesk, WalkMe, Appcues, UsabilityHub, Crazy Egg, VWO, Contentsquare, ClickUp, Basecamp, Linear, Shortcut, Wrike, Smartsheet, Microsoft Project, Gantt charts, Kanban boards, Sprint planning tools, Scrum boards, Azure DevOps, Rally, Pivotal Tracker, Productboard, Roadmunk, ProdPad, Aha!, ProductPlan, Airfocus, Craft.io, Dragonboat, Portfolio for Jira, Clarity, SWOT analysis tools, Business Model Canvas, Strategy maps, OKR platforms, Balanced Scorecard, Vision boarding tools, Competitive analysis tools, Market sizing tools, Executive Communication, Team Building, Mentoring & Coaching, Change Management, Negotiation, Delegation, Motivation Techniques, Vision Setting, Decision Making, Influence Without Authority, Public Speaking, Storytelling, Persuasion, Executive Presence, Strategic Communication, Statistical Analysis, Hypothesis Testing, A/B Testing Design, Metrics Definition, Data Visualization, Experimentation, Cohort Analysis, Funnel Analysis, Regression Analysis, Predictive Modeling, SQL Querying, Data Mining, Machine Learning Basics, Business Intelligence, Data Governance, Stakeholder Management, Conflict Resolution, Facilitation, Active Listening, Empathy, Consensus Building, Cultural Intelligence, Bridge Building, Workshop Facilitation, Cross-Cultural Communication, Matrix Management, Virtual Collaboration, Feedback Delivery, Team Alignment, Relationship Building, User Research, Persona Development, Journey Mapping, Usability Testing, User Story Writing, Accessibility Design, Voice of Customer, Prototype Testing, Card Sorting, Heuristic Evaluation, Design Thinking, Service Design, Information Architecture, Contextual Inquiry, Co-creation, Agile Methodologies, Scrum Framework, Kanban Implementation, Risk Management, Resource Allocation, Timeline Management, Budget Management, Dependency Management, Sprint Planning, Backlog Grooming, Velocity Tracking, Milestone Planning, Capacity Planning, Release Planning, Market Analysis, Competitive Intelligence, Business Model Design, Growth Strategy, Product-Market Fit, Go-to-Market Strategy, Pricing Strategy, Partnership Development, Revenue Modeling, Strategic Planning, Innovation Management, Ecosystem Building, Platform Strategy, Network Effects, Value Proposition Design, Presentation Software, Video Conferencing Tech, Digital Communication, Productivity Suites, Knowledge Management Systems, Learning Management Systems, Digital Whiteboarding, Survey Platforms, Feedback Tools, HR Tech Platforms, OKR Software, Performance Management Tools, Communication Protocols, Virtual Reality Tools, AI-powered Coaching Tools, Python for Data Analysis, R Programming, NoSQL Databases, ETL Processes, Data Warehousing, Machine Learning Libraries, Statistical Software, Data Pipeline Tools, BI Tool Administration, Database Management, Data Lake Technologies, Streaming Analytics, Real-time Analytics, Predictive Analytics Tools, Collaboration APIs, Integration Platforms, Webhook Configuration, SSO Implementation, Cloud Collaboration, API Integrations, OAuth/SAML, Middleware, Enterprise Service Bus, Identity Management, Directory Services, File Sharing Systems, Notification Systems, Workflow Automation, Digital Asset Management, JavaScript Frameworks, React/Vue/Angular, Mobile Development Basics, Responsive Design, A/B Testing Platforms, Analytics Implementation, Tag Management, User Analytics Code, Heatmap Tools, Session Recording, Personalization Engines, Customer Data Platforms, Experience Analytics, Conversion Optimization, Project Management APIs, Automation Scripts, CI/CD Tools, Version Control (Git), Agile Tools Integration, DevOps Tools, Infrastructure as Code, Monitoring Systems, Deployment Automation, Testing Frameworks, Build Tools, Configuration Management, Log Management, Performance Monitoring, Resource Management Tools, Business Intelligence Tools, CRM Systems, ERP Systems, Data Warehousing, Analytics Platforms, Marketing Automation, Sales Enablement Tools, Financial Modeling Software, Forecasting Tools, Strategic Planning Software, Competitive Intelligence Platforms, Market Research Tools, Business Process Modeling, Innovation Management Platforms, Scenario Planning Software]

────────────────────────────────────

TASK 1: Analyze the job description  
Identify the most relevant skill areas from this list:  
[Leadership and Influence, Data-Driven Decision Making, Cross-Functional Collaboration, Technical Understanding, User Focus, Project Management, Strategic Impact].

TASK 2: Tailor the resume using the project grid  
Use only the candidate’s real past experience and the provided skill-aligned project grid.  
- Focus on measurable impact and achievements.
- Prioritize experience and projects that align with the job description (e.g. platform migrations, product adoption, stakeholder alignment, and working across ecosystems).
- Keep the original order, company names, and dates exactly as provided. Do not merge or split roles.
- Do not reword or add new education content.

TASK 3: Follow formatting and structure exactly  
Resume structure and formatting must follow these rules:
- Use a horizontal divider like this: "────────────────────────────────────"
- Use only plain hyphen bullets ("-") — no other symbols.
- Do not include special characters, symbols, emojis, or comments.
- Do not include any introductory or closing text.

STRUCTURE (follow strictly):

1. Full Name (uppercase, centered)  
2. Contact line: City · Phone · Email · LinkedIn (centered)  
3. Horizontal divider  
4. Professional Profile (centered, plain text paragraph, 270–350 characters)  
5. Horizontal divider  
6. PROFESSIONAL EXPERIENCE (title centered, all caps)  
   - Company Name (left) · Dates (right)  
   - Role (below, left-aligned)  
   - Bullet points (2–4 per role, max 200 characters per bullet, up to 3 bullets for last 2 jobs)  
   - Highlight: [metric-based achievement] (must appear in at least 75% of roles, max 180 characters)  
   - Divider between experiences  

7. EDUCATION  
   - Institution (all caps) – Degree (title case, bold)  
8. Horizontal divider  
9. SKILLS & OTHER  
   - Tools: [list]  
   - Skills: [list]  
   - IT: [list]
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a human resources expert specialising in tailoring CVs for specific positions.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const tailoredResume = data.choices[0].message.content;

    console.log('✅ Resume successfully generated');

    return new Response(JSON.stringify({ tailoredResume }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Error in generate-tailored-resume function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});