import type { TailoredResume } from '@/lib/analysis-schema'

/** Plain-text version for clipboard export. */
export function resumeToPlainText(resume: TailoredResume): string {
  const lines: string[] = [
    resume.fullName,
    resume.headline,
    resume.contactLine,
    '',
    'PROFESSIONAL SUMMARY',
    resume.summary,
    '',
    'EXPERIENCE',
  ]

  for (const job of resume.experience) {
    lines.push(`${job.role} | ${job.organization} | ${job.period}`)
    for (const bullet of job.highlights) {
      lines.push(`• ${bullet}`)
    }
    lines.push('')
  }

  lines.push('SKILLS', resume.skills.join(' • '), '')

  lines.push('EDUCATION')
  for (const edu of resume.education) {
    const period = edu.period ? ` | ${edu.period}` : ''
    lines.push(`${edu.credential} | ${edu.institution}${period}`)
  }

  return lines.join('\n').trim()
}
