### 📄 `README.md`

```md
# 💼 Resume Tailored

Resume Tailored es una aplicación que permite adaptar tu currículum a una oferta laboral específica usando inteligencia artificial. Genera automáticamente una versión personalizada y profesional de tu CV, lista para copiar o descargar como PDF.

---

## 🚀 ¿Qué hace esta app?

1. ✍️ Recibes como entrada:
   - Tu CV original (texto libre)
   - Título del puesto
   - Nombre de la empresa
   - Descripción del puesto

2. ⚙️ Se genera:
   - Un currículum adaptado usando IA (OpenAI vía Supabase Edge Function)
   - Visualización en pantalla con formato profesional
   - Opción para copiar o exportar como PDF

---

## 🧱 Arquitectura técnica

- **Frontend**: React + TailwindCSS
- **Backend**: Supabase Edge Functions (Deno)
- **IA**: OpenAI (gpt-4o-mini / gpt-3.5-turbo)
- **Deploy & UI builder**: Lovable
- **Output**: Formato enriquecido + PDF

---

## 📦 Estructura del proyecto
jobmatch-ai-aid/
├── public/
├── src/
│   ├── components/
│   │   └── ResumePreview.tsx  # Vista formateada del CV adaptado
│   ├── App.tsx
│   └── …
├── supabase/
│   └── functions/
│       └── generate-tailored-resume/
├── docs/
│   └── day-1-summary.md
├── README.md
└── CHANGELOG.md
---