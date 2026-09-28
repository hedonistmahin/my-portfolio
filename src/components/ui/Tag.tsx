import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TagProps {
  children: ReactNode
  variant?: 'green' | 'orange' | 'default'
  className?: string
}

export function Tag({ children, variant = 'default', className }: TagProps) {
  return (
    <span
      className={cn(
        'tag',
        variant === 'green' && 'g',
        variant === 'orange' && 'o',
        className
      )}
    >
      {children}
    </span>
  )
}
