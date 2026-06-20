import { Router } from "express";
import { askGemini } from "../gemini.js";

const router = Router();

const GEN_SYSTEM = `You are a senior data scientist creating debugging challenges for students.
Generate a realistic buggy Python or JavaScript code snippet related to data science or ML workflows.
The snippet must have EXACTLY ONE clear bug. Keep it 5-15 lines.

Return ONLY this exact JSON, nothing else, no markdown:
{
  "id": 1234,
  "difficulty": "Medium",
  "language": "Python",
  "buggyCode": "def example():\n    x = 1\n    return x - 1",
  "bugLine": "Line 3",
  "hint": "Think about what value this returns",
  "realWorldContext": "This would cause issues in data pipelines"
}

Bug types to use (pick one): off-by-one error, missing variable initialization, logic error in conditional, type mismatch, missing return statement, incorrect list slicing, variable name typo, incorrect loop bounds, missing import, shallow vs deep copy mistake.
The bug must be realistic and educational.`;

const EVAL_SYSTEM = `You are an encouraging senior developer evaluating a student's bug-finding attempt.
You will receive the buggy code, the correct bug info, and the student's answer.
Judge if they found the actual bug. Be supportive and educational.

Return ONLY this exact JSON, nothing else, no markdown:
{
  "result": "exact",
  "correct": true,
  "bugDescription": "what the actual bug is",
  "bugLine": "Line N",
  "fixedCode": "the corrected version of the code",
  "explanation": "why this bug matters in real data science work",
  "encouragement": "a short encouraging message"
}

Use these result values: exact (found it perfectly), partial (found part of it), incorrect (wrong answer)`;

// Generate a new bug challenge
router.post("/generate", async (req, res) => {
  const { difficulty = "Medium" } = req.body;

  try {
    const data = await askGemini(
      GEN_SYSTEM,
      `Generate a ${difficulty} difficulty bug challenge. Language: Python or JavaScript. Make it data-science related.`
    );

    if (!data?.buggyCode) throw new Error("Invalid bug structure from Gemini");

    res.json(data);
  } catch (err) {
    console.error("[spotbug/generate]", err.message);
    res.status(500).json({ 
      error: "Bug generator crashed (how ironic) 🐛",
      detail: err.message 
    });
  }
});

// Evaluate a student's answer
router.post("/evaluate", async (req, res) => {
  const { buggyCode, studentAnswer, language } = req.body;

  if (!buggyCode?.trim() || !studentAnswer?.trim()) {
    return res.status(400).json({ error: "Missing code or answer" });
  }

  try {
    const data = await askGemini(
      EVAL_SYSTEM,
      `Language: ${language || "Python"}

Buggy code:
${buggyCode}

Student's answer: "${studentAnswer}"

Evaluate whether the student correctly identified the bug.`
    );

    if (!data?.result) throw new Error("Invalid evaluation structure from Gemini");

    res.json(data);
  } catch (err) {
    console.error("[spotbug/evaluate]", err.message);
    res.status(500).json({ 
      error: "Evaluator crashed... the bug won 🐛",
      detail: err.message 
    });
  }
});

export default router;
