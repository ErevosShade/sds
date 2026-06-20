import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Copy, Check, AlertTriangle } from "lucide-react";
import { api } from "../../utils/api.js";

const LEVEL_COLORS = { gentle: "#F5A623", harsh: "#F97316", brutal: "#EF4444", savage: "#DC2626" };

function TypewriterText({ text, speed = 18 }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const t = setInterval(() => {
      if (i < text.length) { setShown(text.slice(0, ++i)); }
      else clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return <span>{shown}<motion.span animate={{ opacity: [1,0] }} transition={{ duration: 0.5, repeat: Infinity }}>▌</motion.span></span>;
}

function SeverityBar({ level, pct }) {
  const color = LEVEL_COLORS[level] || "#F97316";
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", color: "#606080", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Roast Level
        </span>
        <span style={{ fontFamily: "Syne, sans-serif", fontSize: "0.85rem", fontWeight: 700, color }}>
          {level?.toUpperCase()} — {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})`, boxShadow: `0 0 12px ${color}60` }}
        />
      </div>
    </div>
  );
}

export default function RoastMyCode() {
  const [code,    setCode]    = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [copied,  setCopied]  = useState(false);
  const [shaking, setShaking] = useState(false);
  const resultsRef = useRef(null);

  const handlePaste = (e) => {
    setCode(e.target.value);
    if (e.target.value.length > 10) {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  const handleRoast = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await api.roast(code);
      setResult(data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    } catch (err) {
      setError(err.message || "The roaster melted... try again? 😭");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`🔥 SDS Roast:\n\n${result.roast}\n\nKey lessons:\n${result.keyLessons?.join("\n")}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}>
          <Flame size={20} style={{ color: "#F97316" }} />
        </div>
        <div>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#F0F0F0" }}>Roast My Code</h2>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.78rem", color: "#606080" }}>Paste your code. Prepare your ego.</p>
        </div>
      </div>

      {/* Code input */}
      <motion.div animate={shaking ? { x: [-4,4,-4,4,0] } : {}} transition={{ duration: 0.4 }}>
        <div className="relative">
          <textarea
            value={code}
            onChange={handlePaste}
            placeholder="Paste your cursed code here... be brave 💀"
            rows={10}
            className="w-full rounded-xl p-4 resize-none outline-none transition-all duration-300"
            style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.82rem", lineHeight: 1.65,
              background: "#080812", color: "#E0E0E0",
              border: `1px solid ${code.length > 10 ? "rgba(249,115,22,0.45)" : "rgba(255,255,255,0.08)"}`,
              boxShadow: code.length > 10 ? "0 0 20px rgba(249,115,22,0.12), inset 0 0 16px rgba(249,115,22,0.04)" : "none",
              transition: "border-color 0.3s, box-shadow 0.3s",
            }}
          />
          {code.length > 10 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold"
              style={{ background: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "JetBrains Mono, monospace" }}>
              CODE DETECTED 🔴
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Roast button */}
      <motion.button
        onClick={handleRoast}
        disabled={!code.trim() || loading}
        whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 32px rgba(249,115,22,0.5)" } : {}}
        whileTap={!loading ? { scale: 0.97 } : {}}
        className="relative flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-white overflow-hidden"
        style={{
          fontFamily: "Syne, sans-serif", fontSize: "1rem",
          background: code.trim() && !loading
            ? "linear-gradient(135deg, #1A6FE8, #F97316)"
            : "rgba(255,255,255,0.06)",
          opacity: !code.trim() ? 0.5 : 1,
          cursor: !code.trim() ? "not-allowed" : "pointer",
          border: "1px solid transparent",
          boxShadow: code.trim() ? "0 4px 24px rgba(249,115,22,0.3)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        {loading ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
              <Flame size={18} />
            </motion.div>
            roasting in progress...
          </>
        ) : (
          <><Flame size={18} /> Get Roasted</>
        )}
      </motion.button>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5" }}>
            <AlertTriangle size={16} />
            <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.85rem" }}>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div ref={resultsRef}
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            {/* Severity */}
            <SeverityBar level={result.roastLevel} pct={result.roastPercent ?? 72} />

            {/* Roast text */}
            <div className="rounded-xl p-5" style={{ background: "#080812", border: "2px solid rgba(249,115,22,0.4)", boxShadow: "0 0 24px rgba(249,115,22,0.12), inset 0 0 20px rgba(249,115,22,0.05)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Flame size={14} style={{ color: "#F97316" }} />
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#F97316", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  The Roast
                </span>
              </div>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.92rem", color: "#F0E0D0", lineHeight: 1.7 }}>
                <TypewriterText text={result.roast} speed={18} />
              </p>
            </div>

            {/* Key lessons */}
            {result.keyLessons?.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="rounded-xl p-4" style={{ background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)" }}>
                <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#F5A623", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
                  Key Lessons
                </p>
                <ul className="flex flex-col gap-1.5">
                  {result.keyLessons.map((l, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span style={{ color: "#F5A623", fontSize: "0.75rem", marginTop: 3 }}>→</span>
                      <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.83rem", color: "#C0A060" }}>{l}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Fixed code */}
            {result.fixedCode && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="rounded-xl overflow-hidden" style={{ border: "2px solid rgba(26,111,232,0.4)", boxShadow: "0 0 24px rgba(26,111,232,0.12)" }}>
                <div className="flex items-center justify-between px-4 py-2" style={{ background: "#080812", borderBottom: "1px solid rgba(26,111,232,0.2)" }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#4D91F0", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Here's what a senior dev would do:
                  </span>
                </div>
                <pre style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.78rem", color: "#A0C8FF", background: "#06080F", padding: "1rem", overflowX: "auto", lineHeight: 1.65, margin: 0 }}>
                  {result.fixedCode}
                </pre>
              </motion.div>
            )}

            {/* Share button */}
            <div className="flex justify-end">
              <motion.button onClick={handleCopy} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "#808098", fontFamily: "DM Sans, sans-serif" }}>
                {copied ? <><Check size={13} style={{ color: "#22C55E" }} /> Copied!</> : <><Copy size={13} /> Share Roast</>}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
