import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BaseButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'glass'
  className?: string
  href?: string
  download?: boolean | string
}

type LinkProps = BaseButtonProps & AnchorHTMLAttributes<HTMLAnchorElement>
type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: LinkProps | NativeButtonProps) {
  const { children, variant = 'primary', className, href, download, ...rest } = props
  const baseClass = cn('btn', variant === 'primary' ? 'pri' : 'gl', className)

  if (href) {
    return (
      <a
        href={href}
        download={download}
        className={baseClass}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }

  return (
    <button className={baseClass} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
