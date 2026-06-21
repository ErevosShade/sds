import { Router } from "express";
import { askGemini } from "../gemini.js";

const router = Router();

const SYSTEM = `You are DataPath, an expert AI career coach specializing in data science careers for Indian college students and working professionals. Generate personalized, brutally honest, actionable learning roadmaps.

Return ONLY valid JSON. No markdown. No code fences. Exactly this structure:

{
  "title": "catchy personalized title like 'Your 6-Month ML Engineer Launchpad'",
  "summary": "2-3 sentences addressing the student directly. Acknowledge where they are, what's blocking them, what they'll achieve.",
  "readinessScore": 35,
  "projectedScore": 78,
  "phases": [
    {
      "phase": "Phase 1",
      "duration": "Weeks 1-3",
      "focus": "Topic Name",
      "why": "One sentence: exactly why this phase comes first and what unlocks next",
      "topics": ["Specific Topic 1", "Specific Topic 2", "Specific Topic 3"],
      "resource": {
        "name": "Resource name",
        "url": "https://real-working-url.com",
        "type": "YouTube|Course|Book|Documentation|Platform"
      },
      "project": "Specific project description with dataset source",
      "milestone": "Exact measurable skill you will have after this phase"
    }
  ],
  "skillGaps": ["Specific gap 1", "Specific gap 2", "Specific gap 3", "Specific gap 4"],
  "targetCompanies": [
    { "name": "Flipkart", "role": "Data Analyst", "readyNow": true,  "by": "Now"     },
    { "name": "Google",   "role": "ML Engineer",  "readyNow": false, "by": "Month 5" }
  ],
  "weeklyHours": 12,
  "keyAdvice": "One powerful, specific piece of advice for this exact student's situation. Not generic. Make it hit.",
  "salaryRange": "₹8-15 LPA"
}

STRICT RULES:
- phases: 3 phases for 1 month, 4 phases for 3 months, 5 phases for 6 months, 6 phases for 1 year
- readinessScore: be honest. Beginner with no skills = 5-15. Knows Python+ML = 40-55. Never inflate.
- projectedScore: realistic after roadmap. Never above 88. Never jump more than 45 points.
- resource URLs: ONLY real, working URLs. Use official docs, YouTube channels (youtube.com/@channel), GitHub repos, Coursera/fast.ai/Kaggle courses. No fake URLs.
- targetCompanies: 5-6 real Indian or global tech companies relevant to the exact role
- weeklyHours: 8-12 for 1st/2nd year, 15-20 for 3rd/4th year or professional switching
- topics: 3-4 highly specific subtopics per phase (not vague like "learn Python")
- project: specific project with actual dataset source (Kaggle, UCI, government data, etc.)
- salaryRange: realistic for Indian market at entry level for the target role`;

router.post("/", async (req, res) => {
  const { year, background, skills, targetRole, timeline, goal } = req.body;

  if (!targetRole || !timeline) {
    return res.status(400).json({ error: "Missing target role or timeline" });
  }

  const prompt = `Generate a data science learning roadmap for this student:

Profile:
- Year/Level: ${year || "College student"}
- Academic Background: ${background || "Computer Science"}
- Current Skills Known: ${skills?.length ? skills.join(", ") : "Complete beginner — no prior ML/data experience"}
- Target Role: ${targetRole}
- Available Timeline: ${timeline}
- Personal Goal: ${goal?.trim() || "Get placed in a data science role at a good company"}

Be specific. Reference their EXACT skills. Call out what they're missing. Give them the shortest path to their goal.`;

  try {
    const data = await askGemini(SYSTEM, prompt);

    if (!data?.phases || !Array.isArray(data.phases) || data.phases.length === 0) {
      throw new Error("Invalid roadmap structure");
    }

    res.json(data);
  } catch (err) {
    console.error("[roadmap]", err.message);
    res.status(500).json({ error: "Roadmap generation failed. Try again!", detail: err.message });
  }
});

export default router;
