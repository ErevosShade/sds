import { Router } from "express";
import { askGeminiRaw } from "../gemini.js";

const router = Router();

const SYSTEM = `You are the world's best GitHub profile README designer. Generate stunning, animated GitHub profile READMEs.

Use ONLY these real, working services:

1. TYPING ANIMATION (always include, always first):
<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=22&pause=1000&color=HEX&center=true&vCenter=true&width=600&lines=LINE1;LINE2;LINE3;LINE4" alt="Typing SVG" />
</div>

2. STATS CARDS (if requested):
<div align="center">
<img src="https://github-readme-stats.vercel.app/api?username=USER&show_icons=true&theme=THEME&hide_border=true&bg_color=00000000&title_color=COLOR&icon_color=COLOR2" height="165"/>
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=USER&layout=compact&theme=THEME&hide_border=true&bg_color=00000000" height="165"/>
</div>

3. STREAK (if requested):
<div align="center">
<img src="https://streak-stats.demolab.com/?user=USER&theme=THEME&hide_border=true"/>
</div>

4. BADGES (shields.io) for languages/tools:
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
Use real logo names: python, javascript, typescript, react, nodejs, tensorflow, pytorch, scikitlearn, pandas, numpy, docker, git

5. TROPHIES (always looks impressive):
<div align="center">
<img src="https://github-profile-trophy.vercel.app/?username=USER&theme=TROPHY_THEME&no-frame=true&no-bg=true&margin-w=4"/>
</div>

6. CONTRIBUTION SNAKE (if requested):
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/USER/USER/output/github-contribution-grid-snake-dark.svg">
  <img alt="snake" src="https://raw.githubusercontent.com/USER/USER/output/github-contribution-grid-snake.svg">
</picture>

7. ACTIVITY GRAPH (if requested):
<img src="https://github-readme-activity-graph.vercel.app/graph?username=USER&theme=GRAPH_THEME&hide_border=true&bg_color=00000000"/>

8. VISITOR COUNTER (always at bottom):
<img src="https://komarev.com/ghpvc/?username=USER&color=COLOR&style=for-the-badge&label=PROFILE+VIEWS"/>

THEME GUIDE by vibe:
- Hacker: theme=tokyonight, color=00FF41, color2=00D4FF, trophy_theme=matrix, graph_theme=react-dark
- Minimalist: theme=default, color=FFFFFF, color2=A0A0A0, trophy_theme=flat, graph_theme=minimal  
- Creative: theme=radical, color=F5A623, color2=FF6B6B, trophy_theme=dracula, graph_theme=dracula
- Professional: theme=dark, color=1A6FE8, color2=4D91F0, trophy_theme=nord, graph_theme=nord-dark

TONE GUIDE:
- Serious: clean prose, no emoji, professional language
- Casual: friendly, some emoji (1-2 per section), conversational
- Funny: jokes, self-deprecating, witty one-liners, meme references
- Full Cringe: ALL CAPS enthusiasm, 🔥💀🚀 emoji overload, "not like other devs"

Generate a COMPLETE, LONG, IMPRESSIVE README. Include:
- Typing SVG header
- About Me section with bullet points (match tone)
- Tech Stack section with REAL shields.io badges for their languages
- GitHub Stats section
- Trophy showcase  
- Activity graph OR contribution snake
- Featured projects (from their repos)
- Connect/Social section
- Visitor counter footer

Return ONLY raw markdown. No JSON wrapper. No code fences around the whole thing.
Make it genuinely impressive — something a developer would be proud to show off.`;

router.post("/", async (req, res) => {
  const { githubData, preferences } = req.body;
  if (!githubData || !preferences) {
    return res.status(400).json({ error: "Missing githubData or preferences" });
  }

  const { username, name, bio, topLanguages = [], topRepos = [], followers } = githubData;
  const { vibe, flex = [], tone, workingOn, funFact, learning, socialLinks = {} } = preferences;

  const vibeMap = {
    "🖤 Hacker":       "Hacker",
    "✨ Minimalist":   "Minimalist",
    "🎨 Creative":     "Creative",
    "💼 Professional": "Professional",
  };

  const prompt = `Generate a GitHub profile README for:

GITHUB DATA:
- Username: ${username}
- Name: ${name}
- Bio: ${bio || "Not provided"}
- Top Languages: ${topLanguages.slice(0, 6).join(", ") || "Python, JavaScript"}
- Top Repos: ${topRepos.slice(0, 5).map(r => `${r.name} (${r.stars}⭐) - ${r.description || "No description"}`).join(" | ") || "No repos"}
- Followers: ${followers}

PREFERENCES:
- Vibe: ${vibeMap[vibe] || "Professional"}
- Tone: ${tone}
- Include sections: ${flex.length > 0 ? flex.join(", ") : "GitHub Stats, Skills, Projects"}
- Currently working on: ${workingOn || "something cool"}
- Currently learning: ${learning || "new technologies"}
- Fun fact: ${funFact || "I love coding"}
- Social links: ${JSON.stringify(socialLinks)}

IMPORTANT RULES:
1. Replace every instance of USER with: ${username}
2. Use the exact theme for their vibe (${vibeMap[vibe] || "Professional"})
3. Only include shields.io badges for languages that actually exist in their profile: ${topLanguages.join(", ")}
4. Match the tone STRICTLY — if Funny, make it actually funny. If Full Cringe, go all out.
5. Make the featured projects section use their ACTUAL repo names and descriptions
6. Include ALL sections listed above — make it long and complete
7. Social links section: ${Object.keys(socialLinks).length > 0 ? JSON.stringify(socialLinks) : "skip if none provided"}

Generate the full README.md now. Make it genuinely impressive.`;

  try {
    const readme = await askGeminiRaw(SYSTEM, prompt);
    res.json({ readme });
  } catch (err) {
    console.error("[readme]", err.message);
    res.status(500).json({ error: "README generation failed", detail: err.message });
  }
});

export default router;
