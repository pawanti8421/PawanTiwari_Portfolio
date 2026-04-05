# Pawan Tiwari — Developer Portfolio

A premium, highly interactive developer portfolio built with React + Vite + JavaScript.

## 🚀 Tech Stack

| Layer       | Technology                            |
|-------------|---------------------------------------|
| Framework   | React 18 + Vite 5                     |
| Language    | JavaScript                            |
| Styling     | CSS Custom Properties (design tokens) |
| Fonts       | Fraunces · IBM Plex Mono · Plus Jakarta Sans |
| Icons       | Lucide React                          |
| Canvas      | HTML5 Canvas API (orbital animation)  |
| Contact     | EmailJS                               |

## 📁 Folder Structure

```
pawan-portfolio/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.tsx                  ← Root with lazy loading
│   ├── main.tsx                 ← Entry point
│   ├── types/
│   │   └── index.ts             ← All JavaScript interfaces
│   ├── data/                    ← JSON-structured data files
│   │   ├── personal.ts
│   │   ├── skills.ts
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   ├── terminal.ts
│   │   ├── github.ts
│   │   └── index.ts
│   ├── hooks/                   ← Custom React hooks
│   │   ├── useInView.ts
│   │   ├── useCounter.ts
│   │   ├── useScrollProgress.ts
│   │   ├── useTypewriter.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── helpers.ts
│   │   └── index.ts
│   ├── styles/
│   │   └── globals.css          ← Design tokens + global styles
│   ├── components/              ← Shared UI components
│   │   ├── Cursor/
│   │   ├── ScrollBar/
│   │   ├── Loader/
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   └── index.ts
│   └── sections/                ← Page sections (lazy loaded)
│       ├── Hero/
│       │   ├── Hero.tsx
│       │   ├── HeroCanvas.tsx
│       │   └── index.ts
│       ├── About/
│       │   ├── About.tsx
│       │   ├── StatCard.tsx
│       │   └── index.ts
│       ├── Skills/
│       │   ├── Skills.tsx
│       │   ├── SkillBar.tsx
│       │   └── index.ts
│       ├── Experience/
│       ├── Projects/
│       │   ├── Projects.tsx
│       │   ├── ProjectCard.tsx
│       │   └── index.ts
│       ├── Terminal/
│       ├── GitHub/
│       ├── Resume/
│       ├── Contact/
│       └── index.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── .gitignore
```

## 🛠️ Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env
# Fill in your EmailJS credentials in .env

# 3. Start dev server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

## 🔌 EmailJS Setup

1. Create account at [emailjs.com](https://www.emailjs.com)
2. Create an email service
3. Create an email template
4. Add your credentials to `.env`
5. In `src/sections/Contact/Contact.tsx`, replace the `setTimeout` mock with:

```typescript
import emailjs from '@emailjs/browser'

emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  { from_name: form.name, from_email: form.email, message: form.message },
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
)
```

## 🎨 Customizing Content

All content lives in `src/data/`. Edit these files to update your portfolio:

| File              | Content                    |
|-------------------|----------------------------|
| `personal.ts`     | Name, bio, links, contact  |
| `skills.ts`       | Skills by category         |
| `experience.ts`   | Work experience            |
| `projects.ts`     | Project showcase           |
| `terminal.ts`     | Terminal command responses |
| `github.ts`       | GitHub stats & repo cards  |

## 📦 Adding EmailJS Package

```bash
npm install @emailjs/browser
```

## 🚀 Deployment

```bash
# Vercel (recommended)
npm i -g vercel
vercel --prod

# Netlify
npm run build
# Upload dist/ to Netlify
```

---

Built with ❤️ for Pawan Tiwari
