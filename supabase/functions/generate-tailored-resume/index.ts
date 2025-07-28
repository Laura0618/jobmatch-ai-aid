import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    console.log('Generating tailored resume for:', jobTitle, 'at', company);

    const prompt = `Eres un experto en recursos humanos y redacción de currículums. Tu tarea es adaptar un currículum existente para una posición específica.

CURRÍCULUM ORIGINAL:
${resumeText}

TRABAJO AL QUE APLICAR:
- Puesto: ${jobTitle}
- Empresa: ${company}
- Descripción del trabajo: ${jobDescription}

INSTRUCCIONES:
1. Mantén toda la información verdadera y factual del currículum original
2. Reorganiza y enfatiza las experiencias más relevantes para este puesto
3. Adapta la descripción de responsabilidades para usar palabras clave de la descripción del trabajo
4. Mantén el mismo formato y estructura general
5. No inventes experiencia o habilidades que no existan en el original
6. Enfócate en destacar lo más relevante para el puesto

Devuelve ÚNICAMENTE el currículum adaptado, sin comentarios adicionales:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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

    console.log('Resume successfully generated');

    return new Response(JSON.stringify({ tailoredResume }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-tailored-resume function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});