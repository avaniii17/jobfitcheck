import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
    if (!apiKey) {
      return Response.json(
        {
          error:
            'ANTHROPIC_API_KEY is missing or empty. Add ANTHROPIC_API_KEY=your-key to .env.local, then restart the dev server.',
        },
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

    const result = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      prompt: `You are a warm, thoughtful professional writing a cold LinkedIn DM to someone you've never met. Write exactly 4 lines (separated by line breaks).

## About the recipient:
- Name: ${personName}
- Title: ${personTitle ?? 'unknown'}
- Company: ${companyName}
- What the company does: ${companyDescription ?? 'not specified'}

## Context:
The sender is exploring opportunities in this space. Here is a summary of the job/role area they are interested in:
${jdSummary ?? 'Not specified'}

## Rules:
1. Line 1: A genuine, specific opener that references their role at ${companyName} — show you actually looked them up.
2. Line 2: Connect to a likely pain point or challenge someone in their position at ${companyName} would face. Be specific, not generic.
3. Line 3: Briefly mention the sender is exploring this space and genuinely curious to learn from practitioners like them.
4. Line 4: End with a soft, low-pressure CTA. Do NOT say "hop on a call", "schedule a chat", or anything that sounds like a meeting request. Instead, ask a thoughtful question or invite them to share their perspective.

## Tone guidelines:
- Warm and peer-to-peer, like a curious colleague — not a salesperson
- No flattery, no buzzwords, no corporate speak
- No emojis
- No subject line — this is a LinkedIn DM, not an email
- Output ONLY the 4-line message, nothing else`,
    })

    return Response.json({ message: result.text.trim() })
  } catch (error) {
    console.error('Draft outreach API error:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to draft outreach. Please try again.'
    return Response.json({ error: message }, { status: 500 })
  }
}
