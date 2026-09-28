# Md. Modabbir Hossain Mahin - Personal Academic Portfolio

A modern, maintainable, content-driven academic portfolio built for university lecturer applications and research showcases. Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Zod** schema validation.

---

## 🚀 Quick Start (Run Locally)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hedonistmahin/mahin-portfolio.git
   cd mahin-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Type-check and lint:**
   ```bash
   npm run type-check
   npm run lint
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📝 HOW TO EDIT & EXTEND CONTENT

All portfolio content lives in the `content/` directory as JSON or MDX files. All JSON content is strictly validated with **Zod** at build time.

### 1. Section Registry & Navbar Driving
Open `src/config/sections.ts`. The order, visibility, route links, and interactive SVG pathway nodes are driven by this single configuration file:
```ts
export const SECTION_REGISTRY: SectionConfig[] = [
  { id: 'about', title: 'About', component: 'AboutSection', enabled: true, order: 1 },
  { id: 'education', title: 'Education', component: 'EducationSection', enabled: true, order: 2 },
  { id: 'research', title: 'Research', component: 'PublicationsSection', enabled: true, order: 3 },
  // Adding or disabling a section automatically updates the Navbar links, 'More' dropdown, and continuous SVG scroll path nodes.
]
```

### 2. How to Add a Blog Post (MDX)
Create a new `.mdx` file in `content/blog/`, for example `content/blog/my-new-post.mdx`:
```mdx
---
title: "Explainable AI in Clinical Risk Stratification"
date: "2026-10-15"
excerpt: "Key takeaways from deploying differential privacy and SHAP in healthcare ML."
tags: ["Explainable AI", "Healthcare"]
---

# Title Here

Your markdown/MDX content goes here...
```
- The article will automatically show up at `/blog` and `/blog/my-new-post`.
- When zero articles exist in `content/blog/`, a clean empty state ("No posts yet. First article coming soon.") is rendered automatically.

### 3. How to Change or Customize Bullet Icons
Achievement items in `content/experience.json` accept optional Lucide icon names:
```json
{
  "period": "2025 to present",
  "role": "President, SUB Computing Club",
  "highlights": [
    {
      "text": "Lead and coordinate 30+ active members in academic and technical activities",
      "icon": "Users"
    },
    {
      "text": "Organized workshops and seminars on AI",
      "icon": "Presentation"
    }
  ]
}
```
Available icon names mapped include: `Users`, `Presentation`, `GraduationCap`, `Trophy`, `BookOpen`, `MessagesSquare`, `Megaphone`, `Handshake`. If `icon` is omitted, it defaults safely to `CheckCircle2`.

### 4. Add a Publication
Open `content/publications.json` and append a new publication object to the array:
```json
{
  "title": "Your New Paper Title Here",
  "venue": "IEEE Conference 2026",
  "year": 2026,
  "status": "indexed", // Options: "indexed" | "accepted" | "under-review"
  "tags": ["Explainable AI", "Healthcare"]
}
```

---

## 🎨 How to Change Theme Colors

All colors, glass gradients, and theme tokens are centralized in CSS variables in `src/app/globals.css`:
```css
:root {
  --deep: #04161c;    /* Deep background color */
  --green: #3ddc97;   /* Primary accent green */
  --orange: #ff8a3d;  /* Secondary accent orange */
  --foam: #e9fbf5;    /* Light text & highlights */
  --mute: #9fbdb8;    /* Subtitle & muted text */
  --ink: #e6f4f0;     /* Body text color */
}
```

---

## ☁️ How to Deploy to Vercel

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Updated portfolio system"
   git remote add origin https://github.com/hedonistmahin/mahin-portfolio.git
   git push -u origin main
   ```

2. Log into [Vercel](https://vercel.com).
3. Click **"Add New..."** → **"Project"**.
4. Import your GitHub repository (`mahin-portfolio`).
5. Select **Next.js** as the Framework Preset and click **"Deploy"**.
