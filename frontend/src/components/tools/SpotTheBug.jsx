import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, Send, RotateCcw, Lightbulb, Trophy, Zap } from "lucide-react";
import { api } from "../../utils/api.js";

// ── Hardcoded seed DB — loads instantly, no API needed ─────────────────────
const SEED_BUGS = [
  {
    id: 1, difficulty: "Easy", language: "Python",
    buggyCode: `def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers) - 1`,
    bugLine: "Line 5",
    hint: "Look very carefully at the return statement.",
    realWorldContext: "In analytics pipelines, every metric would be 1 unit too low.",
    fixedCode: `def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)  # removed the erroneous - 1`,
    bugDescription: "Subtracting 1 from the return value makes every average wrong",
    explanation: "The -1 at the end corrupts every result. This bug would silently skew all downstream metrics.",
  },
  {
    id: 2, difficulty: "Easy", language: "JavaScript",
    buggyCode: `function findMax(arr) {
  let max = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`,
    bugLine: "Line 2",
    hint: "What happens if every number in the array is negative?",
    realWorldContext: "Would return 0 for any dataset with only negative values — kills financial analysis.",
    fixedCode: `function findMax(arr) {
  let max = arr[0]; // start with first element, not 0
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`,
    bugDescription: "Initializing max to 0 returns wrong result for all-negative arrays",
    explanation: "findMax([-5, -3, -10]) returns 0 instead of -3. A silent killer in datasets with negative values.",
  },
  {
    id: 3, difficulty: "Medium", language: "Python",
    buggyCode: `def merge_configs(base, overrides):
    result = base
    for key, value in overrides.items():
        result[key] = value
    return result`,
    bugLine: "Line 2",
    hint: "In Python, does dict1 = dict2 create a copy?",
    realWorldContext: "Your source config dict silently gets mutated every time this is called.",
    fixedCode: `def merge_configs(base, overrides):
    result = base.copy()  # create actual copy
    for key, value in overrides.items():
        result[key] = value
    return result`,
    bugDescription: "result = base is a reference not a copy — mutating result mutates the original",
    explanation: "Shallow reference means the caller's base dict gets permanently modified. Classic data pipeline corruption bug.",
  },
  {
    id: 4, difficulty: "Medium", language: "JavaScript",
    buggyCode: `async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    const data = res.json();
    return data.name;
  } catch (e) {
    console.error(e);
  }
}`,
    bugLine: "Line 4",
    hint: "You await fetch() — should you do the same for res.json()?",
    realWorldContext: "data.name is always undefined. Causes silent failures with no error thrown.",
    fixedCode: `async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    const data = await res.json(); // must await!
    return data.name;
  } catch (e) {
    console.error(e);
  }
}`,
    bugDescription: "Missing await on res.json() — data is a Promise, not the parsed object",
    explanation: "Without await, data is a Promise object. data.name is undefined. No error is thrown — it just silently returns wrong data.",
  },
  {
    id: 5, difficulty: "Hard", language: "Python",
    buggyCode: `from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

def train_model(X, y):
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y)
    # train model...`,
    bugLine: "Lines 5-7 (wrong order)",
    hint: "What data should the scaler learn from — all data or just training data?",
    realWorldContext: "Your model has illegally seen test set statistics. Accuracy metrics are inflated.",
    fixedCode: `from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y)  # split FIRST
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)  # fit on train only
    X_test  = scaler.transform(X_test)       # apply to test (don't refit)`,
    bugDescription: "Data leakage — scaler is fit on all data before train/test split",
    explanation: "The scaler learns mean/std from the test set, giving the model illegal foreknowledge. This is the #1 ML pipeline mistake.",
  },
  {
    id: 6, difficulty: "Hard", language: "Python",
    buggyCode: `def append_to_history(item, history=[]):
    history.append(item)
    return history

print(append_to_history("login"))
print(append_to_history("logout"))
# Expected: ['login'], ['logout']
# Actual:   ['login'], ['login', 'logout']`,
    bugLine: "Line 1 (function signature)",
    hint: "When is a default argument created — at function definition or at each call?",
    realWorldContext: "Shared mutable default causes all calls to accumulate in one list. Breaks any stateless function.",
    fixedCode: `def append_to_history(item, history=None):
    if history is None:
        history = []  # fresh list every call
    history.append(item)
    return history`,
    bugDescription: "Mutable default argument [] is created once and shared across all calls",
    explanation: "Python creates default arguments ONCE at function definition. Every call without the argument shares the same list object.",
  },
];

let seenIds = [];

function getNextBug() {
  const unseen = SEED_BUGS.filter(b => !seenIds.includes(b.id));
  const pool = unseen.length > 0 ? unseen : SEED_BUGS;
  const bug = pool[Math.floor(Math.random() * pool.length)];
  seenIds = [...seenIds, bug.id].slice(-SEED_BUGS.length);
  return bug;
}

const DIFF = ["Easy", "Medium", "Hard"];

const RESULT_CONFIG = {
  exact:     { emoji: "🎯", label: "Exact Hit!",      color: "#22C55E", points: 100 },
  partial:   { emoji: "🔍", label: "Partial Credit",  color: "#F5A623", points: 40  },
  incorrect: { emoji: "❌", label: "Not Quite",       color: "#EF4444", points: 0   },
};

export default function SpotTheBug() {
  const [phase,       setPhase]       = useState("setup");
  const [diff,        setDiff]        = useState("Medium");
  const [challenge,   setChallenge]   = useState(null);
  const [answer,      setAnswer]      = useState("");
  const [result,      setResult]      = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [evaluating,  setEvaluating]  = useState(false);
  const [hintsUsed,   setHintsUsed]   = useState(0);
  const [showHint,    setShowHint]    = useState(false);
  const [sessionScore,setSessionScore]= useState(0);
  const [solved,      setSolved]      = useState(0);
  const [usingAI,     setUsingAI]     = useState(false);

  const loadChallenge = async () => {
    setLoading(true);
    setAnswer("");
    setResult(null);
    setHintsUsed(0);
    setShowHint(false);

    try {
      // Try AI-generated bug
      const data = await api.generateBug(diff);
      if (data?.buggyCode) {
        setChallenge({ ...data, fromAI: true });
        setUsingAI(true);
      } else throw new Error("Invalid response");
    } catch {
      // Fall back to seed DB instantly
      setChallenge({ ...getNextBug(), fromAI: false });
      setUsingAI(false);
    } finally {
      setPhase("challenge");
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setEvaluating(true);

    const hintsMultiplier = hintsUsed === 0 ? 1 : hintsUsed === 1 ? 0.75 : 0.5;

    try {
      let evalResult;

      if (challenge.fromAI) {
        // AI evaluates AI-generated bugs
        evalResult = await api.evaluateBug(challenge.buggyCode, answer, challenge.language);
      } else {
        // Local evaluation for seed bugs — match against known answer
        evalResult = localEvaluate(answer, challenge);
      }

      const rc = RESULT_CONFIG[evalResult.result] || RESULT_CONFIG.incorrect;
      const pts = Math.round(rc.points * hintsMultiplier);

      setResult({ ...evalResult, pointsAwarded: pts });
      if (evalResult.correct) {
        setSessionScore(s => s + pts);
        setSolved(s => s + 1);
      }
      setPhase("result");
    } catch {
      // If evaluation API fails, do local eval
      const evalResult = localEvaluate(answer, challenge);
      const rc = RESULT_CONFIG[evalResult.result] || RESULT_CONFIG.incorrect;
      const pts = Math.round(rc.points * hintsMultiplier);
      setResult({ ...evalResult, pointsAwarded: pts });
      if (evalResult.correct) {
        setSessionScore(s => s + pts);
        setSolved(s => s + 1);
      }
      setPhase("result");
    } finally {
      setEvaluating(false);
    }
  };

  const reset = () => {
    setPhase("setup");
    setChallenge(null);
    setResult(null);
    setAnswer("");
  };

  // ── Setup ──────────────────────────────────────────────────────────────────
  if (phase === "setup") return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
            <Bug size={20} style={{ color: "#22C55E" }} />
          </div>
          <div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#F0F0F0" }}>Spot the Bug</h2>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.78rem", color: "#606080" }}>Find it. Explain it. Level up.</p>
          </div>
        </div>
        {solved > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}>
            <Trophy size={13} style={{ color: "#22C55E" }} />
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#22C55E" }}>
              {sessionScore} pts · {solved} solved
            </span>
          </div>
        )}
      </div>

      <div className="rounded-xl p-4" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.88rem", color: "#86EFAC", lineHeight: 1.7 }}>
          Real data science code with exactly <strong>ONE bug</strong>. Find it, describe it, explain why it matters.
          Use hints sparingly — they cost points.
        </p>
      </div>

      {/* Points preview */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "No hints",  pts: "100 pts", color: "#22C55E" },
          { label: "1 hint",    pts: "75 pts",  color: "#F5A623" },
          { label: "2 hints",   pts: "50 pts",  color: "#EF4444" },
        ].map(p => (
          <div key={p.label} className="rounded-xl p-3 text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem", fontWeight: 800, color: p.color }}>{p.pts}</div>
            <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.65rem", color: "#606080", marginTop: 2 }}>{p.label}</div>
          </div>
        ))}
      </div>

      <div>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "#606080", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Difficulty
        </p>
        <div className="flex gap-3">
          {DIFF.map(d => (
            <button key={d} onClick={() => setDiff(d)}
              className="flex-1 py-2.5 rounded-xl font-bold transition-all duration-200"
              style={{
                fontFamily: "Syne, sans-serif", fontSize: "0.85rem", cursor: "pointer",
                background: diff === d ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${diff === d ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.08)"}`,
                color: diff === d ? "#22C55E" : "#606080",
                boxShadow: diff === d ? "0 0 16px rgba(34,197,94,0.15)" : "none",
              }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <motion.button onClick={loadChallenge} disabled={loading}
        whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(34,197,94,0.3)" }}
        whileTap={{ scale: 0.97 }}
        className="py-4 rounded-xl font-bold text-white"
        style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem", cursor: "pointer",
          background: "linear-gradient(135deg, #22C55E, #16A34A)",
          boxShadow: "0 4px 20px rgba(34,197,94,0.25)" }}>
        {loading ? "Loading challenge... 🐛" : "Show Me The Bug 🐛"}
      </motion.button>
    </div>
  );

  // ── Challenge ──────────────────────────────────────────────────────────────
  if (phase === "challenge" && challenge) return (
    <div className="p-6 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bug size={16} style={{ color: "#22C55E" }} />
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#F0F0F0" }}>
            {challenge.title || "Spot the Bug"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {usingAI && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full"
              style={{ background: "rgba(26,111,232,0.12)", border: "1px solid rgba(26,111,232,0.25)", fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#4D91F0" }}>
              <Zap size={9} /> AI Generated
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full"
            style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", fontWeight: 600,
              background: "rgba(34,197,94,0.10)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.25)" }}>
            {challenge.difficulty} · {challenge.language}
          </span>
        </div>
      </div>

      {/* Code block */}
      <div className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(34,197,94,0.25)", boxShadow: "0 0 20px rgba(34,197,94,0.05)" }}>
        <div className="flex items-center justify-between px-4 py-2"
          style={{ background: "#060810", borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              {["#2A2A3A", "#2A2A3A", "rgba(34,197,94,0.3)"].map((c, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#3A3A5A" }}>
              buggy_code.{challenge.language === "Python" ? "py" : "js"}
            </span>
          </div>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#3A3A5A" }}>
            🐛 one bug hidden inside
          </span>
        </div>

        {/* Line-numbered code */}
        <div style={{ background: "#060810", overflow: "hidden" }}>
          {challenge.buggyCode.split("\n").map((line, i) => (
            <div key={i} className="flex"
              style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.82rem", lineHeight: "1.75" }}>
              <span style={{ minWidth: "2.5rem", padding: "0 0.75rem", color: "#2A2A4A",
                background: "#060810", userSelect: "none", borderRight: "1px solid rgba(255,255,255,0.04)", flexShrink: 0 }}>
                {i + 1}
              </span>
              <span style={{ padding: "0 1rem", color: "#C8E6C9", whiteSpace: "pre" }}>{line}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hints */}
      <div className="flex gap-2">
        {[1, 2].map(n => {
          const used = hintsUsed >= n;
          const available = hintsUsed >= n - 1;
          return (
            <button key={n}
              disabled={!available || used}
              onClick={() => {
                if (available && !used) {
                  setHintsUsed(n);
                  setShowHint(true);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                fontFamily: "DM Sans, sans-serif", cursor: available && !used ? "pointer" : "not-allowed",
                background: used ? "rgba(245,166,35,0.08)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${used ? "rgba(245,166,35,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: used ? "#F5A623" : available ? "#606080" : "#2A2A3A",
                opacity: available ? 1 : 0.4,
              }}>
              <Lightbulb size={11} />
              {used ? `Hint ${n} used` : `Hint ${n} (-${n === 1 ? 25 : 50}pts)`}
            </button>
          );
        })}
      </div>

      {/* Hint reveal */}
      <AnimatePresence>
        {showHint && hintsUsed > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
            <div className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: "rgba(245,166,35,0.07)", border: "1px solid rgba(245,166,35,0.2)" }}>
              <Lightbulb size={14} style={{ color: "#F5A623", flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.82rem", color: "#C0A060", lineHeight: 1.6 }}>
                {hintsUsed === 1
                  ? (challenge.hints?.hint1 || challenge.hint || "Look at the logic carefully.")
                  : (challenge.hints?.hint2 || challenge.hint || "Check the specific line mentioned.")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer input */}
      <div className="flex flex-col gap-2">
        <label style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "#606080", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Describe the bug:
        </label>
        <textarea value={answer} onChange={e => setAnswer(e.target.value)}
          placeholder="e.g. Line 5: divides by len(numbers) - 1 instead of len(numbers), causing every average to be 1 lower than correct..."
          rows={3}
          className="w-full rounded-xl p-4 resize-none outline-none"
          style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.87rem", background: "#080812", color: "#E0E0E0",
            border: `1px solid ${answer.length > 10 ? "rgba(34,197,94,0.35)" : "rgba(34,197,94,0.15)"}`,
            lineHeight: 1.6, transition: "border-color 0.2s" }} />
      </div>

      <motion.button onClick={submitAnswer} disabled={!answer.trim() || evaluating}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold"
        style={{ fontFamily: "Syne, sans-serif", cursor: answer.trim() ? "pointer" : "not-allowed",
          background: answer.trim() ? "linear-gradient(135deg, #22C55E, #16A34A)" : "rgba(255,255,255,0.06)",
          color: "#fff", opacity: answer.trim() ? 1 : 0.5,
          boxShadow: answer.trim() ? "0 4px 20px rgba(34,197,94,0.25)" : "none" }}>
        <Send size={15} />
        {evaluating ? "Evaluating..." : "Submit Answer"}
      </motion.button>
    </div>
  );

  // ── Result ──────────────────────────────────────────────────────────────────
  if (phase === "result" && result) {
    const rc = RESULT_CONFIG[result.result] || RESULT_CONFIG.incorrect;
    return (
      <div className="p-6 flex flex-col gap-5">

        {/* Verdict card */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 rounded-2xl"
          style={{ background: `${rc.color}0D`, border: `2px solid ${rc.color}40`, boxShadow: `0 0 32px ${rc.color}15` }}>
          <div style={{ fontSize: "2.5rem" }}>{rc.emoji}</div>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: rc.color, marginTop: "0.4rem" }}>
            {rc.label}
          </h3>
          {result.pointsAwarded > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mt-2"
              style={{ background: `${rc.color}20`, border: `1px solid ${rc.color}40` }}>
              <Trophy size={13} style={{ color: rc.color }} />
              <span style={{ fontFamily: "Syne, sans-serif", fontSize: "0.88rem", fontWeight: 700, color: rc.color }}>
                +{result.pointsAwarded} pts
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Bug explanation */}
        <div className="rounded-xl p-4 flex flex-col gap-4"
          style={{ background: "#080812", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem", color: "#3A3A5A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
              The Bug
            </p>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.88rem", color: "#F0F0F0", lineHeight: 1.5 }}>
              {result.bugDescription || challenge.bugDescription}
            </p>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", color: "#22C55E", marginTop: "0.3rem" }}>
              {result.bugLine || challenge.bugLine}
            </p>
          </div>

          <div>
            <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem", color: "#3A3A5A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
              Why it matters
            </p>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.85rem", color: "#A0C8B0", lineHeight: 1.65 }}>
              {result.explanation || challenge.explanation}
            </p>
          </div>

          {result.feedback && (
            <div>
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem", color: "#3A3A5A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
                Feedback
              </p>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.85rem", color: "#C0C0D0", lineHeight: 1.6 }}>
                {result.feedback || result.encouragement}
              </p>
            </div>
          )}
        </div>

        {/* Fixed code */}
        {(result.fixedCode || challenge.fixedCode) && (
          <div className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(34,197,94,0.3)" }}>
            <div className="px-4 py-2"
              style={{ background: "#060810", borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.62rem", color: "#22C55E", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Fixed version
              </span>
            </div>
            <pre style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.78rem", color: "#A0E0B0",
              background: "#060810", padding: "1rem", overflowX: "auto", lineHeight: 1.7, margin: 0 }}>
              {result.fixedCode || challenge.fixedCode}
            </pre>
          </div>
        )}

        <div className="flex gap-3">
          <motion.button onClick={loadChallenge} disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold"
            style={{ fontFamily: "Syne, sans-serif", cursor: "pointer",
              background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#22C55E" }}>
            <Bug size={15} />
            {loading ? "Loading..." : "Next Bug →"}
          </motion.button>
          <button onClick={reset}
            className="px-4 py-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#606080", cursor: "pointer" }}>
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// ── Local evaluation for seed bugs ──────────────────────────────────────────
function localEvaluate(studentAnswer, bug) {
  const answer = studentAnswer.toLowerCase();
  const desc   = (bug.bugDescription || "").toLowerCase();

  // Extract keywords from bug description
  const keywords = desc.split(/\s+/).filter(w => w.length > 4);
  const matchCount = keywords.filter(k => answer.includes(k)).length;
  const matchRatio = keywords.length > 0 ? matchCount / keywords.length : 0;

  // Also check if they mentioned the correct line
  const lineMatch = bug.bugLine && answer.includes(bug.bugLine.toLowerCase().replace("line ", ""));

  let correctness;
  if (matchRatio >= 0.5 || lineMatch) {
    correctness = "exact";
  } else if (matchRatio >= 0.25) {
    correctness = "partial";
  } else {
    correctness = "incorrect";
  }

  return {
    result:         correctness,
    correct:        correctness !== "incorrect",
    bugDescription: bug.bugDescription,
    bugLine:        bug.bugLine,
    fixedCode:      bug.fixedCode,
    explanation:    bug.explanation,
    feedback:       correctness === "exact"
      ? "Nice work! You identified the core issue."
      : correctness === "partial"
        ? "You're on the right track. Check the specific line more carefully."
        : `Not quite. The bug was: ${bug.bugDescription}`,
  };
}
