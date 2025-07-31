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

const prompt = `
You are an expert recruiter specialized in tailoring CVs for job postings in the tech and product space.

Your task is to **adapt the original resume to a specific job offer**. The candidate is NOT currently working in the company and has asked you **not to invent any experience**.

You must analyze the job posting and map which of the following **7 product management skill areas** are present in it (even implicitly):

1. Leadership and Influence  
2. Data-Driven Decision Making  
3. Cross-Functional Collaboration  
4. Technical Understanding  
5. User Focus  
6. Project Management  
7. Strategic Impact

Then, use this mapping to guide the CV adaptation:  
- Emphasize the projects, achievements, and bullet points most aligned with the mentioned skill areas.  
- Maintain a **balanced structure**: don't remove other skill areas that are not mentioned if they are relevant and strong.  
- Use natural transitions and rewrite if needed to ensure flow, coherence, and emphasis.

Do not invent experience. Do not change previous company names or dates.  
Keep a professional, clear tone and focus on impact, data, and outcomes.

---

ORIGINAL RESUME:
${resumeText}

---

JOB DESCRIPTION:
${jobDescription}

---

OUTPUT STRUCTURE:
1. Professional Profile (short summary)
2. Work Experience (reverse chronological)
3. Education
4. Skills & Tools

The output should be a fully tailored CV text, ready to export or copy.
Do not add comments, summaries, or formatting outside the CV.`
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