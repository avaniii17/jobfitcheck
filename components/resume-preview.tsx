import type { ReactNode } from 'react'
import type { TailoredResume } from '@/lib/analysis-schema'

interface ResumePreviewProps {
  resume: TailoredResume
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 border-b border-slate-300 pb-1 text-[11px] font-semibold tracking-[0.2em] text-slate-700 uppercase">
      {children}
    </h3>
  )
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <article className="mx-auto max-w-[210mm] bg-white px-8 py-10 text-slate-900 shadow-sm sm:px-12 sm:py-12">
      <header className="border-b border-slate-200 pb-5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {resume.fullName}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-700">{resume.headline}</p>
        <p className="mt-2 text-xs text-slate-500">{resume.contactLine}</p>
      </header>

      <section className="mt-6">
        <SectionTitle>Professional Summary</SectionTitle>
        <p className="text-[13px] leading-relaxed text-slate-700">{resume.summary}</p>
      </section>

      <section className="mt-6">
        <SectionTitle>Experience</SectionTitle>
        <div className="space-y-5">
          {resume.experience.map((job, i) => (
            <div key={i}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                <p className="text-[13px] font-semibold text-slate-900">{job.role}</p>
                <p className="text-xs text-slate-500">{job.period}</p>
              </div>
              <p className="text-xs font-medium text-slate-600">{job.organization}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {job.highlights.map((bullet, j) => (
                  <li key={j} className="text-[12px] leading-relaxed text-slate-700">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <SectionTitle>Skills</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {resume.skills.map((skill, i) => (
            <span
              key={i}
              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <SectionTitle>Education</SectionTitle>
        <div className="space-y-2">
          {resume.education.map((edu, i) => (
            <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-2">
              <div>
                <p className="text-[13px] font-semibold text-slate-900">{edu.credential}</p>
                <p className="text-xs text-slate-600">{edu.institution}</p>
              </div>
              {edu.period && <p className="text-xs text-slate-500">{edu.period}</p>}
            </div>
          ))}
        </div>
      </section>
    </article>
  )
}
