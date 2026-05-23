'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SkillList } from '@/components/skill-list'
import { CheckCircle2, XCircle, TrendingUp, AlertCircle } from 'lucide-react'

import type { AnalysisResult } from '@/lib/analysis-schema'

interface FitAnalysisProps {
  result: AnalysisResult
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-yellow-400'
  if (score >= 40) return 'text-orange-400'
  return 'text-red-400'
}

function getProgressColor(score: number) {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-yellow-500'
  if (score >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}

function ScoreProgress({ value }: { value: number }) {
  return (
    <div className="h-3 w-full max-w-md overflow-hidden rounded-full bg-muted">
      <div 
        className={`h-full transition-all duration-500 ${getProgressColor(value)}`}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export function FitAnalysis({ result }: FitAnalysisProps) {
  return (
    <div className="space-y-6">
      {/* Fit Score */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-lg">Job Fit Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className={`text-6xl font-bold ${getScoreColor(result.fitPercentage)}`}>
              {result.fitPercentage}%
            </div>
            <ScoreProgress value={result.fitPercentage} />
            <p className="max-w-lg text-center text-muted-foreground">
              {result.summary}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid min-w-0 gap-6 md:grid-cols-2">
        {/* Matching Skills */}
        <Card className="min-w-0 overflow-hidden border-green-500/30 bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              Matching Skills
            </CardTitle>
            <CardDescription>
              Skills you have that match the job requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            <SkillList
              skills={result.matchingSkills}
              tone="match"
              emptyMessage="No direct skill matches found"
            />
          </CardContent>
        </Card>

        {/* Missing Skills */}
        <Card className="min-w-0 overflow-hidden border-red-500/30 bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="h-5 w-5 text-red-400" />
              Skills to Develop
            </CardTitle>
            <CardDescription>
              Required skills that could strengthen your application
            </CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            <SkillList
              skills={result.missingSkills}
              tone="gap"
              emptyMessage="You have all the required skills!"
            />
          </CardContent>
        </Card>

        {/* Key Strengths */}
        <Card className="min-w-0 overflow-hidden border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Key Strengths
            </CardTitle>
            <CardDescription>
              Your strongest qualifications for this role
            </CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            <ul className="space-y-2">
              {result.keyStrengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-2 text-sm break-words">
                  <span className="mt-1 shrink-0 text-primary">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Areas to Improve */}
        <Card className="min-w-0 overflow-hidden border-yellow-500/30 bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              Areas to Improve
            </CardTitle>
            <CardDescription>
              Suggestions to strengthen your application
            </CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            <ul className="space-y-2">
              {result.areasToImprove.map((area, i) => (
                <li key={i} className="flex items-start gap-2 text-sm break-words">
                  <span className="mt-1 shrink-0 text-yellow-400">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
