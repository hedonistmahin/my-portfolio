import { IconRenderer } from '@/components/ui/IconRenderer'
import { cn } from '@/lib/utils'

export interface TimelineHighlight {
  text: string
  icon?: string
}

export interface TimelineItem {
  period: string
  title: string
  subtitle?: string
  details?: string
  highlights?: (string | TimelineHighlight)[]
}

interface TimelineProps {
  items: TimelineItem[]
  variant?: 'green' | 'orange'
  className?: string
}

export function Timeline({ items, variant = 'green', className }: TimelineProps) {
  return (
    <ul className={cn('tl', variant === 'orange' && 'or', className)}>
      {items.map((item, index) => (
        <li key={index} className="timeline-entry mb-[20px] last:mb-0">
          <span className="when">{item.period}</span>
          <h3>{item.title}</h3>
          {item.subtitle && <p className="subtitle">{item.subtitle}</p>}
          {item.details && <p className="details">{item.details}</p>}

          {item.highlights && item.highlights.length > 0 && (
            <ul className="achievement-list mt-3.5 flex flex-col gap-[10px] list-none p-0 m-0">
              {item.highlights.map((highlight, idx) => {
                const text = typeof highlight === 'string' ? highlight : highlight.text
                const icon = typeof highlight === 'string' ? undefined : highlight.icon

                return (
                  <li
                    key={idx}
                    className="achievement-item flex items-start p-0 m-0 border-0 bg-transparent"
                  >
                    <span className="w-6 min-w-[24px] max-w-[24px] flex-none flex items-center pt-[3px]">
                      <IconRenderer
                        name={icon}
                        className={
                          variant === 'orange'
                            ? 'w-[18px] h-[18px] text-orange flex-none'
                            : 'w-[18px] h-[18px] text-green flex-none'
                        }
                      />
                    </span>
                    <span className="text-mute text-[0.96rem] leading-[1.55] flex-1">
                      {text}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}
