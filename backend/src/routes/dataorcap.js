import { Router } from "express";
import { askGemini } from "../gemini.js";

const router = Router();

const SYSTEM = `You are a data science quiz master for college students.
Generate exactly 10 data science true/false statements for a "Data or Cap" game.
Mix real facts (answer: "DATA") and plausible-sounding lies (answer: "CAP").
Make CAP statements subtly wrong — not obviously false.

Return ONLY this exact JSON structure, nothing else, no markdown:
{
  "questions": [
    {
      "id": 1,
      "statement": "the statement here",
      "answer": "DATA",
      "explanation": "why this is true or false in 1-2 sentences",
      "difficulty": "beginner",
      "category": "statistics"
    }
  ]
}

Use these difficulty values: beginner, intermediate, advanced
Use these category values: statistics, machine learning, deep learning, data engineering, general
Generate exactly 10 questions total. Mix difficulties.`;

router.post("/questions", async (req, res) => {
  const { difficulty = "mixed" } = req.body;

  try {
    const data = await askGemini(
      SYSTEM,
      `Generate 10 questions. Difficulty focus: ${difficulty}. Include mix of DATA and CAP answers (about 5-6 DATA, 4-5 CAP).`
    );

    // Validate the response has questions array
    if (!data?.questions || !Array.isArray(data.questions)) {
      throw new Error("Invalid response structure from Gemini");
    }

    res.json(data);
  } catch (err) {
    console.error("[dataorcap]", err.message);
    res.status(500).json({ 
      error: "Quiz generator broke... too much data science? 🤔",
      detail: err.message 
    });
  }
});

export default router;
