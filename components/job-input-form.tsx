'use client'

import { useState, useRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2, FileText, Briefcase, Sparkles, Upload, X, HardDrive } from 'lucide-react'

interface JobInputFormProps {
  onAnalyze: (jobDescription: string, resume: string) => void
  isLoading: boolean
}

export function JobInputForm({ onAnalyze, isLoading }: JobInputFormProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [resume, setResume] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (jobDescription.trim() && resume.trim()) {
      onAnalyze(jobDescription, resume)
    }
  }

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const pdfjsLib = await import('pdfjs-dist')

    // pdf.js v5 requires the .mjs worker (bundled in /public, synced on postinstall)
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise
    
    let fullText = ''
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
      fullText += pageText + '\n\n'
    }
    
    return fullText.trim()
  }

  const handleFileUpload = async (file: File) => {
    const isPdf = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setUploadError('Please upload a PDF file')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const text = await extractTextFromPdf(file)
      
      if (!text.trim()) {
        setUploadError('Could not extract text from PDF. Please paste your resume manually.')
        return
      }
      
      setResume(text)
      setUploadedFileName(file.name)
    } catch (error) {
      console.error('PDF parsing error:', error)
      setUploadError('Failed to parse PDF. Please try again or paste your resume manually.')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const clearUploadedFile = () => {
    setUploadedFileName(null)
    setResume('')
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openGoogleDrive = () => {
    window.open('https://drive.google.com', '_blank')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="h-5 w-5 text-primary" />
              Job Description
            </CardTitle>
            <CardDescription>
              Paste the full job posting or key requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="job-description" className="sr-only">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here...

Example:
- Job Title: Senior Software Engineer
- Requirements: 5+ years experience in React, Node.js
- Responsibilities: Lead development team, architect solutions..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[300px] resize-none bg-background/50 font-mono text-sm"
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-accent" />
              Your Resume
            </CardTitle>
            <CardDescription>
              Upload a PDF or paste your resume content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Section */}
            <div
              role="button"
              tabIndex={0}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !uploadedFileName && !isUploading && fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !uploadedFileName && !isUploading) {
                  e.preventDefault()
                  fileInputRef.current?.click()
                }
              }}
              className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
              } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Extracting text from PDF...</p>
                </div>
              ) : uploadedFileName ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{uploadedFileName}</span>
                    <button
                      type="button"
                      onClick={clearUploadedFile}
                      className="ml-2 rounded-full p-1 hover:bg-destructive/20"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Resume uploaded successfully</p>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">
                    Drag and drop your resume PDF here
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    or use the buttons below
                  </p>
                </>
              )}
            </div>

            {/* Upload Buttons */}
            {!uploadedFileName && (
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isLoading}
                >
                  <Upload className="h-4 w-4" />
                  Local File
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={openGoogleDrive}
                  disabled={isUploading || isLoading}
                >
                  <HardDrive className="h-4 w-4" />
                  Google Drive
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <p className="text-sm text-destructive">{uploadError}</p>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or paste manually</span>
              </div>
            </div>

            {/* Manual Input */}
            <div className="space-y-2">
              <Label htmlFor="resume" className="sr-only">Resume</Label>
              <Textarea
                id="resume"
                placeholder="Paste your resume here...

Example:
John Doe
Software Engineer

Experience:
- Company XYZ (2020-Present): Built scalable web apps
- Company ABC (2018-2020): Full-stack development..."
                value={resume}
                onChange={(e) => {
                  setResume(e.target.value)
                  if (uploadedFileName) {
                    setUploadedFileName(null)
                  }
                }}
                className="min-h-[180px] resize-none bg-background/50 font-mono text-sm"
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          disabled={!jobDescription.trim() || !resume.trim() || isLoading}
          className="min-w-[200px] gap-2 bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze Fit
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
