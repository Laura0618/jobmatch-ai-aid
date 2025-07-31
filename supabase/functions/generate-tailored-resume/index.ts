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

Your task is to tailor an existing resume to a specific job posting. The candidate is applying to the job described below and has NOT worked there. Do not fabricate experience or imply they are already part of the company.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:
1. Analyze the job description and identify which of the following skill areas are most relevant: 
   [Leadership and Influence, Data-Driven Decision Making, Cross-Functional Collaboration, Technical Understanding, User Focus, Project Management, Strategic Impact].

2. Based on the candidate’s experience and the provided grid of skill-aligned projects, rewrite the resume to reflect a balanced but customized focus on these skill areas. Prioritize clarity and measurable impact.

3. Resume structure and formatting must follow the guidelines below:
- Professional Profile: 270–350 characters max.
- For the two most recent roles: include up to 3 bullet points (max 200 characters each).
- At least 75% of work experiences must include a "Highlight:" line (max 180 characters) showing a success metric.

4. Do not change company names or dates.
5. Use a professional, results-oriented tone focused on achievements and skills relevant to the job.
6. Do not add any introductory or closing text.
7. Do not include special characters, symbols, emojis, or comments outside the resume content.

OUTPUT STRUCTURE (exactly):
1. Full Name (uppercase, centered)
2. Contact line: City · Phone · Email · LinkedIn (centered)
3. Horizontal divider
4. Professional Profile (centered, plain text paragraph)
5. Horizontal divider
6. PROFESSIONAL EXPERIENCE (title centered, all caps)
   - Company Name (left) · Dates (right)
   - Role (below, left-aligned)
   - Bullet points (2–4 per role, max 2 lines each)
   - Highlight: [metric-based achievement] (optional but required in 75% of roles)
   - Divider below the section
7. EDUCATION
   - Institution (all caps) – Degree (title case, bold)
8. Divider
9. SKILLS & OTHER
   - Tools: [list]
   - Skills: [list]
   - IT: [list]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Eres un experto en recursos humanos especializado en la adaptación de currículums para posiciones específicas.' },
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