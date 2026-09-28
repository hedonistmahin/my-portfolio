import { cn } from '@/lib/utils'

interface FloatingChipProps {
  text: string
  positionClass: 'c1' | 'c2' | 'c3'
  className?: string
}

export function FloatingChip({ text, positionClass, className }: FloatingChipProps) {
  return (
    <div className={cn('chip glass', positionClass, className)}>
      {text}
    </div>
  )
}
