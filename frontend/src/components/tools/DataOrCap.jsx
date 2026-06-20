import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Flame, CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react";
import { api } from "../../utils/api.js";

// ── Hardcoded fallback — game NEVER breaks ─────────────────────────────────
const FALLBACK_QUESTIONS = [
  { id:1,  statement: "The mean is always the best measure of central tendency for any dataset.", answer:"CAP",  explanation:"Outliers skew the mean badly. For skewed distributions, median is more reliable.", difficulty:"beginner",    category:"statistics"      },
  { id:2,  statement: "Overfitting occurs when a model performs well on training data but poorly on unseen data.", answer:"DATA", explanation:"Overfitting = memorizing training data instead of learning patterns. Classic bias-variance tradeoff.", difficulty:"beginner",    category:"machine learning"},
  { id:3,  statement: "Python is the most widely used programming language in data science as of 2024.", answer:"DATA", explanation:"Python dominates with libraries like pandas, NumPy, scikit-learn, PyTorch, and TensorFlow.", difficulty:"beginner",    category:"general"         },
  { id:4,  statement: "Normalization and standardization are exactly the same preprocessing technique.", answer:"CAP",  explanation:"Normalization scales to [0,1]. Standardization scales to mean=0, std=1. Different use cases.", difficulty:"beginner",    category:"statistics"      },
  { id:5,  statement: "A larger dataset always results in a better machine learning model.", answer:"CAP",  explanation:"Data quality, relevance, and model choice matter more than raw size. Garbage in, garbage out.", difficulty:"beginner",    category:"machine learning"},
  { id:6,  statement: "A model with high bias typically overfits the training data.", answer:"CAP",  explanation:"High bias means underfitting (model too simple). High variance means overfitting. They're opposites.", difficulty:"intermediate", category:"machine learning"},
  { id:7,  statement: "An ROC-AUC score of 0.5 means the model performs no better than random guessing.", answer:"DATA", explanation:"0.5 AUC is the baseline for a random classifier on a balanced dataset. Higher is better.", difficulty:"intermediate", category:"machine learning"},
  { id:8,  statement: "Gradient descent always finds the global minimum of the loss function.", answer:"CAP",  explanation:"Non-convex loss landscapes have local minima. SGD can get trapped or oscillate around them.", difficulty:"intermediate", category:"deep learning"   },
  { id:9,  statement: "Dropout layers in neural networks are active during both training and inference.", answer:"CAP",  explanation:"Dropout is only used during training to prevent co-adaptation. It's disabled at inference time.", difficulty:"intermediate", category:"deep learning"   },
  { id:10, statement: "Standard transformer attention complexity scales quadratically with sequence length.", answer:"DATA", explanation:"Self-attention is O(n²) in time and memory — the core scalability challenge for long sequences.", difficulty:"advanced",     category:"deep learning"   },
];

const DIFFICULTIES = ["beginner", "intermediate", "advanced", "mixed"];

function TypewriterText({ text }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const t = setInterval(() => {
      if (i < text.length) setShown(text.slice(0, ++i));
      else clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [text]);
  return (
    <span>
      {shown}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>▌</motion.span>
    </span>
  );
}

export default function DataOrCap() {
  const [phase,      setPhase]      = useState("setup");
  const [difficulty, setDifficulty] = useState("mixed");
  const [questions,  setQuestions]  = useState([]);
  const [qIdx,       setQIdx]       = useState(0);
  const [score,      setScore]      = useState(0);
  const [streak,     setStreak]     = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered,   setAnswered]   = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [history,    setHistory]    = useState([]);

  const q = questions[qIdx];

  const startGame = async () => {
    setLoading(true);
    setUsingFallback(false);
    try {
      // Try to get fresh questions from backend
      const data = await api.getQuestions(difficulty);
      const qs = data?.questions;
      if (Array.isArray(qs) && qs.length >= 5) {
        setQuestions(qs);
      } else {
        throw new Error("Not enough questions");
      }
    } catch {
      // Silently fall back to hardcoded questions
      setQuestions(shuffleArray([...FALLBACK_QUESTIONS]));
      setUsingFallback(true);
    } finally {
      setQIdx(0);
      setScore(0);
      setStreak(0);
      setBestStreak(0);
      setAnswered(null);
      setHistory([]);
      setPhase("playing");
      setLoading(false);
    }
  };

  const answer = (choice) => {
    if (answered) return;
    const correct = choice === q.answer;
    setAnswered(choice);

    if (correct) {
      setScore(s => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(b => Math.max(b, newStreak));
    } else {
      setStreak(0);
    }

    setHistory(h => [...h, {
      statement:   q.statement,
      chosen:      choice,
      correct,
      answer:      q.answer,
      explanation: q.explanation,
    }]);

    setTimeout(() => {
      if (qIdx + 1 < questions.length) {
        setQIdx(i => i + 1);
        setAnswered(null);
      } else {
        setPhase("result");
      }
    }, 2000);
  };

  const restart = () => {
    setPhase("setup");
    setQuestions([]);
  };

  // ── Setup ──────────────────────────────────────────────────────────────────
  if (phase === "setup") return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)" }}>
          <Gamepad2 size={20} style={{ color: "#F5A623" }} />
        </div>
        <div>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#F0F0F0" }}>Data or Cap</h2>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.78rem", color: "#606080" }}>True or false? You decide.</p>
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)" }}>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", color: "#C0A060", lineHeight: 1.7 }}>
          We give you a data science statement.{" "}
          <strong style={{ color: "#1A6FE8" }}>DATA</strong> = it's true.{" "}
          <strong style={{ color: "#F97316" }}>CAP</strong> = it's false.
          10 questions. How many can you get?
        </p>
      </div>

      <div>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "#606080", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Pick difficulty
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DIFFICULTIES.map(d => (
            <button key={d} onClick={() => setDifficulty(d)}
              className="py-2.5 px-4 rounded-xl font-semibold capitalize transition-all duration-200"
              style={{
                fontFamily: "DM Sans, sans-serif", fontSize: "0.85rem", cursor: "pointer",
                background: difficulty === d ? "rgba(245,166,35,0.20)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${difficulty === d ? "rgba(245,166,35,0.55)" : "rgba(255,255,255,0.08)"}`,
                color: difficulty === d ? "#F5A623" : "#606080",
                boxShadow: difficulty === d ? "0 0 16px rgba(245,166,35,0.2)" : "none",
              }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <motion.button onClick={startGame} disabled={loading}
        whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(245,166,35,0.4)" }}
        whileTap={{ scale: 0.97 }}
        className="py-4 rounded-xl font-bold text-white"
        style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem", cursor: "pointer",
          background: "linear-gradient(135deg, #F5A623, #F97316)",
          boxShadow: "0 4px 20px rgba(245,166,35,0.3)" }}>
        {loading ? "Loading questions..." : "Start Game 🎮"}
      </motion.button>
    </div>
  );

  // ── Result ─────────────────────────────────────────────────────────────────
  if (phase === "result") {
    const pct = Math.round((score / questions.length) * 100);
    const rating = score >= 8 ? { emoji: "🏆", text: "You crushed it", color: "#F5A623" }
                 : score >= 5 ? { emoji: "🎯", text: "Not bad at all",  color: "#1A6FE8" }
                 :              { emoji: "📚", text: "Skill issue",      color: "#EF4444" };

    return (
      <div className="p-6 flex flex-col gap-5">
        {/* Score hero */}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 rounded-2xl"
          style={{ background: `${rating.color}0D`, border: `2px solid ${rating.color}30` }}>
          <div style={{ fontSize: "3rem" }}>{rating.emoji}</div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 900, fontSize: "3.5rem", color: rating.color, lineHeight: 1 }}>
            {score}<span style={{ fontSize: "1.5rem", color: "#606080" }}>/{questions.length}</span>
          </div>

          {/* Circular progress ring */}
          <svg width="80" height="80" style={{ margin: "0.75rem auto", display: "block" }}>
            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <motion.circle cx="40" cy="40" r="32" fill="none" stroke={rating.color} strokeWidth="6"
              strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 32}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - pct / 100) }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ transformOrigin: "center", transform: "rotate(-90deg)" }} />
            <text x="40" y="45" textAnchor="middle"
              style={{ fontFamily: "Syne, sans-serif", fontSize: "12px", fontWeight: 700, fill: rating.color }}>
              {pct}%
            </text>
          </svg>

          <p style={{ fontFamily: "DM Sans, sans-serif", color: "#808098" }}>{rating.text}</p>
          {bestStreak > 1 && (
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.72rem", color: "#F97316", marginTop: "0.3rem" }}>
              🔥 Best streak: {bestStreak}
            </p>
          )}
        </motion.div>

        {/* Question review */}
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#3A3A5A transparent" }}>
          {history.map((h, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{
                background: h.correct ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
                border: `1px solid ${h.correct ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              }}>
              {h.correct
                ? <CheckCircle size={14} style={{ color: "#22C55E", flexShrink: 0, marginTop: 2 }} />
                : <XCircle    size={14} style={{ color: "#EF4444", flexShrink: 0, marginTop: 2 }} />}
              <div>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.78rem", color: "#C0C0C0", lineHeight: 1.4 }}>
                  {h.statement}
                </p>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.64rem", color: h.correct ? "#22C55E" : "#F5A623", marginTop: 3 }}>
                  Answer: {h.answer} — {h.explanation}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Share */}
        <button onClick={() => navigator.clipboard.writeText(
          `I scored ${score}/${questions.length} on Data or Cap 🎮\nBest streak: ${bestStreak} 🔥\nCan you beat me? — SDS Chaos Page`
        )}
          className="py-2.5 rounded-xl text-sm font-semibold"
          style={{ fontFamily: "DM Sans, sans-serif", background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", color: "#F5A623", cursor: "pointer" }}>
          📋 Copy Score Card
        </button>

        <motion.button onClick={restart} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold"
          style={{ fontFamily: "Syne, sans-serif", background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.3)", color: "#F5A623", cursor: "pointer" }}>
          <RotateCcw size={16} /> Play Again
        </motion.button>
      </div>
    );
  }

  // ── Playing ────────────────────────────────────────────────────────────────
  if (!q) return null;
  const isCorrect = answered && answered === q.answer;
  const isWrong   = answered && answered !== q.answer;

  return (
    <div className="p-6 flex flex-col gap-5">

      {/* HUD */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={16} style={{ color: streak > 0 ? "#F97316" : "#2A2A3A" }} />
          <motion.span
            key={streak}
            animate={streak > 0 ? { scale: [1.4, 1] } : {}}
            transition={{ duration: 0.3 }}
            style={{ fontFamily: "Syne, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: streak > 0 ? "#F97316" : "#2A2A3A" }}>
            {streak > 0 ? `${streak}x streak` : "No streak yet"}
          </motion.span>
        </div>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.72rem", color: "#606080" }}>
          {qIdx + 1} / {questions.length} · {score} correct
        </span>
        <span className="px-2.5 py-1 rounded-full capitalize"
          style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.68rem", fontWeight: 600,
            background: "rgba(245,166,35,0.10)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.25)" }}>
          {q.difficulty}
        </span>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div key={qIdx}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl p-6 min-h-40 flex flex-col justify-center"
          style={{
            background: answered
              ? isCorrect ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)"
              : "#080812",
            border: `2px solid ${answered
              ? isCorrect ? "rgba(34,197,94,0.45)" : "rgba(239,68,68,0.45)"
              : "rgba(26,111,232,0.3)"}`,
            boxShadow: answered
              ? `0 0 32px ${isCorrect ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)"}`
              : "0 0 24px rgba(26,111,232,0.08)",
            transition: "all 0.3s ease",
          }}>
          <p style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 700, color: "#F0F0F0", lineHeight: 1.5, textAlign: "center" }}>
            {!answered ? <TypewriterText text={q.statement} /> : q.statement}
          </p>

          <AnimatePresence>
            {answered && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 0.15 }}
                style={{ overflow: "hidden" }}>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.83rem", lineHeight: 1.65,
                  color: isCorrect ? "#86EFAC" : "#FCA5A5", marginTop: "1rem", textAlign: "center" }}>
                  {isCorrect ? "✓ Correct! " : `✗ It was ${q.answer}. `}
                  {q.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "🟦 DATA", value: "DATA", color: "#1A6FE8" },
          { label: "🟧 CAP",  value: "CAP",  color: "#F97316" },
        ].map(btn => {
          const chosen  = answered === btn.value;
          const correct = answered && btn.value === q.answer;
          return (
            <motion.button key={btn.value}
              onClick={() => answer(btn.value)}
              disabled={!!answered}
              whileHover={!answered ? { scale: 1.06, boxShadow: `0 0 32px ${btn.color}50` } : {}}
              whileTap={!answered ? { scale: 0.93 } : {}}
              className="py-5 rounded-2xl font-black text-xl"
              style={{
                fontFamily: "Syne, sans-serif", cursor: answered ? "default" : "pointer",
                background: correct ? `${btn.color}30` : chosen ? "rgba(239,68,68,0.15)" : `${btn.color}12`,
                border: `2px solid ${correct ? btn.color : chosen ? "#EF4444" : `${btn.color}40`}`,
                color: correct ? btn.color : chosen ? "#EF4444" : btn.color,
                boxShadow: correct ? `0 0 28px ${btn.color}50` : "none",
                transition: "all 0.25s ease",
              }}>
              {btn.label}
            </motion.button>
          );
        })}
      </div>

      {/* Fallback notice */}
      {usingFallback && (
        <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#3A3A5A", textAlign: "center" }}>
          offline mode — using cached questions
        </p>
      )}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
