<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Syne&weight=900&size=28&pause=1000&color=1A6FE8&center=true&vCenter=true&width=700&lines=Society+for+Data+Science;BIT+Mesra+%7C+AI+Tool+Hub;Where+Code+Gets+Real" alt="SDS Typing Header" />

<br />

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**The official web platform of the Society for Data Science, BIT Mesra.**  
An AI-powered hub where students roast their code, visualize their GitHub, quiz their data science knowledge, sharpen debugging skills, and get personalized learning roadmaps — all in one dark, cinematic interface.

[🚀 Live Site](https://sds.bitmesra.in) · [🛠 AI Tools](https://sds.bitmesra.in/tools) · [🗺 Build Your Roadmap](https://sds.bitmesra.in/roadmap)

</div>

---

## ✨ What Makes This Different

Most college club websites are static brochures. **SDS is a working product.**

Every tool on this platform calls a real AI backend, pulls live data from GitHub, and returns something genuinely useful to a data science student — not lorem ipsum, not mock data, not a screenshot.

> *A student can land on this site, paste their buggy ML code, get roasted, find the bug, check their GitHub stats, and walk away with a week-by-week learning roadmap — all before their next class.*

---

## 🛠 AI Tools — The Chaos Lab

### 🔥 Roast My Code
Paste any code snippet. Receive devastation. Actually learn something.

- Gemini 2.5 Flash analyzes your code with the energy of a senior dev who's seen everything
- Returns a roast, a roast intensity score, corrected code with inline comments, and 3 key lessons
- Keeps it under 150 words — every word counts

### 👁 GitHub Cinematic
Your GitHub profile as a data story.

- Pulls live data via the GitHub API — no OAuth needed, just a username
- Language distribution as animated helix strands
- Commit activity as a mountain chart
- Top repos as a star constellation
- One-click README generator: pick a vibe (Hacker / Minimalist / Creative / Professional), a tone (Serious / Casual / Funny / Full Cringe), and get a production-ready GitHub profile README with real stats cards, shields badges, and trophies

### 🎮 Data or Cap
A true/false quiz game for data science knowledge.

- AI generates 10 fresh questions every round — no static question bank
- CAP statements are *subtly* wrong, not obviously false (the hard kind)
- Covers statistics, ML, deep learning, data engineering, and general DS concepts
- 4 difficulty levels: beginner → advanced

### 🐛 Spot the Bug
Debugging under pressure.

- AI generates realistic Python/JS code with exactly one intentional bug
- Bug types: off-by-one errors, type mismatches, shallow copy mistakes, missing returns, logic errors
- Submit your answer, get evaluated — AI tells you if you nailed it, got partial credit, or missed entirely
- Includes a full explanation of why the bug matters in real data science work

---

## 🗺 DataPath — Personalized Roadmaps

A 4-step wizard that generates a brutally honest, week-by-week learning roadmap for data science careers.

**Inputs:** Year/level → Current skills → Target role (ML Engineer / Data Scientist / etc.) → Timeline (1 month to 1 year)

**Output:**
- Readiness score (current) and projected score (after roadmap) — never inflated
- Phase-by-phase breakdown with specific topics, real resource links, build projects, and measurable milestones
- Skill gaps to close
- Target companies with "apply now" vs "apply after roadmap" indicators
- Realistic Indian market salary range
- One piece of brutally specific key advice

---

## 📋 Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Animated hero with live node network, stats, testimonials |
| Events | `/events` | Filterable event grid — upcoming and completed |
| Tools | `/tools` | The Chaos Lab — all 4 AI tools |
| Roadmap | `/roadmap` | DataPath wizard |
| Team | `/team` | Core team cards with hover reveal |
| About | `/about` | Club pillars + animated timeline since 2019 |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Vercel)                    │
│  React 19 + Vite 8 + Tailwind v4 + Framer Motion        │
│  React Router v7 (lazy-loaded pages) + Recharts          │
└────────────────────────┬────────────────────────────────┘
                         │ fetch (VITE_API_URL)
┌────────────────────────▼────────────────────────────────┐
│                     Backend (Render)                     │
│  Node.js ESM + Express                                   │
│                                                          │
│  /api/roast          → Gemini (JSON)                     │
│  /api/dataorcap      → Gemini (JSON)                     │
│  /api/spotbug        → Gemini (JSON)                     │
│  /api/readme         → Gemini (Raw Markdown)             │
│  /api/roadmap        → Gemini (JSON)                     │
│  /api/github/:user   → GitHub REST API                   │
└────────────────────────┬────────────────────────────────┘
                         │
              Google Gemini 2.5 Flash API
              GitHub REST API (unauthenticated)
```

**Key backend patterns:**
- All Gemini calls retry up to 3× with exponential backoff
- `extractJSON()` — custom fallback parser that strips markdown fences and finds the first valid JSON object in a response, making the API highly resilient to model formatting noise
- `askGemini()` for structured JSON · `askGeminiRaw()` for free-text (README only)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key ([get one free](https://aistudio.google.com))

### Backend

```bash
cd backend
npm install

# Create .env
echo "GEMINI_API_KEY=your_key_here" > .env
echo "PORT=3001" >> .env

npm run dev
# → http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install

# Create .env.local
echo "VITE_API_URL=http://localhost:3001" > .env.local

npm run dev
# → http://localhost:5173
```

---

## 📁 Project Structure

```
sds/
├── backend/
│   └── src/
│       ├── index.js          # Express app + middleware
│       ├── gemini.js         # Gemini client, retry logic, JSON extractor
│       └── routes/
│           ├── roast.js      # Code roasting
│           ├── dataorcap.js  # Quiz generation
│           ├── spotbug.js    # Bug generation + evaluation
│           ├── github.js     # GitHub profile aggregation
│           ├── readme.js     # README generation
│           └── roadmap.js    # Career roadmap generation
│
└── frontend/
    └── src/
        ├── App.jsx           # Router + AnimatePresence page transitions
        ├── pages/            # 6 lazy-loaded page components
        ├── components/
        │   ├── layout/       # Navbar (scroll-morphing pill), Footer
        │   ├── home/         # Hero, WhatWeDo, EventsSection, Testimonials
        │   ├── tools/        # RoastMyCode, GitHubCinematic, DataOrCap, SpotTheBug
        │   └── ui/           # MouseFollower, etc.
        └── utils/
```

---

## 🎨 Design System

All pages share a consistent dark-mode design language:

- **Background:** `#050510` (near-black with blue tint)
- **Cards:** `#0D0D1A` with `rgba(255,255,255,0.06)` borders
- **Primary:** `#1A6FE8` (blue) + `#F5A623` (amber) as accent pair
- **Typography:** Syne (headings, 900 weight) · DM Sans (body) · JetBrains Mono (labels/code)
- **Motion:** Framer Motion throughout — page transitions, scroll-triggered reveals, ambient particles, `useReducedMotion` respected

---

## 🔌 API Reference

### `POST /api/roast`
```json
// Request
{ "code": "def train_model():\n    ..." }

// Response
{
  "roast": "This code walks into a bar...",
  "roastLevel": "brutal",
  "roastPercent": 87,
  "fixedCode": "# fixed version with comments",
  "keyLessons": ["lesson 1", "lesson 2", "lesson 3"]
}
```

### `GET /api/github/:username`
Returns user profile, language helix data, monthly commit mountains, top repo constellation, and aggregated stats.

### `POST /api/roadmap`
```json
// Request
{
  "year": "3rd Year",
  "background": "Computer Science",
  "skills": ["Python", "Pandas"],
  "targetRole": "ML Engineer",
  "timeline": "6 months",
  "goal": "Get into a FAANG ML role"
}

// Response: phases[], skillGaps[], targetCompanies[], readinessScore, projectedScore, ...
```

---

## 🛡 Environment Variables

| Variable | Where | Description |
|---|---|---|
| `GEMINI_API_KEY` | Backend `.env` | Google Gemini API key |
| `PORT` | Backend `.env` | Server port (default: 3001) |
| `VITE_API_URL` | Frontend `.env.local` | Backend base URL |

---

## 👥 Built By

The **Society for Data Science, BIT Mesra** — a student community of 200+ members running workshops, hackathons, speaker sessions, and research groups since 2019.

---

<div align="center">

Made with 🔥 by SDS · BIT Mesra  
`sds.bitmesra.in`

</div>
