export const maxDuration = 30

interface PDLPerson {
  full_name: string | null
  job_title: string | null
  linkedin_url: string | null
}

interface PDLSearchResponse {
  status: number
  data: PDLPerson[]
  total: number
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.PDL_API_KEY?.trim()
    if (!apiKey) {
      return Response.json(
        {
          error:
            'PDL_API_KEY is missing or empty. Add PDL_API_KEY=your-key to .env.local, then restart the dev server.',
        },
        { status: 500 },
      )
    }

    const { companyName } = await req.json()

    if (!companyName?.trim()) {
      return Response.json({ error: 'companyName is required' }, { status: 400 })
    }

    const query = {
      query: {
        bool: {
          must: [
            {
              term: { job_company_name: companyName.toLowerCase() },
            },
          ],
          should: [
            { match: { job_title: 'customer service' } },
            { match: { job_title: 'customer experience' } },
            { match: { job_title: 'cx' } },
            { match: { job_title: 'support' } },
            { match: { job_title: 'operations' } },
          ],
          minimum_should_match: 1,
        },
      },
      size: 5,
    }

    const response = await fetch('https://api.peopledatalabs.com/v5/person/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify(query),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('PDL API error:', response.status, errorBody)
      return Response.json(
        { error: `People Data Labs API returned ${response.status}. Please try again.` },
        { status: 502 },
      )
    }

    const pdlData: PDLSearchResponse = await response.json()

    const people = (pdlData.data ?? [])
      .filter((p) => p.full_name)
      .slice(0, 5)
      .map((p) => ({
        fullName: p.full_name,
        jobTitle: p.job_title ?? 'Unknown title',
        linkedinUrl: p.linkedin_url ?? null,
      }))

    return Response.json({ people })
  } catch (error) {
    console.error('Find people API error:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to find people. Please try again.'
    return Response.json({ error: message }, { status: 500 })
  }
}
