'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Mail, Copy, Check, Download } from 'lucide-react'
import { downloadResumePdf } from '@/lib/download-resume-pdf'
import { resumeToPlainText } from '@/lib/resume-text'
import { ResumePreview } from '@/components/resume-preview'
import type { TailoredResume } from '@/lib/analysis-schema'

interface GeneratedDocumentsProps {
  tailoredResume: TailoredResume
  coverLetter: string
}

export function GeneratedDocuments({ tailoredResume, coverLetter }: GeneratedDocumentsProps) {
  const [copiedResume, setCopiedResume] = useState(false)
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false)
  const plainResume = resumeToPlainText(tailoredResume)

  const copyToClipboard = async (text: string, type: 'resume' | 'coverLetter') => {
    await navigator.clipboard.writeText(text)
    if (type === 'resume') {
      setCopiedResume(true)
      setTimeout(() => setCopiedResume(false), 2000)
    } else {
      setCopiedCoverLetter(true)
      setTimeout(() => setCopiedCoverLetter(false), 2000)
    }
  }

  const downloadAsText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl">Your Tailored Resume</CardTitle>
        <CardDescription>
          Professionally formatted for this role — preview, download PDF, or copy text
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resume" className="gap-2">
              <FileText className="h-4 w-4" />
              Tailored Resume
            </TabsTrigger>
            <TabsTrigger value="cover-letter" className="gap-2">
              <Mail className="h-4 w-4" />
              Cover Letter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => downloadResumePdf(tailoredResume)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(plainResume, 'resume')}
                className="gap-2"
              >
                {copiedResume ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy text
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadAsText(plainResume, 'tailored-resume.txt')}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download .txt
              </Button>
            </div>
            <div className="max-h-[640px] overflow-auto rounded-lg border border-border bg-slate-100/80 p-4 dark:bg-slate-900/50">
              <ResumePreview resume={tailoredResume} />
            </div>
          </TabsContent>

          <TabsContent value="cover-letter" className="mt-4 space-y-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(coverLetter, 'coverLetter')}
                className="gap-2"
              >
                {copiedCoverLetter ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadAsText(coverLetter, 'cover-letter.txt')}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
            <div className="max-h-[500px] overflow-auto rounded-lg border border-border bg-white px-8 py-10 shadow-sm dark:bg-slate-950">
              <div className="mx-auto max-w-2xl whitespace-pre-wrap text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
                {coverLetter}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
