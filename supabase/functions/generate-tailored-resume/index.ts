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

    const prompt = `Actúa como un experto en recursos humanos con experiencia en redactar currículums personalizados para startups tecnológicas y plataformas de aprendizaje como Preply.

Tu tarea es adaptar un currículum existente a una oferta de trabajo específica. La persona está aplicando a esta oferta, **no ha trabajado allí**. No inventes experiencia, no asumas que ya forma parte de la empresa.

CURRÍCULUM ORIGINAL:
${resumeText}

OFERTA DE TRABAJO:
${jobDescription}

INSTRUCCIONES:
- Reescribe el currículum resaltando las habilidades, logros y experiencias más alineadas con la oferta.
- No modifiques los nombres de las empresas anteriores ni las fechas.
- Mantén un tono profesional, claro y orientado a impacto (logros medibles, decisiones estratégicas, habilidades clave).
- Mantén las secciones principales: Perfil, Experiencia profesional, Educación, Habilidades.
- No agregues símbolos extraños ni comentarios fuera del currículum.
- Devuelve solo el currículum adaptado, listo para ser copiado y pegado o exportado a PDF.

Estructura de salida recomendada:
1. Perfil profesional
2. Experiencia profesional (en orden cronológico inverso)
3. Educación
4. Habilidades y herramientas`;

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