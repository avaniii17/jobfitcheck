export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const apiKey = process.env.PDL_API_KEY?.trim()
    if (!apiKey) {
      return Response.json(
        { error: 'PDL_API_KEY is missing or empty.' },
        { status: 500 },
      )
    }

    const { companyName } = await req.json()

    if (!companyName?.trim()) {
      return Response.json({ error: 'companyName is required' }, { status: 400 })
    }

    const esQuery = {
      query: {
        bool: {
          must: [
            { term: { job_company_name: companyName.toLowerCase() } }
          ]
        }
      }
    }

    const params = new URLSearchParams({
      query: JSON.stringify(esQuery),
      size: '5',
      pretty: 'true',
    })

    const response = await fetch(
      `https://api.peopledatalabs.com/v5/person/search?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'X-Api-Key': apiKey,
        },
      }
    )

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('PDL API error:', response.status, errorBody)
      return Response.json(
        { error: `People Data Labs API returned ${response.status}. Please try again.` },
        { status: 502 },
      )
    }

    const pdlData = await response.json()

    const people = (pdlData.data ?? [])
      .filter((p: any) => p.full_name)
      .slice(0, 5)
      .map((p: any) => ({
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