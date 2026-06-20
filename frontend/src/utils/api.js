// src/utils/api.js
// Central API client — all calls go through here

const BASE = "/api"; // Vite proxies to http://localhost:3001

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  // 🔥 Roast My Code
  roast: (code) =>
    req("/roast", { method: "POST", body: JSON.stringify({ code }) }),

  // 🎮 Data or Cap
  getQuestions: (difficulty) =>
    req("/dataorcap/questions", { method: "POST", body: JSON.stringify({ difficulty }) }),

  // 🐛 Spot the Bug
  generateBug: (difficulty) =>
    req("/spotbug/generate", { method: "POST", body: JSON.stringify({ difficulty }) }),

  evaluateBug: (buggyCode, studentAnswer, language) =>
    req("/spotbug/evaluate", { method: "POST", body: JSON.stringify({ buggyCode, studentAnswer, language }) }),

  // 👁 GitHub Cinematic
  github: (username) =>
    req(`/github/${username}`),

  // 🎨 Profile README Generator
  generateReadme: (payload) =>
    req("/readme", { method: "POST", body: JSON.stringify(payload) }),
};
