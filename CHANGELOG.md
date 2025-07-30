# 📦 Changelog – Resume Tailored

Todas las actualizaciones y cambios realizados en el desarrollo del proyecto.

---

## 🗓️ Día 1 – Setup inicial + Integración visual (30/07/2025)

### 🎯 Objetivo
Renderizar el currículum adaptado con un diseño visual fijo, similar al PDF original.

### ✅ Hecho
- Configurado el flujo de entrada: CV original, job title, empresa y job description.
- Implementada y probada la función `generate-tailored-resume` en Supabase.
- Se resolvieron errores 429 de la API de OpenAI.
- Se detectaron problemas con la generación del contenido (formato incorrecto, tokens, errores de contexto).
- Descripción detallada del diseño original del CV para reproducirlo visualmente.
- Creado nuevo componente `ResumePreview.tsx` en `src/components/` con:
  - Secciones estructuradas.
  - Tipografía, márgenes y tamaños definidos.
  - Estilo preparado para exportación a PDF.

### ⚠️ Problemas encontrados
- Respuesta de IA mezclaba caracteres extraños y asumía datos incorrectos (ej. empleo en Preply).
- No se respetaba el formato visual original del CV.

### 🔧 Soluciones aplicadas
- Añadido control visual desde `ResumePreview.tsx`.
- Definida estructura esperada de `tailoredResume`.

```ts
interface TailoredResume {
  name: string;
  contact: string;
  summary: string;
  experience: ExperienceItem[];
  education: string[];
  skills: {
    tools: string[];
    skills: string[];
    it: string[];
  };
}


