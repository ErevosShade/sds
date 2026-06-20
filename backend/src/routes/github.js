import { Router } from "express";

const router = Router();

const GH = "https://api.github.com";
const HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "SDS-Chaos-Page/1.0",
};

router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // 1. User profile
    const userRes = await fetch(`${GH}/users/${username}`, { headers: HEADERS });
    if (userRes.status === 404) return res.status(404).json({ error: "GitHub user not found. Are you sure that's right? 🤔" });
    if (userRes.status === 403) return res.status(429).json({ error: "We're asking GitHub too many questions. Try again in a minute. ⏳" });
    const user = await userRes.json();

    // 2. Repos (top 30 by stars)
    const reposRes = await fetch(`${GH}/users/${username}/repos?per_page=30&sort=stars`, { headers: HEADERS });
    const repos    = await reposRes.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      return res.status(200).json({
        empty: true,
        message: "This dev keeps things private! Respect 🤐",
        user: { name: user.name || username, avatar: user.avatar_url },
      });
    }

    // 3. Language aggregation
    const langCount = {};
    const langFetches = repos.slice(0, 10).map(r =>
      fetch(`${GH}/repos/${username}/${r.name}/languages`, { headers: HEADERS })
        .then(r => r.json()).catch(() => ({}))
    );
    const langResults = await Promise.all(langFetches);
    langResults.forEach(langs => {
      Object.entries(langs).forEach(([lang, bytes]) => {
        langCount[lang] = (langCount[lang] || 0) + bytes;
      });
    });

    const totalBytes = Object.values(langCount).reduce((a, b) => a + b, 0) || 1;
    const topLangs   = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang, bytes]) => ({ lang, pct: Math.round((bytes / totalBytes) * 100) }));

    // 4. Commit activity (contributions last year)
    const activityRes = await fetch(
      `${GH}/users/${username}/events/public?per_page=100`,
      { headers: HEADERS }
    );
    const events = await activityRes.json();
    const monthMap = {};
    (Array.isArray(events) ? events : [])
      .filter(e => e.type === "PushEvent")
      .forEach(e => {
        const month = e.created_at.slice(0, 7); // "2024-03"
        monthMap[month] = (monthMap[month] || 0) + (e.payload?.commits?.length || 1);
      });
    const mountains = Object.entries(monthMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, commits]) => ({ month, commits }));

    // 5. Constellation (top repos)
    const constellation = repos.slice(0, 10).map(r => ({
      name:        r.name,
      description: r.description || "",
      stars:       r.stargazers_count,
      forks:       r.forks_count,
      language:    r.language || "Unknown",
      url:         r.html_url,
      size:        Math.max(8, Math.min(36, 8 + (r.stargazers_count * 2))),
    }));

    // 6. Helix strands
    const COLORS = ["#1A6FE8", "#F5A623", "#4D91F0", "#22C55E", "#EF4444"];
    const helix = topLangs.map((l, i) => ({
      label:   l.lang,
      pct:     l.pct,
      color:   COLORS[i % COLORS.length],
    }));

    // 7. Stats
    const totalCommits = mountains.reduce((a, b) => a + b.commits, 0);
    const topRepo      = repos[0];

    res.json({
      user: {
        name:      user.name || username,
        login:     user.login,
        avatar:    user.avatar_url,
        bio:       user.bio || "",
        followers: user.followers,
        repos:     user.public_repos,
        url:       user.html_url,
      },
      helix,
      mountains,
      constellation,
      stats: {
        totalCommits,
        topLanguage: topLangs[0]?.lang || "Unknown",
        topRepo:     topRepo?.name || "N/A",
        topRepoUrl:  topRepo?.html_url || "#",
        followers:   user.followers,
        publicRepos: user.public_repos,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Couldn't reach GitHub. Check your connection 🔌" });
  }
});

export default router;
