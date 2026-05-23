import { generateText, Output } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { analysisSchema } from '@/lib/analysis-schema'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        {
          error:
            'ANTHROPIC_API_KEY is not set. Create a .env.local file with your Anthropic API key and restart the dev server.',
        },
        { status: 500 },
      )
    }

    const { jobDescription, resume } = await req.json()

    if (!jobDescription?.trim() || !resume?.trim()) {
      return Response.json({ error: 'Job description and resume are required' }, { status: 400 })
    }

    const result = await generateText({
      model: anthropic('claude-sonnet-4-6'),
      output: Output.object({ schema: analysisSchema }),
      prompt: `You are an expert HR consultant and career coach. Analyze the resume against the job description.

## Job Description:
${jobDescription}

## Resume:
${resume}

## Instructions:
1. Calculate an accurate fit percentage (0-100) based on skills, experience, and role alignment.
2. List matching skills between the resume and job description.
3. List required skills from the job that are missing or weak in the resume.
4. Highlight key strengths for this role.
5. Suggest specific areas to improve.
6. Write a brief, honest summary of overall fit.
7. Create a tailored ONE-PAGE resume for this exact job:
   - Reorder and emphasize the most relevant experience and skills first.
   - Use concise bullet points; remove irrelevant details.
   - Plain text only (no markdown). Sections: Name & target role, contact placeholders, Professional Summary, Experience, Skills, Education.
   - Must fit on a single printed page when using a standard font size.
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
