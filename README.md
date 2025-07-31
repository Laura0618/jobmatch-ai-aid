README.md

Resume Tailor

Resume Tailor is a web application that helps job seekers quickly tailor their resume to a specific job offer using AI.

Problem

Customizing a resume for each job application is proven to increase the chances of success, but doing it manually is time-consuming and often inefficient.

Solution

Resume Tailor allows users to upload their CV and paste the job description. The app then generates a tailored, optimized resume aligned with the job posting.

My Role
	•	Product ownership and feature planning
	•	Prompt engineering for AI resume generation
	•	UI/UX design and component architecture
	•	Technical integration with OpenAI and Supabase
	•	Documentation, roadmap creation, and QA

Key Features
	•	AI-generated tailored resumes
	•	Job title and company-aware customization
	•	Visual resume preview and PDF export
	•	Cover letter generation (in progress)
	•	Clean, responsive UI

Tech Stack
	•	Frontend: React, TailwindCSS
	•	Backend: Supabase, Deno
	•	AI: OpenAI GPT-4o mini
	•	PDF generation: jsPDF
	•	Deployment: Lovable

Learnings
	•	Built and tested end-to-end AI product
	•	Structured prompt engineering and iterative testing
	•	Implemented full-stack MVP with performance constraints
	•	Scoped roadmap based on value and complexity

CHANGELOG.md

Changelog

[0.2.0] - 2025-07-30

Added
	•	Professional resume layout (ResumePreview)
	•	Tailored resume displayed with proper formatting
	•	Visual display of key improvements in UI

Changed
	•	Cleaned repository structure
	•	Removed unused files and dependencies
	•	Updated resultsDisplay.tsx logic and structure

[0.1.0] - 2025-07-28

Added
	•	Initial MVP logic and Supabase function
	•	Resume input and job description input
	•	Tailored resume generation via OpenAI
	•	Results tab with tailored resume and cover letter

PRODUCT_PLAN.md

Product Plan: Resume Tailor

Vision

Build an intuitive and effective tool that allows users to instantly generate job-specific resumes that improve interview callbacks.

Core Problem

Most candidates apply with a single, static resume. Recruiters and ATS systems reward tailored applications. Manual tailoring is inefficient and inconsistent.

Objectives
	•	Provide a fast, user-friendly flow for generating a tailored resume
	•	Ensure output is structured and visually consistent
	•	Optimize the generated content for relevance and clarity

MVP Goals
	1.	Functional flow: upload resume + job description => tailored result
	2.	AI-generated content mapped to predefined resume fields
	3.	Exportable, professional PDF layout

Near-term Roadmap

High Priority
	•	Rewrite prompt to generate structured, field-aware resume content
	•	Improve resume-to-field mapping and formatting
	•	Replace current file download logic with PDF export component

Medium Priority
	•	Editor to manually tweak sections before export
	•	Side-by-side comparison view: original vs tailored resume
	•	Cover letter generation improvements

Low Priority
	•	Visual redesign of the app
	•	Style templates for different industries

Key Metrics
	•	Resume generation success rate
	•	Output quality (via user feedback)
	•	Time to complete resume generation
	•	Usage retention per user session