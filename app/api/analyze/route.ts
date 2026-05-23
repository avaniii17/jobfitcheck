import { generateText, Output } from 'ai'
import { google } from '@ai-sdk/google'
import { analysisSchema } from '@/lib/analysis-schema'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()
    if (!apiKey) {
      return Response.json(
        {
          error:
            'GOOGLE_GENERATIVE_AI_API_KEY is missing or empty. Open .env.local in the project root, set GOOGLE_GENERATIVE_AI_API_KEY=your-key (from aistudio.google.com/apikey), save the file, then stop and restart npm run dev.',
        },
        { status: 500 },
      )
    }

    const { jobDescription, resume } = await req.json()

    if (!jobDescription?.trim() || !resume?.trim()) {
      return Response.json({ error: 'Job description and resume are required' }, { status: 400 })
    }

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      output: Output.object({ schema: analysisSchema }),
      prompt: `You are an expert HR consultant and career coach. Analyze the resume against the job description.

## Job Description:
${jobDescription}

## Resume:
${resume}

## Instructions:
1. Calculate an accurate fit percentage (0-100) based on skills, experience, and role alignment.
2. List matching skills (short labels only: 2-6 words each, no long sentences or parentheticals).
3. List missing or weak skills (short labels only: 2-6 words each).
4. Highlight key strengths for this role (one concise sentence each).
5. Suggest specific areas to improve (one concise sentence each).
6. Write a brief, honest summary of overall fit.
7. Build tailoredResume as structured JSON for a clean, professional one-page CV:
   - fullName: candidate name from the resume
   - headline: target job title aligned with the job description
   - contactLine: email, phone, city, LinkedIn (pipe-separated, one line)
   - summary: 2-3 tight sentences tailored to this role
   - experience: most relevant roles first; each entry has role, organization, period (e.g. "Jan 2020 – Present"), and 2-4 achievement bullets starting with strong verbs and metrics where possible
   - skills: 8-14 concise skill labels, job-relevant, no long sentences
   - education: degree, institution, optional period
   - Use only facts from the original resume. Do not invent employers, degrees, or dates.
   - Keep content dense enough to fit one printed page.
8. Write a professional cover letter tailored to this job.

Be thorough, constructive, and specific. Do not invent experience the candidate does not have.`,
    })

    if (!result.output) {
      return Response.json(
        { error: 'Analysis could not be generated. Please try again.' },
        { status: 500 },
      )
    }

    return Response.json(result.output)
  } catch (error) {
    console.error('Analyze API error:', error)
    const message =
      error instanceof Error ? error.message : 'Analysis failed. Please try again.'
    return Response.json({ error: message }, { status: 500 })
  }
}
