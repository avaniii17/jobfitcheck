'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Mail, Copy, Check, Download } from 'lucide-react'
import { downloadResumePdf } from '@/lib/download-resume-pdf'

interface GeneratedDocumentsProps {
  tailoredResume: string
  coverLetter: string
}

export function GeneratedDocuments({ tailoredResume, coverLetter }: GeneratedDocumentsProps) {
  const [copiedResume, setCopiedResume] = useState(false)
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false)

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
          Optimized for this job — download the one-page PDF or copy the text
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
                Download PDF (1 page)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(tailoredResume, 'resume')}
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
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadAsText(tailoredResume, 'tailored-resume.txt')}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download .txt
              </Button>
            </div>
            <div className="max-h-[500px] overflow-auto rounded-lg border border-border bg-background/50 p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {tailoredResume}
              </pre>
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
            <div className="max-h-[500px] overflow-auto rounded-lg border border-border bg-background/50 p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {coverLetter}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
