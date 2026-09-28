'use client'

import { useState } from 'react'

export function Footer() {
  const [year] = useState<number>(() => new Date().getFullYear())

  return (
    <footer>
      © <span id="y">{year}</span> Md. Modabbir Hossain Mahin
    </footer>
  )
}
