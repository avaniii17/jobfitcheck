'use client'

import { useState } from 'react'
import { JobInputForm } from '@/components/job-input-form'
import { FitAnalysis } from '@/components/fit-analysis'
import { GeneratedDocuments } from '@/components/generated-documents'
import { ReachOut } from '@/components/reach-out'
import { Sparkles, Zap, FileText, Target } from 'lucide-react'
import type { AnalysisResult } from '@/lib/analysis-schema'

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (jobDescription: string, resume: string) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobDescription, resume }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to analyze. Please try again.')
      }

      if (typeof data.fitPercentage !== 'number') {
        throw new Error('Invalid analysis response. Please try again.')
      }

      setResult(data as AnalysisResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-primary/5 to-transparent pb-16 pt-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              Powered by Google Gemini
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Know Your{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Job Fit
              </span>{' '}
              Instantly
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
              Paste your resume and job description to get a fit percentage, skills breakdown,
              a one-page tailored resume, and a downloadable PDF ready for this job.
            </p>
          </div>

          {/* Features */}
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/30 p-4 backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Fit Analysis</p>
                <p className="text-sm text-muted-foreground">Match percentage</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/30 p-4 backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Tailored Resume</p>
                <p className="text-sm text-muted-foreground">1-page PDF download</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/30 p-4 backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20">
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="font-medium">Cover Letter</p>
                <p className="text-sm text-muted-foreground">Ready to send</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Input Form */}
          <JobInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
              {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-12">
              <div>
                <h2 className="mb-6 text-center text-2xl font-bold">Analysis Results</h2>
                <FitAnalysis result={result} />
              </div>

              <div>
                <h2 className="mb-6 text-center text-2xl font-bold">Your Tailored Documents</h2>
                <GeneratedDocuments 
                  tailoredResume={result.tailoredResume} 
                  coverLetter={result.coverLetter} 
                />
              </div>

              {result.companyName && (
                <div>
                  <ReachOut
                    companyName={result.companyName}
                    companyDescription={result.companyDescription ?? ''}
                    jdSummary={result.summary}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>JobFit AI uses Google Gemini to analyze your job fit and generate tailored documents.</p>
        </div>
      </footer>
    </main>
  )
}
