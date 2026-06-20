import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Search, ExternalLink, Star, GitFork, Copy, Check, ChevronDown, ChevronUp, Sparkles, RotateCcw, Users, Code2, Briefcase, Link2, Globe } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "../../utils/api.js";

const LC = { Python:"#3776AB",JavaScript:"#F7DF1E",TypeScript:"#3178C6",Java:"#ED8B00","C++":"#00599C",Go:"#00ADD8",Rust:"#CE4123",Ruby:"#CC342D",PHP:"#777BB4",Swift:"#FA7343",Kotlin:"#7F52FF","C#":"#239120",HTML:"#E34F26",CSS:"#1572B6",Shell:"#89E051",Other:"#606080" };
const lc = l => LC[l] || LC.Other;

const SHIELD_META = { Python:{logo:"python",color:"3776AB"},JavaScript:{logo:"javascript",color:"F7DF1E",lc:"black"},TypeScript:{logo:"typescript",color:"3178C6"},Java:{logo:"java",color:"ED8B00"},"C++":{logo:"cplusplus",color:"00599C"},Go:{logo:"go",color:"00ADD8"},Rust:{logo:"rust",color:"CE4123"},Ruby:{logo:"ruby",color:"CC342D"},PHP:{logo:"php",color:"777BB4"},Swift:{logo:"swift",color:"FA7343"},Kotlin:{logo:"kotlin",color:"7F52FF"},"C#":{logo:"csharp",color:"239120"},HTML:{logo:"html5",color:"E34F26"},CSS:{logo:"css3",color:"1572B6"},Shell:{logo:"gnubash",color:"4EAA25"} };

function Constellation({ repos }) {
  const [hov, setHov] = useState(null);
  if (!repos?.length) return <p style={{color:"#3A3A5A",fontFamily:"DM Sans,sans-serif",fontSize:"0.8rem",textAlign:"center",padding:"2rem 0"}}>No public repos</p>;
  const pos = repos.map((_,i) => { const a=(i/repos.length)*2*Math.PI-Math.PI/2, r=i%2===0?36:22; return {cx:50+r*Math.cos(a),cy:50+r*Math.sin(a)}; });
  return (
    <svg viewBox="0 0 100 100" style={{width:"100%",maxHeight:200}}>
      {pos.map((p,i)=>pos.slice(i+1,i+3).map((q,j)=><line key={`${i}-${j}`} x1={p.cx} y1={p.cy} x2={q.cx} y2={q.cy} stroke="rgba(26,111,232,0.12)" strokeWidth={0.4}/>))}
      {repos.map((r,i)=>{ const {cx,cy}=pos[i]; const stars=typeof r.stars==="number"?r.stars:0; const s=Math.max(2,Math.min(5,2+stars*0.4)); const h=hov===i; return (
        <g key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} style={{cursor:"pointer"}}>
          <circle cx={cx} cy={cy} r={h?s+3:s+1.5} fill={`${h?"#F5A623":"#1A6FE8"}18`}/>
          <circle cx={cx} cy={cy} r={h?s*1.5:s} fill={h?"#F5A623":"#4D91F0"} style={{filter:`drop-shadow(0 0 ${h?4:2}px ${h?"#F5A623":"#1A6FE8"})`,transition:"r 0.2s,fill 0.2s"}}/>
          {h&&<foreignObject x={Math.min(cx-18,62)} y={cy+s+2} width={36} height={10}><div style={{fontFamily:"DM Sans,sans-serif",fontSize:"4.5px",color:"#F0F0F0",textAlign:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.name} ⭐{stars}</div></foreignObject>}
        </g>
      );})}
    </svg>
  );
}

const LOAD_LINES = ["Reading commit history...","Mapping repositories...","Building your story..."];
function CinematicLoader() {
  const [li,setLi]=useState(0);
  useState(()=>{ const t=setInterval(()=>setLi(i=>Math.min(i+1,2)),700); return ()=>clearInterval(t); });
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 flex flex-col items-center justify-center z-50" style={{background:"rgba(5,5,16,0.96)",backdropFilter:"blur(16px)"}}>
      {[0,1,2].map(i=><motion.div key={i} className="absolute rounded-full" initial={{width:0,height:0,opacity:0.6}} animate={{width:180+i*110,height:180+i*110,opacity:0}} transition={{duration:2.2,delay:i*0.45,ease:"easeOut"}} style={{border:`1px solid ${i%2===0?"#1A6FE8":"#F5A623"}`}}/>)}
      <motion.p key={li} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} style={{fontFamily:"Syne,sans-serif",fontSize:"1.1rem",fontWeight:700,color:"#F0F0F0",zIndex:1,marginBottom:"1.5rem"}}>{LOAD_LINES[li]}</motion.p>
      <div className="w-48 h-0.5 rounded-full overflow-hidden z-10" style={{background:"rgba(255,255,255,0.06)"}}>
        <motion.div className="h-full rounded-full" initial={{width:"0%"}} animate={{width:"100%"}} transition={{duration:2,ease:"easeInOut"}} style={{background:"linear-gradient(90deg,#1A6FE8,#F5A623)"}}/>
      </div>
    </motion.div>
  );
}

function buildFallbackReadme(gh, prefs) {
  const u=gh.user.login, name=gh.user.name||u;
  const langs=(gh.helix||[]).slice(0,5).map(h=>h.label);
  const repos=(gh.constellation||[]).slice(0,4);
  const vibeColor={"🖤 Hacker":"00FF41","✨ Minimalist":"FFFFFF","🎨 Creative":"F5A623","💼 Professional":"1A6FE8"};
  const themeMap={"🖤 Hacker":"tokyonight","✨ Minimalist":"default","🎨 Creative":"radical","💼 Professional":"dark"};
  const trophyMap={"🖤 Hacker":"matrix","✨ Minimalist":"flat","🎨 Creative":"dracula","💼 Professional":"nord"};
  const color=vibeColor[prefs.vibe]||"1A6FE8", theme=themeMap[prefs.vibe]||"dark", trophy=trophyMap[prefs.vibe]||"nord";
  const toneIntro={Serious:`I'm ${name}, a software and data science developer.`,Casual:`Hey! I'm ${name} 👋 I love building things and exploring data.`,Funny:`I'm ${name}. I write code. Sometimes it even works. 🤷`,"Full Cringe 💀":`HEYYYY I'M ${name.toUpperCase()} 🔥🔥🔥 I CODE THINGS AND SOMETIMES THEY WORK 💀`}[prefs.tone]||`I'm ${name}.`;
  const lineMap={"🖤 Hacker":`Hey+I'm+${encodeURIComponent(name)}+👾;sudo+apt+get+skills;Always+Building;Coffee+→+Code`,"✨ Minimalist":`${encodeURIComponent(name)};Developer`,"🎨 Creative":`Hey+I'm+${encodeURIComponent(name)}+🎨;I+Build+Cool+Stuff;Code+is+my+Canvas`,"💼 Professional":`${encodeURIComponent(name)};Software+%26+Data+Engineer;Open+to+Opportunities`};
  const lines=lineMap[prefs.vibe]||encodeURIComponent(name);
  const badges=langs.map(l=>{ const m=SHIELD_META[l]; if(!m) return `![${l}](https://img.shields.io/badge/${encodeURIComponent(l)}-555555?style=for-the-badge)`; return `![${l}](https://img.shields.io/badge/${encodeURIComponent(l)}-${m.color}?style=for-the-badge&logo=${m.logo}&logoColor=${m.lc||"white"})`; }).join("\n");
  const flexSet=new Set(prefs.flex);
  return `<div align="center">\n\n<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=22&pause=1000&color=${color}&center=true&vCenter=true&width=600&lines=${lines}" alt="Typing SVG" />\n\n</div>\n\n---\n\n## 👋 About Me\n\n${toneIntro}\n\n- 🔭 Working on: **${prefs.workingOn||"something cool"}**\n- 🌱 Learning: **${prefs.learning||"new technologies"}**\n- ⚡ Fun fact: *${prefs.funFact||"I love coding"}*\n\n---\n${flexSet.has("Skills & Badges")?`\n## 🛠️ Tech Stack\n\n${badges}\n\n---\n`:""}${flexSet.has("GitHub Stats")?`\n## 📊 GitHub Stats\n\n<div align="center">\n\n<img src="https://github-readme-stats.vercel.app/api?username=${u}&show_icons=true&theme=${theme}&hide_border=true&bg_color=00000000" height="165" />\n<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${u}&layout=compact&theme=${theme}&hide_border=true&bg_color=00000000" height="165" />\n\n</div>\n\n---\n`:""}${flexSet.has("Streak Counter")?`\n## 🔥 Streak\n\n<div align="center">\n<img src="https://streak-stats.demolab.com/?user=${u}&theme=${theme}&hide_border=true" />\n</div>\n\n---\n`:""}${flexSet.has("Trophies")?`\n## 🏆 Trophies\n\n<div align="center">\n<img src="https://github-profile-trophy.vercel.app/?username=${u}&theme=${trophy}&no-frame=true&no-bg=true&margin-w=4" />\n</div>\n\n---\n`:""}${flexSet.has("Activity Graph")?`\n## 📈 Activity\n\n<img src="https://github-readme-activity-graph.vercel.app/graph?username=${u}&theme=react-dark&hide_border=true&bg_color=00000000" />\n\n---\n`:""}${flexSet.has("Contribution Snake")?`\n## 🐍 Contribution Snake\n\n<!-- Setup: Actions → New Workflow → snake.yml -->\n<picture>\n  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/${u}/${u}/output/github-contribution-grid-snake-dark.svg">\n  <img alt="snake" src="https://raw.githubusercontent.com/${u}/${u}/output/github-contribution-grid-snake.svg">\n</picture>\n\n---\n`:""}${flexSet.has("Featured Projects")&&repos.length?`\n## 🚀 Featured Projects\n\n| Project | Description | Stars |\n|---------|-------------|-------|\n${repos.map(r=>`| [**${r.name}**](${r.url}) | ${(r.description||"No description").slice(0,60)} | ⭐ ${r.stars??0} |`).join("\n")}\n\n---\n`:""}${flexSet.has("Social Links")&&prefs.socialLinks?`\n## 🤝 Connect\n\n${prefs.socialLinks.twitter?`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](${prefs.socialLinks.twitter})\n`:""}`+`${prefs.socialLinks.linkedin?`[![Code2](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](${prefs.socialLinks.linkedin})\n`:""}`+`${prefs.socialLinks.website?`[![Website](https://img.shields.io/badge/Website-000000?style=for-the-badge&logo=About.me&logoColor=white)](${prefs.socialLinks.website})\n`:""}\n---\n`:""}\n<div align="center">\n\n<img src="https://komarev.com/ghpvc/?username=${u}&color=${color}&style=for-the-badge&label=PROFILE+VIEWS" />\n\n</div>`;
}

const VIBES=["🖤 Hacker","✨ Minimalist","🎨 Creative","💼 Professional"];
const TONES=["Serious","Casual","Funny","Full Cringe 💀"];
const SECTIONS=["GitHub Stats","Streak Counter","Skills & Badges","Trophies","Activity Graph","Contribution Snake","Featured Projects","Social Links"];

function ProfileGenerator({ githubData }) {
  const [vibe,setVibe]=useState(null);
  const [flex,setFlex]=useState(["GitHub Stats","Streak Counter","Skills & Badges","Trophies"]);
  const [tone,setTone]=useState(null);
  const [workingOn,setWorkingOn]=useState("");
  const [learning,setLearning]=useState("");
  const [funFact,setFunFact]=useState("");
  const [socialLinks,setSocialLinks]=useState({twitter:"",linkedin:"",website:""});
  const [readme,setReadme]=useState(null);
  const [generating,setGenerating]=useState(false);
  const [copied,setCopied]=useState(false);
  const [showHow,setShowHow]=useState(false);
  const [step,setStep]=useState(0);
  const canGenerate=vibe&&tone;

  const generate=async()=>{
    setGenerating(true); setReadme(null);
    const payload={
      githubData:{ username:githubData.user.login, name:githubData.user.name||githubData.user.login, bio:githubData.user.bio||"", topLanguages:(githubData.helix||[]).map(h=>h.label), topRepos:(githubData.constellation||[]).slice(0,5).map(r=>({name:r.name,description:r.description,stars:r.stars??0,url:r.url})), followers:githubData.user.followers },
      preferences:{ vibe,flex,tone,workingOn,learning,funFact,socialLinks }
    };
    try { const res=await api.generateReadme(payload); setReadme(res.readme||res.raw||""); }
    catch { setReadme(buildFallbackReadme(githubData,{vibe,flex,tone,workingOn,learning,funFact,socialLinks})); }
    finally { setGenerating(false); }
  };

  const copyReadme=()=>{ navigator.clipboard.writeText(readme); setCopied(true); setTimeout(()=>setCopied(false),2500); };
  const STEPS=["Style","Content","About","Socials"];

  const inputStyle={width:"100%",padding:"0.65rem 0.9rem",borderRadius:"0.65rem",border:"none",fontFamily:"DM Sans,sans-serif",fontSize:"0.82rem",background:"#080812",color:"#E0E0E0",outline:"1px solid rgba(255,255,255,0.08)",boxSizing:"border-box",transition:"outline-color 0.2s"};
  const labelStyle={fontFamily:"JetBrains Mono,monospace",fontSize:"0.58rem",color:"#606080",textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:"0.35rem"};

  return (
    <div style={{marginTop:"0.5rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:"0.75rem",margin:"1.5rem 0"}}>
        <div style={{flex:1,height:1,background:"rgba(255,255,255,0.06)"}}/>
        <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:"0.6rem",color:"#F5A623",textTransform:"uppercase",letterSpacing:"0.14em"}}>✦ generate your readme ✦</span>
        <div style={{flex:1,height:1,background:"rgba(255,255,255,0.06)"}}/>
      </div>
      <h3 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"1.05rem",color:"#F0F0F0",margin:"0 0 0.2rem"}}>🎨 Profile README Generator</h3>
      <p style={{fontFamily:"DM Sans,sans-serif",fontSize:"0.75rem",color:"#606080",margin:"0 0 1.25rem"}}>Animated headers, badges, stats, trophies — one click.</p>

      {/* Steps */}
      <div style={{display:"flex",gap:"0.4rem",marginBottom:"1.25rem"}}>
        {STEPS.map((s,i)=>(
          <button key={s} onClick={()=>setStep(i)} style={{flex:1,padding:"0.4rem 0",borderRadius:"0.5rem",border:"none",fontFamily:"JetBrains Mono,monospace",fontSize:"0.55rem",cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.08em",transition:"all 0.2s",background:step===i?"rgba(245,166,35,0.15)":"rgba(255,255,255,0.04)",color:step===i?"#F5A623":"#3A3A5A",borderBottom:`2px solid ${step===i?"#F5A623":"transparent"}`}}>{i+1}.{s}</button>
        ))}
      </div>

      {/* Step 0: Style */}
      {step===0&&(
        <motion.div initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          <div>
            <label style={labelStyle}>Vibe *</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.4rem"}}>
              {VIBES.map(v=><motion.button key={v} onClick={()=>setVibe(v)} whileTap={{scale:0.96}} style={{padding:"0.65rem",borderRadius:"0.65rem",border:"none",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:"0.82rem",textAlign:"center",transition:"all 0.2s",background:vibe===v?"rgba(245,166,35,0.15)":"rgba(255,255,255,0.04)",outline:`1px solid ${vibe===v?"rgba(245,166,35,0.5)":"rgba(255,255,255,0.08)"}`,color:vibe===v?"#F5A623":"#808098"}}>{v}</motion.button>)}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Tone *</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.4rem"}}>
              {TONES.map(t=><motion.button key={t} onClick={()=>setTone(t)} whileTap={{scale:0.96}} style={{padding:"0.6rem",borderRadius:"0.65rem",border:"none",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:"0.8rem",textAlign:"center",transition:"all 0.2s",background:tone===t?"rgba(26,111,232,0.15)":"rgba(255,255,255,0.04)",outline:`1px solid ${tone===t?"rgba(26,111,232,0.45)":"rgba(255,255,255,0.08)"}`,color:tone===t?"#4D91F0":"#808098"}}>{t}</motion.button>)}
            </div>
          </div>
          <button onClick={()=>setStep(1)} style={{padding:"0.65rem",borderRadius:"0.65rem",border:"none",cursor:"pointer",background:canGenerate?"rgba(245,166,35,0.12)":"rgba(255,255,255,0.04)",color:canGenerate?"#F5A623":"#3A3A5A",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:"0.82rem",outline:`1px solid ${canGenerate?"rgba(245,166,35,0.3)":"rgba(255,255,255,0.06)"}`}}>Next → Content</button>
        </motion.div>
      )}

      {/* Step 1: Content */}
      {step===1&&(
        <motion.div initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} style={{display:"flex",flexDirection:"column",gap:"0.9rem"}}>
          <label style={labelStyle}>Sections to include</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
            {SECTIONS.map(s=>{ const on=flex.includes(s); return <motion.button key={s} whileTap={{scale:0.93}} onClick={()=>setFlex(p=>on?p.filter(x=>x!==s):[...p,s])} style={{padding:"0.4rem 0.75rem",borderRadius:"9999px",border:"none",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:"0.75rem",transition:"all 0.2s",background:on?"rgba(26,111,232,0.18)":"rgba(255,255,255,0.04)",outline:`1px solid ${on?"rgba(26,111,232,0.5)":"rgba(255,255,255,0.08)"}`,color:on?"#4D91F0":"#606080"}}>{on?"✓ ":""}{s}</motion.button>; })}
          </div>
          <div style={{display:"flex",gap:"0.4rem",marginTop:"0.3rem"}}>
            <button onClick={()=>setStep(0)} style={{flex:1,padding:"0.6rem",borderRadius:"0.65rem",border:"none",cursor:"pointer",background:"rgba(255,255,255,0.04)",color:"#606080",fontFamily:"DM Sans,sans-serif",fontSize:"0.8rem"}}>← Back</button>
            <button onClick={()=>setStep(2)} style={{flex:2,padding:"0.6rem",borderRadius:"0.65rem",border:"none",cursor:"pointer",background:"rgba(26,111,232,0.12)",color:"#4D91F0",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:"0.8rem",outline:"1px solid rgba(26,111,232,0.3)"}}>Next → About</button>
          </div>
        </motion.div>
      )}

      {/* Step 2: About */}
      {step===2&&(
        <motion.div initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} style={{display:"flex",flexDirection:"column",gap:"0.8rem"}}>
          {[{val:workingOn,set:setWorkingOn,ph:"Building a RAG pipeline · DSA grind...",label:"Currently working on?"},{val:learning,set:setLearning,ph:"Transformers · Rust · System Design...",label:"Currently learning?"},{val:funFact,set:setFunFact,ph:"I debug at 3am. I've read Python docs for fun.",label:"Fun fact"}].map(f=>(
            <div key={f.label}>
              <label style={labelStyle}>{f.label}</label>
              <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={inputStyle} onFocus={e=>e.target.style.outlineColor="rgba(245,166,35,0.4)"} onBlur={e=>e.target.style.outlineColor="rgba(255,255,255,0.08)"}/>
            </div>
          ))}
          <div style={{display:"flex",gap:"0.4rem",marginTop:"0.2rem"}}>
            <button onClick={()=>setStep(1)} style={{flex:1,padding:"0.6rem",borderRadius:"0.65rem",border:"none",cursor:"pointer",background:"rgba(255,255,255,0.04)",color:"#606080",fontFamily:"DM Sans,sans-serif",fontSize:"0.8rem"}}>← Back</button>
            <button onClick={()=>setStep(3)} style={{flex:2,padding:"0.6rem",borderRadius:"0.65rem",border:"none",cursor:"pointer",background:"rgba(26,111,232,0.12)",color:"#4D91F0",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:"0.8rem",outline:"1px solid rgba(26,111,232,0.3)"}}>Next → Socials</button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Socials + Generate */}
      {step===3&&(
        <motion.div initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} style={{display:"flex",flexDirection:"column",gap:"0.8rem"}}>
          {[{key:"twitter",label:"Twitter / X URL",ph:"https://twitter.com/handle"},{key:"linkedin",label:"LinkedIn URL",ph:"https://linkedin.com/in/name"},{key:"website",label:"Personal Website",ph:"https://yoursite.dev"}].map(s=>(
            <div key={s.key}>
              <label style={labelStyle}>{s.label}</label>
              <input value={socialLinks[s.key]||""} onChange={e=>setSocialLinks(p=>({...p,[s.key]:e.target.value}))} placeholder={s.ph} style={inputStyle}/>
            </div>
          ))}
          <div style={{display:"flex",gap:"0.4rem",marginTop:"0.3rem"}}>
            <button onClick={()=>setStep(2)} style={{flex:1,padding:"0.6rem",borderRadius:"0.65rem",border:"none",cursor:"pointer",background:"rgba(255,255,255,0.04)",color:"#606080",fontFamily:"DM Sans,sans-serif",fontSize:"0.8rem"}}>← Back</button>
            <motion.button onClick={generate} disabled={!canGenerate||generating} whileHover={canGenerate?{scale:1.02,boxShadow:"0 0 24px rgba(245,166,35,0.35)"}:{}} whileTap={canGenerate?{scale:0.97}:{}} style={{flex:2,display:"flex",alignItems:"center",justifyContent:"center",gap:"0.4rem",padding:"0.7rem",borderRadius:"0.65rem",border:"none",fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"0.88rem",background:canGenerate?"linear-gradient(135deg,#1A6FE8,#F5A623)":"rgba(255,255,255,0.06)",color:"#fff",cursor:canGenerate?"pointer":"not-allowed",opacity:canGenerate?1:0.5,transition:"all 0.3s"}}>
              {generating?<><motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}}><Sparkles size={15}/></motion.div>Building...</>:<><Sparkles size={15}/>Generate README ✨</>}
            </motion.button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {readme&&(
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}} style={{marginTop:"1.25rem",display:"flex",flexDirection:"column",gap:"0.65rem"}}>
            {/* Included tags */}
            <div style={{padding:"0.65rem 0.9rem",borderRadius:"0.65rem",background:"rgba(26,111,232,0.07)",border:"1px solid rgba(26,111,232,0.2)"}}>
              <p style={{...labelStyle,color:"#4D91F0",marginBottom:"0.45rem"}}>🎬 Your README includes</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>
                {["⌨️ Typing SVG",...flex.map(f=>`✓ ${f}`),"👁 Visitor Counter"].map(item=><span key={item} style={{padding:"0.2rem 0.55rem",borderRadius:"9999px",fontFamily:"DM Sans,sans-serif",fontSize:"0.65rem",background:"rgba(26,111,232,0.12)",border:"1px solid rgba(26,111,232,0.25)",color:"#4D91F0"}}>{item}</span>)}
              </div>
            </div>
            {/* Markdown output */}
            <div style={{borderRadius:"0.75rem",overflow:"hidden",border:"1px solid rgba(245,166,35,0.3)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.5rem 0.9rem",background:"#060810",borderBottom:"1px solid rgba(245,166,35,0.15)"}}>
                <span style={{...labelStyle,color:"#F5A623",margin:0}}>README.md</span>
                <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:"0.58rem",color:"#3A3A5A"}}>{readme.split("\n").length} lines</span>
              </div>
              <pre style={{fontFamily:"JetBrains Mono,monospace",fontSize:"0.68rem",color:"#C0C0D0",background:"#060810",padding:"0.9rem 1rem",overflowX:"auto",overflowY:"auto",maxHeight:"300px",lineHeight:1.65,margin:0,scrollbarWidth:"thin",scrollbarColor:"#2A2A3A transparent"}}>{readme}</pre>
            </div>
            {/* Actions */}
            <div style={{display:"flex",gap:"0.5rem"}}>
              <motion.button onClick={copyReadme} whileHover={{scale:1.02}} whileTap={{scale:0.97}} style={{flex:2,display:"flex",alignItems:"center",justifyContent:"center",gap:"0.4rem",padding:"0.65rem",borderRadius:"0.65rem",border:"none",cursor:"pointer",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:"0.82rem",background:copied?"rgba(34,197,94,0.15)":"rgba(245,166,35,0.12)",outline:`1px solid ${copied?"rgba(34,197,94,0.4)":"rgba(245,166,35,0.3)"}`,color:copied?"#22C55E":"#F5A623",transition:"all 0.2s"}}>
                {copied?<><Check size={13}/>Copied!</>:<><Copy size={13}/>Copy README</>}
              </motion.button>
              <motion.button onClick={generate} whileHover={{scale:1.02}} whileTap={{scale:0.97}} style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"0.65rem 0.9rem",borderRadius:"0.65rem",border:"none",cursor:"pointer",background:"rgba(255,255,255,0.04)",outline:"1px solid rgba(255,255,255,0.08)",color:"#606080"}}><RotateCcw size={13}/></motion.button>
            </div>
            {/* How to use */}
            <button onClick={()=>setShowHow(h=>!h)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"0.6rem 0.9rem",borderRadius:"0.65rem",border:"none",background:"rgba(255,255,255,0.03)",outline:"1px solid rgba(255,255,255,0.07)",cursor:"pointer",color:"#808098",fontFamily:"DM Sans,sans-serif",fontSize:"0.78rem"}}>
              <span>📖 How to add this to GitHub</span>{showHow?<ChevronUp size={12}/>:<ChevronDown size={12}/>}
            </button>
            <AnimatePresence>
              {showHow&&<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} style={{overflow:"hidden"}}>
                <div style={{padding:"0.9rem",borderRadius:"0.65rem",background:"#080812",border:"1px solid rgba(255,255,255,0.07)",display:"flex",flexDirection:"column",gap:"0.65rem"}}>
                  {[["1","Create a new GitHub repo named exactly your username (e.g. 'alice' creates 'alice/alice')"],["2","Make it Public and check 'Add a README file'"],["3","Click the pencil icon on README.md → select all → paste → commit"],["4","For 🐍 Snake: Go to Actions tab → New Workflow → search 'snake' or paste snake.yml manually"]].map(([n,txt])=>(
                    <div key={n} style={{display:"flex",gap:"0.6rem"}}>
                      <span style={{width:18,height:18,borderRadius:"50%",flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(245,166,35,0.15)",color:"#F5A623",fontFamily:"Syne,sans-serif",fontSize:"0.58rem",fontWeight:800}}>{n}</span>
                      <p style={{fontFamily:"DM Sans,sans-serif",fontSize:"0.78rem",color:"#A0A0B0",lineHeight:1.5,margin:0}}>{txt}</p>
                    </div>
                  ))}
                </div>
              </motion.div>}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GitHubCinematic() {
  const [username,setUsername]=useState("");
  const [data,setData]=useState(null);
  const [loading,setLoading]=useState(false);
  const [cinematic,setCinematic]=useState(false);
  const [error,setError]=useState(null);

  const visualize=async()=>{
    const u=username.trim(); if(!u) return;
    setLoading(true); setError(null); setData(null); setCinematic(true);
    try { const res=await api.github(u); if(res.empty) setError(res.message||"This dev keeps things private 🤐"); else setData(res); }
    catch(err){ setError(err.message||"Couldn't reach GitHub 🔌"); }
    finally { setLoading(false); setTimeout(()=>setCinematic(false),400); }
  };

  return (
    <div style={{padding:"1.5rem",display:"flex",flexDirection:"column",gap:"1.25rem"}}>
      <AnimatePresence>{cinematic&&<CinematicLoader/>}</AnimatePresence>
      <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
        <div style={{width:40,height:40,borderRadius:"0.75rem",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(26,111,232,0.15)",border:"1px solid rgba(26,111,232,0.3)"}}><Eye size={20} style={{color:"#1A6FE8"}}/></div>
        <div><h2 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"1.2rem",color:"#F0F0F0",margin:0}}>GitHub Cinematic</h2><p style={{fontFamily:"DM Sans,sans-serif",fontSize:"0.78rem",color:"#606080",margin:0}}>Your dev story, visualized.</p></div>
      </div>
      <div style={{display:"flex",gap:"0.75rem"}}>
        <input value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==="Enter"&&visualize()} placeholder="Enter GitHub username..." style={{flex:1,padding:"0.75rem 1rem",borderRadius:"0.75rem",fontFamily:"DM Sans,sans-serif",fontSize:"0.9rem",background:"#080812",color:"#E0E0E0",border:"none",outline:"1px solid rgba(26,111,232,0.25)"}} onFocus={e=>e.target.style.outlineColor="rgba(26,111,232,0.55)"} onBlur={e=>e.target.style.outlineColor="rgba(26,111,232,0.25)"}/>
        <motion.button onClick={visualize} disabled={loading||!username.trim()} whileHover={{scale:1.05,boxShadow:"0 0 20px rgba(26,111,232,0.4)"}} whileTap={{scale:0.95}} style={{padding:"0.75rem 1.25rem",borderRadius:"0.75rem",border:"none",cursor:"pointer",background:"linear-gradient(135deg,#1A6FE8,#1258C0)",color:"#fff",boxShadow:"0 4px 16px rgba(26,111,232,0.3)"}}><Search size={16}/></motion.button>
      </div>
      <AnimatePresence>{error&&<motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{padding:"0.9rem 1rem",borderRadius:"0.75rem",background:"rgba(245,166,35,0.08)",border:"1px solid rgba(245,166,35,0.25)",color:"#F5A623",fontFamily:"DM Sans,sans-serif",fontSize:"0.88rem"}}>{error}</motion.div>}</AnimatePresence>

      <AnimatePresence>
        {data&&(
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.6,ease:[0.22,1,0.36,1]}} style={{display:"flex",flexDirection:"column",gap:"0.85rem"}}>

            {/* BIG USER CARD */}
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.05}} style={{borderRadius:"1.25rem",overflow:"hidden",background:"linear-gradient(135deg,#080A1A,#0A1020,#080A18)",border:"1px solid rgba(26,111,232,0.3)",boxShadow:"0 0 48px rgba(26,111,232,0.1)"}}>
              <div style={{height:3,background:"linear-gradient(90deg,#1A6FE8,#F5A623,#1A6FE8)"}}/>
              <div style={{padding:"1.5rem",display:"flex",gap:"1.25rem",alignItems:"flex-start"}}>
                <div style={{position:"relative",flexShrink:0}}>
                  <img src={data.user.avatar} alt={data.user.name} style={{width:80,height:80,borderRadius:"50%",border:"3px solid rgba(26,111,232,0.5)",boxShadow:"0 0 24px rgba(26,111,232,0.3)"}} loading="lazy"/>
                  <div style={{position:"absolute",bottom:2,right:2,width:14,height:14,borderRadius:"50%",background:"#22C55E",border:"2px solid #080A1A",boxShadow:"0 0 8px rgba(34,197,94,0.5)"}}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"Syne,sans-serif",fontWeight:900,fontSize:"1.3rem",color:"#F0F0F0",lineHeight:1.1}}>{data.user.name}</div>
                  <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:"0.72rem",color:"#4D91F0",marginTop:"0.15rem"}}>@{data.user.login}</div>
                  {data.user.bio&&<p style={{fontFamily:"DM Sans,sans-serif",fontSize:"0.82rem",color:"#808098",marginTop:"0.5rem",lineHeight:1.5}}>{data.user.bio}</p>}
                  <div style={{display:"flex",gap:"0.45rem",marginTop:"0.65rem",flexWrap:"wrap"}}>
                    {[{val:data.user.followers,label:"followers",color:"#22C55E"},{val:data.stats?.publicRepos||data.user?.repos||0,label:"repos",color:"#4D91F0"},{val:data.stats?.totalCommits||0,label:"commits",color:"#F5A623"}].map(s=>(
                      <div key={s.label} style={{display:"flex",alignItems:"center",gap:"0.3rem",padding:"0.2rem 0.55rem",borderRadius:"9999px",background:`${s.color}12`,border:`1px solid ${s.color}25`,color:s.color}}>
                        <span style={{fontFamily:"Syne,sans-serif",fontSize:"0.75rem",fontWeight:700}}>{s.val}</span>
                        <span style={{fontFamily:"DM Sans,sans-serif",fontSize:"0.62rem",opacity:0.7}}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <a href={data.user.url} target="_blank" rel="noopener noreferrer" style={{flexShrink:0}}><ExternalLink size={14} style={{color:"#4D91F0"}}/></a>
              </div>
              {data.helix?.length>0&&<div style={{padding:"0.65rem 1.5rem",borderTop:"1px solid rgba(255,255,255,0.05)",display:"flex",gap:"0.35rem",flexWrap:"wrap"}}>
                {data.helix.slice(0,6).map(h=><span key={h.label} style={{padding:"0.18rem 0.55rem",borderRadius:"9999px",fontFamily:"JetBrains Mono,monospace",fontSize:"0.6rem",background:`${lc(h.label)}18`,color:lc(h.label),border:`1px solid ${lc(h.label)}30`}}>{h.label} {h.pct}%</span>)}
              </div>}
            </motion.div>

            {/* 3 SMALL CARDS */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.75rem"}}>
              {/* Commits */}
              <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.12}} style={{borderRadius:"1rem",padding:"1rem",background:"#080812",border:"1px solid rgba(26,111,232,0.2)",gridColumn:"1/-1"}}>
                <p style={{fontFamily:"JetBrains Mono,monospace",fontSize:"0.58rem",color:"#4D91F0",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.6rem"}}>📈 Commit Activity</p>
                {data.mountains?.length>0?(
                  <ResponsiveContainer width="100%" height={90}>
                    <AreaChart data={data.mountains} margin={{top:2,right:2,left:-24,bottom:0}}>
                      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1A6FE8" stopOpacity={0.6}/><stop offset="100%" stopColor="#1A6FE8" stopOpacity={0}/></linearGradient></defs>
                      <XAxis dataKey="month" tick={{fontSize:8,fill:"#2A2A4A",fontFamily:"JetBrains Mono"}} axisLine={false} tickLine={false}/>
                      <YAxis hide/>
                      <Tooltip contentStyle={{background:"#0D0D1A",border:"1px solid rgba(26,111,232,0.3)",borderRadius:6,color:"#F0F0F0",fontFamily:"DM Sans",fontSize:"0.72rem"}} formatter={v=>[`${v} commits`,""]}/>
                      <Area type="monotone" dataKey="commits" stroke="#1A6FE8" strokeWidth={2} fill="url(#cg)"/>
                    </AreaChart>
                  </ResponsiveContainer>
                ):<p style={{fontFamily:"DM Sans,sans-serif",fontSize:"0.75rem",color:"#3A3A5A",textAlign:"center",padding:"1.5rem 0"}}>No recent commit data</p>}
              </motion.div>

              {/* Language DNA */}
              {data.helix?.length>0&&(
                <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.18}} style={{borderRadius:"1rem",padding:"1rem",background:"#080812",border:"1px solid rgba(245,166,35,0.2)"}}>
                  <p style={{fontFamily:"JetBrains Mono,monospace",fontSize:"0.58rem",color:"#F5A623",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.75rem"}}>🧬 Language DNA</p>
                  <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                    {data.helix.slice(0,5).map((h,i)=>(
                      <motion.div key={h.label} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:0.2+i*0.07}} style={{display:"flex",alignItems:"center",gap:"0.45rem"}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:lc(h.label),flexShrink:0}}/>
                        <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:"0.62rem",color:lc(h.label),minWidth:56}}>{h.label}</span>
                        <div style={{flex:1,height:4,borderRadius:"9999px",background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
                          <motion.div initial={{width:0}} animate={{width:`${h.pct}%`}} transition={{duration:0.8,delay:0.25+i*0.07}} style={{height:"100%",borderRadius:"9999px",background:lc(h.label),boxShadow:`0 0 6px ${lc(h.label)}80`}}/>
                        </div>
                        <span style={{fontFamily:"JetBrains Mono,monospace",fontSize:"0.58rem",color:"#3A3A5A",minWidth:26,textAlign:"right"}}>{h.pct}%</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Constellation */}
              {data.constellation?.length>0&&(
                <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.22}} style={{borderRadius:"1rem",padding:"1rem",background:"#080812",border:"1px solid rgba(26,111,232,0.15)"}}>
                  <p style={{fontFamily:"JetBrains Mono,monospace",fontSize:"0.58rem",color:"#4D91F0",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.25rem"}}>✦ Repo Constellation</p>
                  <p style={{fontFamily:"DM Sans,sans-serif",fontSize:"0.58rem",color:"#3A3A5A",marginBottom:"0.3rem"}}>hover to explore</p>
                  <Constellation repos={data.constellation}/>
                </motion.div>
              )}
            </div>

            {/* Repo List */}
            {data.constellation?.length>0&&(
              <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.28}} style={{display:"flex",flexDirection:"column",gap:"0.45rem"}}>
                <p style={{fontFamily:"JetBrains Mono,monospace",fontSize:"0.58rem",color:"#3A3A5A",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.1rem"}}>Top Repositories</p>
                {data.constellation.slice(0,5).map((r,i)=>(
                  <motion.a key={r.name||i} href={r.url} target="_blank" rel="noopener noreferrer" initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:0.3+i*0.05}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.6rem 0.85rem",borderRadius:"0.65rem",textDecoration:"none",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",transition:"border-color 0.2s,background 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(26,111,232,0.3)";e.currentTarget.style.background="rgba(26,111,232,0.05)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";e.currentTarget.style.background="rgba(255,255,255,0.03)";}}>
                    <div style={{minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:"0.4rem"}}>
                        <span style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:"0.82rem",color:"#F0F0F0"}}>{r.name}</span>
                        {r.language&&<span style={{padding:"0.12rem 0.45rem",borderRadius:"9999px",fontFamily:"JetBrains Mono,monospace",fontSize:"0.57rem",background:`${lc(r.language)}18`,color:lc(r.language),border:`1px solid ${lc(r.language)}28`}}>{r.language}</span>}
                      </div>
                      {r.description&&<p style={{fontFamily:"DM Sans,sans-serif",fontSize:"0.68rem",color:"#606080",marginTop:"0.12rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:200}}>{r.description}</p>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:"0.65rem",flexShrink:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:"0.22rem"}}><Star size={10} style={{color:"#F5A623"}}/><span style={{fontFamily:"JetBrains Mono,monospace",fontSize:"0.62rem",color:"#606080"}}>{r.stars??0}</span></div>
                      <div style={{display:"flex",alignItems:"center",gap:"0.22rem"}}><GitFork size={10} style={{color:"#4D91F0"}}/><span style={{fontFamily:"JetBrains Mono,monospace",fontSize:"0.62rem",color:"#606080"}}>{r.forks??0}</span></div>
                      <ExternalLink size={10} style={{color:"#2A2A3A"}}/>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            )}

            <motion.button initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.45}} onClick={()=>navigator.clipboard.writeText(`Check out my developer DNA 🧬\n${data.stats?.totalCommits||0} commits · ${data.stats?.topLanguage||"?"} · ${data.stats?.publicRepos||0} repos\n#SDS #BITMesra #DataScience`)} style={{padding:"0.6rem",borderRadius:"0.75rem",border:"none",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:"0.8rem",background:"rgba(26,111,232,0.07)",outline:"1px solid rgba(26,111,232,0.18)",color:"#4D91F0"}}>
              📋 Copy Developer Story
            </motion.button>

            <ProfileGenerator githubData={data}/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
