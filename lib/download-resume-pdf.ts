import { jsPDF } from 'jspdf'
import type { TailoredResume } from '@/lib/analysis-schema'

const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const MARGIN_X = 18
const MARGIN_TOP = 16
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2

export function downloadResumePdf(resume: TailoredResume, filename = 'tailored-resume.pdf') {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = MARGIN_TOP

  const ensureSpace = (height: number) => {
    if (y + height > PAGE_HEIGHT - 14) {
      doc.addPage()
      y = MARGIN_TOP
    }
  }

  const writeLines = (
    text: string,
    fontSize: number,
    style: 'normal' | 'bold' = 'normal',
    color: [number, number, number] = [30, 41, 59],
    lineGap = 4.8,
  ) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(fontSize)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH) as string[]
    for (const line of lines) {
      ensureSpace(lineGap)
      doc.text(line, MARGIN_X, y)
      y += lineGap
    }
  }

  const sectionTitle = (title: string) => {
    ensureSpace(10)
    y += 2
    doc.setDrawColor(203, 213, 225)
    doc.setLineWidth(0.2)
    doc.line(MARGIN_X, y, MARGIN_X + CONTENT_WIDTH, y)
    y += 5
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(71, 85, 105)
    doc.text(title.toUpperCase(), MARGIN_X, y)
    y += 6
  }

  // Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(15, 23, 42)
  doc.text(resume.fullName, PAGE_WIDTH / 2, y, { align: 'center' })
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(51, 65, 85)
  doc.text(resume.headline, PAGE_WIDTH / 2, y, { align: 'center' })
  y += 6

  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  doc.text(resume.contactLine, PAGE_WIDTH / 2, y, { align: 'center' })
  y += 10

  sectionTitle('Professional Summary')
  writeLines(resume.summary, 10, 'normal', [51, 65, 85], 4.5)

  sectionTitle('Experience')
  for (const job of resume.experience) {
    ensureSpace(14)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    doc.setTextColor(15, 23, 42)
    doc.text(job.role, MARGIN_X, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text(job.period, MARGIN_X + CONTENT_WIDTH, y, { align: 'right' })
    y += 4.5

    doc.setFontSize(9.5)
    doc.setTextColor(71, 85, 105)
    doc.text(job.organization, MARGIN_X, y)
    y += 5

    for (const bullet of job.highlights) {
      const bulletLines = doc.splitTextToSize(`• ${bullet}`, CONTENT_WIDTH - 4) as string[]
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
      doc.setTextColor(51, 65, 85)
      for (const line of bulletLines) {
        ensureSpace(4.5)
        doc.text(line, MARGIN_X + 2, y)
        y += 4.5
      }
    }
    y += 2
  }

  sectionTitle('Skills')
  writeLines(resume.skills.join('  •  '), 9.5, 'normal', [51, 65, 85], 4.5)

  sectionTitle('Education')
  for (const edu of resume.education) {
    ensureSpace(10)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(15, 23, 42)
    doc.text(edu.credential, MARGIN_X, y)
    if (edu.period) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(100, 116, 139)
      doc.text(edu.period, MARGIN_X + CONTENT_WIDTH, y, { align: 'right' })
    }
    y += 4.5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(71, 85, 105)
    doc.text(edu.institution, MARGIN_X, y)
    y += 6
  }

  doc.save(filename)
}
