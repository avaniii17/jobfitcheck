import { cn } from '@/lib/utils'

interface SkillListProps {
  skills: string[]
  tone: 'match' | 'gap'
  emptyMessage: string
}

const toneStyles = {
  match: 'border-green-500/30 bg-green-500/15 text-green-200',
  gap: 'border-red-500/30 bg-red-500/15 text-red-200',
}

export function SkillList({ skills, tone, emptyMessage }: SkillListProps) {
  if (skills.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {skills.map((skill, i) => (
        <li
          key={`${i}-${skill.slice(0, 24)}`}
          className={cn(
            'w-full min-w-0 rounded-md border px-3 py-2 text-sm leading-snug break-words',
            toneStyles[tone],
          )}
        >
          {skill}
        </li>
      ))}
    </ul>
  )
}
