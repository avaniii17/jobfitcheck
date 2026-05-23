import { z } from 'zod'

export const tailoredResumeSchema = z.object({
  fullName: z.string(),
  headline: z.string(),
  contactLine: z.string(),
  summary: z.string(),
  experience: z.array(
    z.object({
      role: z.string(),
      organization: z.string(),
      period: z.string(),
      highlights: z.array(z.string()),
    }),
  ),
  skills: z.array(z.string()),
  education: z.array(
    z.object({
      credential: z.string(),
      institution: z.string(),
      period: z.string().optional(),
    }),
  ),
})

export const analysisSchema = z.object({
  fitPercentage: z.number().min(0).max(100),
  matchingSkills: z.array(z.string().max(80)),
  missingSkills: z.array(z.string().max(80)),
  keyStrengths: z.array(z.string()),
  areasToImprove: z.array(z.string()),
  summary: z.string(),
  tailoredResume: tailoredResumeSchema,
  coverLetter: z.string(),
})

export type TailoredResume = z.infer<typeof tailoredResumeSchema>
export type AnalysisResult = z.infer<typeof analysisSchema>
