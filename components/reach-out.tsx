'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Users,
  Linkedin,
  MessageSquarePlus,
  Copy,
  Check,
  ExternalLink,
  Search,
} from 'lucide-react'

interface Person {
  fullName: string
  jobTitle: string
  linkedinUrl: string | null
}

interface ReachOutProps {
  companyName: string
  companyDescription: string
  jdSummary: string
}

export function ReachOut({ companyName, companyDescription, jdSummary }: ReachOutProps) {
  const [people, setPeople] = useState<Person[]>([])
  const [findLoading, setFindLoading] = useState(false)
  const [findError, setFindError] = useState<string | null>(null)
  const [hasFetched, setHasFetched] = useState(false)

  // Track draft state per person index
  const [drafts, setDrafts] = useState<Record<number, string>>({})
  const [draftLoading, setDraftLoading] = useState<Record<number, boolean>>({})
  const [draftErrors, setDraftErrors] = useState<Record<number, string>>({})
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleFindPeople = async () => {
    setFindLoading(true)
    setFindError(null)
    setPeople([])
    setHasFetched(false)
    setDrafts({})
    setDraftLoading({})
    setDraftErrors({})

    try {
      const response = await fetch('/api/find-people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to find people. Please try again.')
      }

      setPeople(data.people ?? [])
      setHasFetched(true)
    } catch (err) {
      setFindError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setFindLoading(false)
    }
  }

  const handleDraftMessage = async (person: Person, index: number) => {
    setDraftLoading((prev) => ({ ...prev, [index]: true }))
    setDraftErrors((prev) => {
      const next = { ...prev }
      delete next[index]
      return next
    })

    try {
      const response = await fetch('/api/draft-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personName: person.fullName,
          personTitle: person.jobTitle,
          companyName,
          companyDescription,
          jdSummary,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to draft message.')
      }

      setDrafts((prev) => ({ ...prev, [index]: data.message }))
    } catch (err) {
      setDraftErrors((prev) => ({
        ...prev,
        [index]: err instanceof Error ? err.message : 'An error occurred',
      }))
    } finally {
      setDraftLoading((prev) => ({ ...prev, [index]: false }))
    }
  }

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-bold">Reach Out</h2>

      {/* Find button */}
      {!hasFetched && (
        <div className="flex justify-center">
          <Button
            id="find-decision-makers-btn"
            size="lg"
            onClick={handleFindPeople}
            disabled={findLoading}
            className="gap-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-blue-500/30"
          >
            {findLoading ? (
              <>
                <Spinner className="h-5 w-5" />
                Searching…
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Find Decision-Makers at {companyName}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Error */}
      {findError && (
        <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
          {findError}
        </div>
      )}

      {/* No results */}
      {hasFetched && people.length === 0 && !findError && (
        <Card className="mt-4 border-border/50 bg-card/50">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Users className="mx-auto mb-3 h-8 w-8 opacity-50" />
            <p>No matching contacts found at {companyName}.</p>
            <p className="mt-1 text-sm">Try refining the company name or check back later.</p>
          </CardContent>
        </Card>
      )}

      {/* People cards */}
      {people.length > 0 && (
        <div className="mt-6 space-y-4">
          {/* Re-search button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFindPeople}
              disabled={findLoading}
              className="gap-2"
            >
              {findLoading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Searching…
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search Again
                </>
              )}
            </Button>
          </div>

          {people.map((person, index) => (
            <Card
              key={index}
              className="border-border/50 bg-card/50 backdrop-blur transition-all hover:border-border/80"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                        <Users className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="truncate">{person.fullName}</span>
                    </CardTitle>
                    <p className="pl-10 text-sm text-muted-foreground">{person.jobTitle}</p>
                  </div>
                  {person.linkedinUrl && (
                    <a
                      href={person.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-500/20"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                      LinkedIn
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                {/* Draft Message button */}
                {!drafts[index] && (
                  <Button
                    id={`draft-message-btn-${index}`}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDraftMessage(person, index)}
                    disabled={draftLoading[index]}
                    className="gap-2"
                  >
                    {draftLoading[index] ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        Drafting…
                      </>
                    ) : (
                      <>
                        <MessageSquarePlus className="h-4 w-4" />
                        Draft Message
                      </>
                    )}
                  </Button>
                )}

                {/* Draft error */}
                {draftErrors[index] && (
                  <p className="text-sm text-destructive">{draftErrors[index]}</p>
                )}

                {/* Draft result */}
                {drafts[index] && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Draft LinkedIn DM
                      </p>
                      <Button
                        id={`copy-draft-btn-${index}`}
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(drafts[index], index)}
                        className="h-7 gap-1.5 px-2.5 text-xs"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <textarea
                      id={`draft-textarea-${index}`}
                      readOnly
                      value={drafts[index]}
                      rows={6}
                      className="w-full resize-none rounded-lg border border-border bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 focus:outline-none dark:bg-slate-950 dark:text-slate-300"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDraftMessage(person, index)}
                      disabled={draftLoading[index]}
                      className="gap-2 text-xs text-muted-foreground"
                    >
                      {draftLoading[index] ? (
                        <>
                          <Spinner className="h-3.5 w-3.5" />
                          Regenerating…
                        </>
                      ) : (
                        <>
                          <MessageSquarePlus className="h-3.5 w-3.5" />
                          Regenerate
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
