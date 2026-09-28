'use client'

import { useState } from 'react'
import Image from 'next/image'

interface DropletPhotoProps {
  src: string
  alt: string
  initials: string
}

export function DropletPhoto({ src, alt, initials }: DropletPhotoProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="drop" role="img" aria-label={alt}>
      <span aria-hidden="true">{initials}</span>
      {!imageError && (
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 820px) 78vw, 340px"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  )
}
