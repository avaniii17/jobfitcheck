import { GoogleGenerativeAI } from '@google/generative-ai'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()
    if (!apiKey) {
      return Response.json(
        { error: 'GOOGLE_GENERATIVE_AI_API_KEY is missing or empty.' },
        { status: 500 },
      )
    }

    const { personName, personTitle, companyName, companyDescription, jdSummary } =
      await req.json()

    if (!personName?.trim() || !companyName?.trim()) {
      return Response.json(
        { error: 'personName and companyName are required' },
        { status: 400 },
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const prompt = `You are a warm, thoughtful professional writing a cold LinkedIn DM to someone you've never met. Write exactly 4 lines (separated by line breaks).

About the recipient:
- Name: ${personName}
- Title: ${personTitle ?? 'unknown'}
- Company: ${companyName}
- What the company does: ${companyDescription ?? 'not specified'}

Context:
The sender is exploring opportunities in this space. Here is a summary of the job/role area they are interested in:
${jdSummary ?? 'Not specified'}

Rules:
1. Line 1: A genuine, specific opener that references their role at ${companyName}
2. Line 2: Connect to a likely pain point someone in their position at ${companyName} would face
3. Line 3: Mention the sender is exploring this space and curious to learn from practitioners like them
4. Line 4: End with a soft low-pressure CTA — ask a thoughtful question, NOT "hop on a call"

Tone: Warm and peer-to-peer, not salesy. No flattery, no buzzwords, no emojis, no subject line.
Output ONLY the 4-line message, nothing else.`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    return Response.json({ message: text })
  } catch (error) {
    console.error('Draft outreach API error:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to draft outreach. Please try again.'
    return Response.json({ error: message }, { status: 500 })
  }
}