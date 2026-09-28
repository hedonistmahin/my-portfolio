import {
  Users,
  Presentation,
  GraduationCap,
  Trophy,
  BookOpen,
  MessageSquare,
  Megaphone,
  Handshake,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Presentation,
  GraduationCap,
  Trophy,
  BookOpen,
  MessagesSquare: MessageSquare,
  MessageSquare,
  Megaphone,
  Handshake,
  CheckCircle2,
}

interface IconRendererProps {
  name?: string
  className?: string
}

export function IconRenderer({ name, className = 'w-4 h-4 text-green' }: IconRendererProps) {
  const IconComponent = (name && ICON_MAP[name]) || CheckCircle2
  return <IconComponent className={className} />
}
