import { useState, useRef, useEffect } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const NOTION_DB_ID = "2607b51163ef4049a44e08d10a36a959";
const NOTION_MCP   = "https://mcp.notion.com/mcp";
const GMAIL_MCP    = "https://gmailmcp.googleapis.com/mcp/v1";
const JULIAN_EMAIL = "contact@unifiedsolutionsinc.com";
const CALENDLY     = "https://calendly.com/unifiedsolutionsinc/30-mins-to-connect-clone";
const ADMIN_PIN    = "USC2026";  // Julian can change this

// ─── BRAND ───────────────────────────────────────────────────────────────────
const C = {
  navy:"#1B3A5A", navyDark:"#12273D", navyLight:"rgba(27,58,90,0.08)",
  olive:"#7A9C28", oliveL:"#A8C846", teal:"#4CAF9A",
  offwhite:"#F5F3EE", charcoal:"#3D3D3D", muted:"rgba(61,61,61,0.55)",
  white:"#FFFFFF",
};

// ─── DOMAINS ─────────────────────────────────────────────────────────────────
const DOMAINS = {
  identity:     { name:"Identity & Presence",     color:"#1B3A5A", light:"rgba(27,58,90,0.1)",   tagline:"Who you are as a leader under real pressure" },
  decision:     { name:"Decision Quality",         color:"#3A6B3E", light:"rgba(58,107,62,0.1)",  tagline:"How you process decisions when complexity is high" },
  relational:   { name:"Relational Intelligence",  color:"#2E6B7A", light:"rgba(46,107,122,0.1)", tagline:"How you navigate relationships and friction" },
  team:         { name:"Team Vitality",            color:"#7A5C28", light:"rgba(122,92,40,0.1)",  tagline:"The performance environment your leadership creates" },
  sustainability:{ name:"Personal Sustainability", color:"#7A2E2E", light:"rgba(122,46,46,0.1)",  tagline:"Your capacity to lead sustainably over time" },
  clarity:      { name:"Strategic Clarity",        color:"#4A3A7A", light:"rgba(74,58,122,0.1)",  tagline:"Alignment between your leadership and your direction" },
};

const DOMAIN_RESEARCH = {
  identity:     "Authentic Leadership theory (Avolio & Gardner, 2005; Walumbwa et al., 2008). Leaders whose identity isn't consolidated under pressure revert to patterns incongruent with their values — a pattern research describes as 'self-regulatory depletion.'",
  decision:     "Kahneman's dual-process theory (2011). Under cognitive load, leaders default to System 1 (fast, pattern-based) thinking even when situations require System 2 reasoning. Artinger et al. (2025) found low authentic leadership significantly increases defensive decision making.",
  relational:   "Rock's SCARF model (2008) and Goleman's EI research (2004). Sustained threat states in social domains reduce cognitive performance and collaboration quality. Relational safety is a prerequisite for organizational learning (Edmondson, 2018).",
  team:         "Edmondson's psychological safety research (1999, 2018) — including Google's Project Aristotle — found psychological safety to be the single strongest predictor of team effectiveness across 180 teams studied.",
  sustainability:"Maslach's burnout model (1981, 2001): exhaustion → depersonalization → reduced efficacy. The JD-R model (Bakker & Demerouti, 2017) demonstrates performance requires active balance between demands and resources.",
  clarity:      "Kegan's constructive developmental theory (1994). Senior leaders increasingly face demands requiring the Self-Transforming mind — holding multiple frameworks simultaneously. McKinsey (2023) found leaders with strong purpose clarity are 4x more likely to be highly engaged.",
};

const COACHING_FOCUS = {
  identity:      "This is the deepest work Julian does with upper-level leaders. Laser-focused, holistic coaching creates conditions for closing the gap between leadership aspiration and leadership reality — not through behavioral scripts, but through the self-awareness that makes genuine congruence possible.",
  decision:      "1:1 coaching works directly on the decision-making process: identifying cognitive patterns and threat responses that distort judgment under pressure, and building a more deliberate, trustworthy internal framework for decisions that matter.",
  relational:    "Group coaching is particularly powerful here — the peer environment creates live relational dynamics individual coaching cannot replicate. Team coaching addresses relational patterns at the collective level where they actually live.",
  team:          "Team coaching directly addresses this by working with the team as a system — not just developing individuals within it. Julian's ACTC-level team coaching competency focuses on the patterns between people, not just within them.",
  sustainability: "Holistic coaching is specifically designed for this pressure point. Julian's training through the Goal Imagery Institute addresses the whole person — a leader's relationship with their own capacity is inseparable from how they lead others.",
  clarity:       "This is where Julian's laser-focused methodology does its most distinctive work — quickly identifying the specific nature of the clarity gap and building toward a direction that is genuinely yours, not a version of what the role demands.",
};

// ─── QUESTIONS ───────────────────────────────────────────────────────────────
const QUESTIONS = [
  { id:"q1",  domain:"identity",      text:"When pulled into an unexpected high-stakes situation with no preparation time, how reliably do your actions reflect the leader you work to be?", options:[{s:1,t:"Rarely — pressure tends to surface patterns I am not proud of, recognized after the fact."},{s:2,t:"Inconsistently — my response depends heavily on the specific stakes and who is in the room."},{s:3,t:"Moderately — I hold my standard in most situations, but the hardest ones expose gaps I haven't resolved."},{s:4,t:"Usually — I have lapses, but I recognize them quickly and course-correct."},{s:5,t:"Consistently — pressure tends to clarify rather than distort how I lead. I know who I am in those moments."}] },
  { id:"q2",  domain:"identity",      text:"When you receive direct critical feedback about your leadership from someone whose perspective you respect, your honest first internal response is typically:", options:[{s:1,t:"Defensive — I find myself building a counterargument before they have finished speaking."},{s:2,t:"Anxious — my first concern tends to be about how this affects my standing or credibility."},{s:3,t:"Mixed — I can hear it, but I am not confident I process it without distortion."},{s:4,t:"Curious — I genuinely want to understand what is behind it, even when the discomfort is real."},{s:5,t:"Grounded — I can take it in fully without it destabilizing my sense of direction or identity."}] },
  { id:"q3",  domain:"identity",      text:"In the past 90 days, how aware have you been of a meaningful gap between how you were actually leading and how you believe you should lead?", options:[{s:1,t:"Frequently — the gap feels persistent and I have not found a reliable way to close it."},{s:2,t:"Regularly — I notice it but my attempts to address it have not been consistent enough to matter."},{s:3,t:"Occasionally — I identify it in specific situations but haven't seen it as a broader pattern."},{s:4,t:"Rarely — when it appears, I tend to recognize and self-correct relatively quickly."},{s:5,t:"Very rarely — my behavior feels genuinely aligned with my values as a leader most of the time."}] },
  { id:"q4",  domain:"decision",      text:"When you face a high-consequence decision with genuinely incomplete information, your most reliable approach is:", options:[{s:1,t:"I tend to delay until I feel more certain — even when I know the delay carries its own costs."},{s:2,t:"I move forward but often revisit and second-guess, which creates instability for people around me."},{s:3,t:"I use a mix of intuition and available data, but I am not consistently confident in my own process."},{s:4,t:"I have a reasonably clear framework for judging when enough information is enough, and I use it."},{s:5,t:"I can move decisively with incomplete information and hold that decision with appropriate confidence."}] },
  { id:"q5",  domain:"decision",      text:"When facing a genuinely complex problem — where cause and effect are unclear and no expert has the right answer — you typically:", options:[{s:1,t:"Apply a familiar framework even when I sense it does not really fit the situation."},{s:2,t:"Feel uncomfortable with the ambiguity and push for a cleaner problem definition than the situation warrants."},{s:3,t:"Recognize the complexity but struggle to deliberately adapt how I approach it."},{s:4,t:"Slow down, invite diverse perspectives, and distinguish between what I know and what I am assuming."},{s:5,t:"Move into the complexity with genuine curiosity — I iterate and probe rather than seek premature resolution."}] },
  { id:"q6",  domain:"decision",      text:"How often do you find yourself mentally revisiting decisions you have already made and implemented?", options:[{s:1,t:"Very often — it is a significant and persistent drain on my mental energy."},{s:2,t:"Often — it affects my ability to be fully present in what comes after the decision."},{s:3,t:"Sometimes — it happens but does not usually derail me or affect those around me."},{s:4,t:"Rarely — I generally trust my process and move forward without extended rumination."},{s:5,t:"Almost never — once a decision is made and implemented, my energy moves completely to execution."}] },
  { id:"q7",  domain:"relational",    text:"When a colleague or direct report consistently resists your direction without a clearly stated reason, your most typical response is:", options:[{s:1,t:"Frustration — I tend to either escalate pressure or gradually disengage from the relationship."},{s:2,t:"Avoidance — I find ways to work around the resistance rather than addressing it directly."},{s:3,t:"Concern — I notice it but I am not consistently sure how to approach it productively."},{s:4,t:"Curiosity — I try to understand the underlying concern before addressing the behavior."},{s:5,t:"Engagement — I move toward the friction because I know the conversation will clarify something important."}] },
  { id:"q8",  domain:"relational",    text:"In the past 90 days, how many times have you initiated a direct, substantive conversation with a peer about how your working styles or priorities create friction between you?", options:[{s:1,t:"Zero — those conversations feel too risky, uncomfortable, or politically costly."},{s:2,t:"Once or twice, but only because a circumstance or the other person forced it."},{s:3,t:"A few — I engage when it clearly becomes necessary, but I do not seek them out."},{s:4,t:"Regularly — I treat this as a normal part of maintaining high-quality working relationships."},{s:5,t:"Proactively and consistently — I see these conversations as a leadership responsibility."}] },
  { id:"q9",  domain:"relational",    text:"When you sense interpersonal tension within your leadership team, your most common response is:", options:[{s:1,t:"I hope it resolves on its own and avoid naming it directly."},{s:2,t:"I address it in private one-on-ones but rarely bring it to the team level where it actually lives."},{s:3,t:"I address it when it is clearly affecting performance, but I often miss the earlier signals."},{s:4,t:"I name it when I see it and create structured space for the team to work through it."},{s:5,t:"I treat surface tension as useful information and actively develop the team's capacity to navigate it together."}] },
  { id:"q10", domain:"team",          text:"If your team were asked anonymously what typically happens when they raise a problem that implicates your decisions or priorities, the most honest answer would be:", options:[{s:1,t:"They would say it is not safe — the personal cost outweighs the organizational benefit."},{s:2,t:"They would say it depends heavily on your mood or the magnitude of what they are questioning."},{s:3,t:"They would say you listen, but that meaningful change rarely follows what they surface."},{s:4,t:"They would say you engage genuinely and sometimes adjust your direction based on what you hear."},{s:5,t:"They would say raising hard things is how the team gets better — and that you actively model that."}] },
  { id:"q11", domain:"team",          text:"When your team underperforms relative to expectations on something that genuinely matters, your instinctive first response is:", options:[{s:1,t:"Identify who is responsible and address it directly and immediately with that person."},{s:2,t:"Increase oversight and accountability mechanisms to prevent recurrence."},{s:3,t:"Clarify expectations more explicitly — my first assumption is usually a communication gap."},{s:4,t:"Understand what the team actually experienced and distinguish between execution and system failure."},{s:5,t:"Treat it as a signal about the performance environment and examine what I may have contributed."}] },
  { id:"q12", domain:"team",          text:"How clearly does each member of your team currently understand how their specific role connects to the organization's highest priorities?", options:[{s:1,t:"Most of them probably could not articulate it with real confidence if asked today."},{s:2,t:"They understand their own work but the connection to what matters most is fuzzy for most."},{s:3,t:"Some have genuine clarity; others have a general sense but not one specific enough to guide decisions."},{s:4,t:"Most have solid clarity — I have invested in making this connection explicit and visible."},{s:5,t:"All of them can draw a direct line from their daily work to what matters most — and I can verify this."}] },
  { id:"q13", domain:"sustainability", text:"At the end of a demanding week, how reliably do you have sufficient capacity — mental, emotional, and physical — for the leadership the following week will require?", options:[{s:1,t:"Rarely — I am operating on deficit most of the time and managing it as a permanent condition."},{s:2,t:"Sometimes — I can recover when circumstances allow, but I cannot consistently count on it."},{s:3,t:"Moderately — I manage, but I know I am not operating at full capacity and I notice the effects."},{s:4,t:"Usually — I have practices that work for me most of the time, even under pressure."},{s:5,t:"Reliably — I treat my own recovery as a leadership responsibility and protect it accordingly."}] },
  { id:"q14", domain:"sustainability", text:"Which best describes your current relationship with the practices that sustain your performance capacity — sleep, physical activity, genuine disconnection from work, and meaningful relationships outside of it?", options:[{s:1,t:"They are largely absent — work has crowded them out and I have normalized the absence."},{s:2,t:"They exist but inconsistently — they are the first things to disappear when pressure increases."},{s:3,t:"Some are in place. Others I know I need and have not yet made non-negotiable."},{s:4,t:"Most are reasonably consistent — I protect them even when pressure would justify abandoning them."},{s:5,t:"They are anchors, not rewards. They are what enable sustained high performance — I do not negotiate with them."}] },
  { id:"q15", domain:"sustainability", text:"Over the past three months, how often have you noticed your leadership effectiveness declining specifically because of accumulated fatigue or sustained stress?", options:[{s:1,t:"Regularly — it is affecting my judgment, patience, or presence, and I am not fully in control of it."},{s:2,t:"Often — especially in the second half of intense periods, I can see it in how I show up."},{s:3,t:"Sometimes — I notice it but I can usually compensate in the moments that most matter."},{s:4,t:"Rarely — I have enough recovery built in that it does not typically compound to affect my leadership."},{s:5,t:"Very rarely — my practices prevent accumulation from reaching a level that meaningfully compromises my effectiveness."}] },
  { id:"q16", domain:"clarity",       text:"How often does the daily reality of your leadership feel genuinely aligned with what you believe your most important contribution could be?", options:[{s:1,t:"Rarely — there is a significant gap between where my energy goes and what I believe matters most."},{s:2,t:"Sometimes — alignment comes in moments but is not the steady state of how I lead."},{s:3,t:"Moderately — there is reasonable overlap, but also meaningful drift I have not fully resolved."},{s:4,t:"Usually — I have made active choices that create significant alignment between my priorities and my contribution."},{s:5,t:"Consistently — my daily work is a direct expression of what I am here to contribute, and I can name exactly what that is."}] },
  { id:"q17", domain:"clarity",       text:"If three of your most senior stakeholders were independently asked what you stand for as a leader and what your primary contribution is, the answers would be:", options:[{s:1,t:"Significantly different — I do not believe I have established a clear, consistent identity in their minds."},{s:2,t:"Somewhat consistent in broad strokes but divergent on the specifics that actually matter."},{s:3,t:"Reasonably consistent — they share a general picture but may miss important dimensions."},{s:4,t:"Largely consistent — I have been deliberate about communicating what I stand for."},{s:5,t:"Highly consistent — I have worked to ensure the people who matter most see me accurately and clearly."}] },
  { id:"q18", domain:"clarity",       text:"When your organization's demands and your personal leadership values genuinely conflict, you typically:", options:[{s:1,t:"Default to what the organization demands — I have not fully reckoned with the accumulating personal cost."},{s:2,t:"Comply while carrying increasing friction — I manage the tension but it wears on me in ways I recognize."},{s:3,t:"Raise the tension internally but rarely succeed in changing the demand or my response to it."},{s:4,t:"Navigate it case by case — I can hold the tension productively most of the time without losing myself."},{s:5,t:"Treat the conflict as important information and work to resolve it systemically rather than just managing symptoms."}] },
];

// ─── SCORING ─────────────────────────────────────────────────────────────────
function computeScores(answers) {
  const t={}, n={};
  Object.keys(DOMAINS).forEach(d=>{t[d]=0;n[d]=0;});
  QUESTIONS.forEach(q=>{
    if(answers[q.id]!==undefined){t[q.domain]+=answers[q.id];n[q.domain]++;}
  });
  const s={};
  Object.keys(DOMAINS).forEach(d=>{
    s[d]=n[d]>0?Math.round(((t[d]/n[d])-1)/4*100):0;
  });
  return s;
}
function getSorted(scores){ return Object.entries(scores).sort(([,a],[,b])=>a-b).map(([k])=>k); }
function getLabel(score){ 
  if(score>=80) return{t:"High functioning",c:"#2E6B3E"};
  if(score>=60) return{t:"Adequate",c:"#7A9C28"};
  if(score>=40) return{t:"Under strain",c:"#B07820"};
  if(score>=20) return{t:"Significant pressure",c:"#B04A20"};
  return{t:"Critical gap",c:"#8B1A1A"};
}

// ─── API HELPERS ─────────────────────────────────────────────────────────────
async function callClaudeWithMCP(systemPrompt, userMessage, mcpServers=[]) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:1000,
      system:systemPrompt,
      messages:[{role:"user",content:userMessage}],
      ...(mcpServers.length>0?{mcp_servers:mcpServers}:{})
    })
  });
  return res.json();
}

async function saveToNotion(contactData) {
  const {email, name, primary, secondary, scores, date} = contactData;
  const scoreMap = {"Identity & Presence":"identity","Decision Quality":"decision","Relational Intelligence":"relational","Team Vitality":"team","Personal Sustainability":"sustainability","Strategic Clarity":"clarity"};
  const pr = primary.name; const sec = secondary.name;
  const systemPrompt = `You are a Notion database assistant. Create a new page in the coaching contacts CRM database with ID ${NOTION_DB_ID}. Use the notion-create-pages tool. The data source ID is collection://923b7da5-b076-4f5e-97b6-e88f34c17b8e. Return only "SUCCESS" after creating the page.`;
  const userMessage = `Create a contact record with these properties:
- Contact (title): "${name || email}"
- Email: "${email}"
- Assessment Date start: "${date}"
- Assessment Date is_datetime: 0
- Primary Pressure Point: "${pr}"
- Secondary Pressure Point: "${sec}"
- Status: "New Lead"
- Source: "Assessment"
- Identity Score: ${scores.identity}
- Decision Score: ${scores.decision}
- Relational Score: ${scores.relational}
- Team Score: ${scores.team}
- Sustainability Score: ${scores.sustainability}
- Clarity Score: ${scores.clarity}
- Calendly Booked: false`;

  return callClaudeWithMCP(systemPrompt, userMessage, [{type:"url",url:NOTION_MCP,name:"notion"}]);
}

async function sendGmailAlert(contactData) {
  const {email, name, primary, secondary, scores} = contactData;
  const scoreLines = Object.entries(scores).map(([k,v])=>`${DOMAINS[k].name}: ${v}/100`).join(" | ");
  const systemPrompt = `You are a Gmail assistant. Create a draft email notification for Julian Johnson about a new coaching lead. Use the Gmail create_draft tool. Return only "SUCCESS" after creating the draft.`;
  const userMessage = `Create a Gmail draft with:
To: ${JULIAN_EMAIL}
Subject: New assessment lead: ${primary.name} pressure point — ${email}
Body:
A new contact has completed the Leadership Pressure Point Assessment and opted in for follow-up.

CONTACT: ${name || "Not provided"} | ${email}
DATE: ${new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}

PRIMARY PRESSURE POINT: ${primary.name}
SECONDARY PRESSURE POINT: ${secondary.name}

ALL DOMAIN SCORES:
${scoreLines}

Suggested next step: Send personalized follow-up email within 24 hours referencing their ${primary.name} results specifically.

View in Notion CRM: https://www.notion.so/2607b51163ef4049a44e08d10a36a959

— Unified Solutions Assessment System`;

  return callClaudeWithMCP(systemPrompt, userMessage, [{type:"url",url:GMAIL_MCP,name:"gmail"}]);
}

async function generateFollowUpEmail(contactData) {
  const {email, name, primary, secondary, scores} = contactData;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:1000,
      system:`You are Julian Johnson, ICF PCC holistic leadership coach at Unified Solutions Inc. Write a personalized follow-up email to someone who completed the Leadership Pressure Point Assessment. The email must:
- Be warm but direct — not generic or salesy
- Reference their specific primary pressure point by name
- Include one sentence that demonstrates you understand what that pressure point actually feels like from the inside
- Reference the research basis briefly (one sentence max)
- Reference your coaching approach as relevant to their specific domain
- End with a low-pressure invitation to a 30-minute discovery call
- Include: Subject line, then email body
- No em dashes — use commas or periods instead
- Tone: authoritative, human, specific. Avoid coaching clichés.
- Length: 150-200 words for the body
Return ONLY: Subject: [subject line]\n\n[email body]`,
      messages:[{role:"user",content:`Contact: ${name||"there"} | Primary pressure point: ${primary.name} (score: ${scores[Object.keys(DOMAINS).find(k=>DOMAINS[k].name===primary.name)]}/100) | Secondary: ${secondary.name} | All scores: ${JSON.stringify(scores)}\nResearch basis for primary: ${DOMAIN_RESEARCH[Object.keys(DOMAINS).find(k=>DOMAINS[k].name===primary.name)]}\nCoaching focus: ${COACHING_FOCUS[Object.keys(DOMAINS).find(k=>DOMAINS[k].name===primary.name)]}`}]
    })
  });
  const d = await res.json();
  return d.content?.[0]?.text || "";
}

// ─── SHARED STORAGE HELPERS ──────────────────────────────────────────────────
async function storageGet(key,shared=true){ try{const r=await window.storage.get(key,shared);return r?JSON.parse(r.value):null;}catch{return null;}}
async function storageSet(key,val,shared=true){ try{await window.storage.set(key,JSON.stringify(val),shared);}catch{}}
async function storageList(prefix,shared=true){ try{const r=await window.storage.list(prefix,shared);return r?.keys||[];}catch{return[];}}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("intro"); // intro|questions|capture|results|admin|adminLogin
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [scores, setScores] = useState({});
  const [contactData, setContactData] = useState(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [adminPin, setAdminPin] = useState("");
  const [adminContacts, setAdminContacts] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [followUpEmail, setFollowUpEmail] = useState("");
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const topRef = useRef(null);
  const scrollTop = () => topRef.current?.scrollIntoView({behavior:"smooth",block:"start"});

  const q = QUESTIONS[current];
  const progress = Math.round((Object.keys(answers).length / QUESTIONS.length) * 100);

  // finish assessment
  function finishAssessment() {
    const s = computeScores(answers);
    setScores(s);
    const sorted = getSorted(s);
    const pri = DOMAINS[sorted[0]];
    const sec = DOMAINS[sorted[1]];
    setContactData({ primary: pri, secondary: sec, scores: s, date: new Date().toISOString().split("T")[0] });
    setView("capture");
    scrollTop();
  }

  function advance() {
    if(selected===null) return;
    const newA = {...answers,[q.id]:selected};
    setAnswers(newA);
    setSelected(null);
    if(current < QUESTIONS.length-1){ setCurrent(current+1); scrollTop(); }
    else { const s=computeScores(newA); setScores(s); const sorted=getSorted(s); const pri=DOMAINS[sorted[0]]; const sec=DOMAINS[sorted[1]]; setContactData({primary:pri,secondary:sec,scores:s,date:new Date().toISOString().split("T")[0]}); setView("capture"); scrollTop(); }
  }

  async function handleOptIn(e) {
    e.preventDefault();
    if(!email) return;
    setSubmitting(true);
    setSubmitStatus("Saving your results...");

    const data = {
      ...contactData,
      email: email.trim(),
      name: firstName.trim() || null,
      timestamp: Date.now(),
    };

    // Save to shared storage
    const key = `contact:${Date.now()}`;
    await storageSet(key, data);

    // Save to Notion + send Gmail alert in parallel
    setSubmitStatus("Syncing to CRM...");
    try {
      await Promise.allSettled([
        saveToNotion(data),
        sendGmailAlert(data),
      ]);
    } catch(err) { /* non-blocking */ }

    setSubmitting(false);
    setSubmitted(true);
    setSubmitStatus("");
    setView("results");
    scrollTop();
  }

  function skipToResults() {
    setView("results");
    scrollTop();
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  async function loginAdmin(e) {
    e.preventDefault();
    if(adminPin !== ADMIN_PIN) { alert("Incorrect PIN."); return; }
    setAdminLoading(true);
    const keys = await storageList("contact:");
    const contacts = await Promise.all(keys.map(k => storageGet(k)));
    setAdminContacts(contacts.filter(Boolean).sort((a,b)=>b.timestamp-a.timestamp));
    setAdminLoading(false);
    setView("admin");
    scrollTop();
  }

  async function generateEmail(contact) {
    setSelectedContact(contact);
    setGeneratingEmail(true);
    setFollowUpEmail("");
    const text = await generateFollowUpEmail(contact);
    setFollowUpEmail(text);
    setGeneratingEmail(false);
  }

  async function updateContactStatus(contact, newStatus) {
    const key = `contact:${contact.timestamp}`;
    await storageSet(key, {...contact, status: newStatus});
    const keys = await storageList("contact:");
    const contacts = await Promise.all(keys.map(k => storageGet(k)));
    setAdminContacts(contacts.filter(Boolean).sort((a,b)=>b.timestamp-a.timestamp));
  }

  // ── SHARED STYLES ──────────────────────────────────────────────────────────
  const navBar = (
    <div style={{background:C.navy,padding:"12px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:C.olive,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none"><circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5"/><path d="M10 5v10M5 10h10" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <div>
          <div style={{fontFamily:"Georgia,serif",fontSize:13,fontWeight:600,color:C.white}}>Unified Solutions Inc.</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"monospace"}}>ICF PCC · ACTC Candidate</div>
        </div>
      </div>
      <div style={{display:"flex",gap:8}}>
        {view!=="adminLogin"&&view!=="admin"&&<button onClick={()=>{setView("adminLogin");scrollTop();}} style={{background:"none",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.4)",padding:"5px 10px",borderRadius:4,fontFamily:"sans-serif",fontSize:10,cursor:"pointer"}}>Admin</button>}
        {view==="admin"&&<button onClick={()=>{setView("intro");scrollTop();}} style={{background:"none",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.4)",padding:"5px 10px",borderRadius:4,fontFamily:"sans-serif",fontSize:10,cursor:"pointer"}}>Exit Admin</button>}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // VIEWS
  // ══════════════════════════════════════════════════════════════════════════

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if(view==="intro") return (
    <div ref={topRef} style={{fontFamily:"sans-serif",background:C.navyDark,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      {navBar}
      <div style={{maxWidth:700,margin:"0 auto",padding:"52px 24px 80px",flex:1}}>
        <div style={{display:"inline-block",background:"rgba(122,156,40,0.2)",color:C.oliveL,border:`1px solid rgba(122,156,40,0.35)`,borderRadius:100,padding:"4px 14px",fontSize:11,fontFamily:"monospace",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:26}}>Diagnostic instrument</div>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(1.8rem,4.5vw,2.8rem)",fontWeight:500,lineHeight:1.2,color:C.white,marginBottom:18,maxWidth:"16ch"}}>The Leadership Pressure Point Assessment</h1>
        <p style={{fontSize:15,lineHeight:1.85,color:"rgba(255,255,255,0.7)",marginBottom:28,maxWidth:"52ch"}}>Most leaders carry a sense of what is not quite working before they can name it precisely. This assessment surfaces it with enough specificity to do something about it.</p>
        <div style={{background:"rgba(255,255,255,0.05)",borderRadius:8,padding:"20px 22px",marginBottom:28,borderLeft:`3px solid ${C.olive}`}}>
          <div style={{fontSize:10,color:C.oliveL,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"monospace",marginBottom:10}}>Research foundation</div>
          <p style={{fontSize:13,lineHeight:1.75,color:"rgba(255,255,255,0.6)",margin:0}}>Grounded in Authentic Leadership theory (Avolio & Gardner; Walumbwa et al.), dual-process decision science (Kahneman; Artinger et al., 2025), relational neuroscience (Rock; Goleman), psychological safety research (Edmondson; Hackman), burnout science (Maslach; JD-R model), and constructive developmental theory (Kegan). Developed and administered by Julian Johnson, ICF PCC, ACTC Candidate.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:36}}>
          {[["18","behaviorally-anchored questions"],["6","validated leadership domains"],["~8 min","to complete"]].map(([v,l])=>(
            <div key={l} style={{background:"rgba(255,255,255,0.04)",borderRadius:6,padding:"14px 12px",textAlign:"center"}}>
              <div style={{fontFamily:"monospace",fontSize:20,color:C.oliveL,fontWeight:700}}>{v}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:4,lineHeight:1.4}}>{l}</div>
            </div>
          ))}
        </div>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:20,lineHeight:1.7}}>Answer based on what is actually true right now. The value is in accuracy, not in a favorable score.</p>
        <button onClick={()=>{setView("questions");scrollTop();}} style={{background:C.olive,color:C.white,border:"none",padding:"13px 30px",borderRadius:4,fontFamily:"sans-serif",fontSize:14,fontWeight:600,cursor:"pointer"}}>Begin the assessment</button>
      </div>
    </div>
  );

  // ── QUESTIONS ──────────────────────────────────────────────────────────────
  if(view==="questions") return (
    <div ref={topRef} style={{fontFamily:"sans-serif",background:C.offwhite,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <div style={{background:C.navy,position:"sticky",top:0,zIndex:10}}>
        <div style={{height:4,background:`linear-gradient(90deg,${C.olive} ${progress}%,rgba(255,255,255,0.1) ${progress}%)`,transition:"all 0.4s ease"}}/>
        <div style={{padding:"11px 22px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontFamily:"monospace",letterSpacing:"0.06em"}}>LEADERSHIP PRESSURE POINT ASSESSMENT</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontFamily:"monospace"}}>{current+1} / {QUESTIONS.length}</div>
        </div>
      </div>
      <div style={{maxWidth:700,margin:"0 auto",padding:"44px 22px 80px",flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:DOMAINS[q.domain].color}}/>
          <span style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.muted,fontFamily:"monospace"}}>{DOMAINS[q.domain].name}</span>
        </div>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(1.1rem,2.8vw,1.45rem)",fontWeight:500,lineHeight:1.45,color:C.charcoal,marginBottom:28,maxWidth:"52ch"}}>{q.text}</h2>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:28}}>
          {q.options.map(opt=>{
            const isSel = selected===opt.s;
            return (
              <button key={opt.s} onClick={()=>setSelected(opt.s)} style={{background:isSel?C.navy:C.white,border:`2px solid ${isSel?C.navy:"rgba(0,0,0,0.1)"}`,borderRadius:6,padding:"14px 18px",textAlign:"left",cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start",transition:"all 0.15s",boxShadow:isSel?"0 2px 10px rgba(27,58,90,0.18)":"none"}}>
                <div style={{width:18,height:18,borderRadius:"50%",flexShrink:0,marginTop:2,border:`2px solid ${isSel?C.olive:"rgba(0,0,0,0.2)"}`,background:isSel?C.olive:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {isSel&&<div style={{width:6,height:6,borderRadius:"50%",background:C.white}}/>}
                </div>
                <span style={{fontSize:13,lineHeight:1.65,color:isSel?C.white:C.charcoal}}>{opt.t}</span>
              </button>
            );
          })}
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={advance} disabled={selected===null} style={{background:selected!==null?C.olive:"rgba(0,0,0,0.12)",color:selected!==null?C.white:"rgba(0,0,0,0.35)",border:"none",padding:"11px 26px",borderRadius:4,fontFamily:"sans-serif",fontSize:13,fontWeight:600,cursor:selected!==null?"pointer":"not-allowed",transition:"all 0.2s"}}>
            {current<QUESTIONS.length-1?"Next question":"See my results"}
          </button>
          {current>0&&<button onClick={()=>{setCurrent(current-1);setSelected(answers[QUESTIONS[current-1].id]??null);}} style={{background:"none",border:"1px solid rgba(0,0,0,0.15)",color:C.muted,padding:"10px 18px",borderRadius:4,fontFamily:"sans-serif",fontSize:12,cursor:"pointer"}}>Back</button>}
          <span style={{fontSize:11,color:C.muted,marginLeft:"auto",fontFamily:"monospace"}}>{QUESTIONS.length-current-1} remaining</span>
        </div>
      </div>
    </div>
  );

  // ── EMAIL CAPTURE ──────────────────────────────────────────────────────────
  if(view==="capture") {
    const sorted = getSorted(scores);
    const pri = DOMAINS[sorted[0]];
    return (
      <div ref={topRef} style={{fontFamily:"sans-serif",background:C.offwhite,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        {navBar}
        <div style={{maxWidth:620,margin:"0 auto",padding:"52px 24px 80px",flex:1}}>
          <div style={{background:pri.color,borderRadius:8,padding:"28px 26px",marginBottom:28,color:C.white}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.55)",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"monospace",marginBottom:10}}>Your primary pressure point</div>
            <h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(1.4rem,3.5vw,2rem)",fontWeight:500,marginBottom:8}}>{pri.name}</h2>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.72)",lineHeight:1.7,margin:0}}>{pri.tagline}</p>
          </div>

          <div style={{background:C.white,borderRadius:8,padding:"28px 26px",marginBottom:16,boxShadow:"0 1px 12px rgba(0,0,0,0.06)"}}>
            <h3 style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:500,color:C.charcoal,marginBottom:10}}>Want a personalized follow-up?</h3>
            <p style={{fontSize:13,lineHeight:1.75,color:C.muted,marginBottom:22}}>Share your email and Julian will send you a personalized note based on your specific results — including what the research says about your primary pressure point and what it would take to address it. No automation. A real message from a real coach.</p>
            <form onSubmit={handleOptIn}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="First name (optional)" style={{padding:"10px 12px",border:"1.5px solid rgba(0,0,0,0.15)",borderRadius:4,fontFamily:"sans-serif",fontSize:13,outline:"none",color:C.charcoal}}/>
                <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address *" style={{padding:"10px 12px",border:"1.5px solid rgba(0,0,0,0.15)",borderRadius:4,fontFamily:"sans-serif",fontSize:13,outline:"none",color:C.charcoal}}/>
              </div>
              <p style={{fontSize:11,color:C.muted,marginBottom:16,lineHeight:1.6}}>Your results are also saved with your email. Julian will reach out within one business day. You will not be added to a mailing list without your explicit consent.</p>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                <button type="submit" disabled={submitting} style={{background:submitting?"rgba(0,0,0,0.12)":C.navy,color:C.white,border:"none",padding:"11px 22px",borderRadius:4,fontFamily:"sans-serif",fontSize:13,fontWeight:600,cursor:submitting?"not-allowed":"pointer"}}>
                  {submitting?"Saving...":"Save results and request follow-up"}
                </button>
                <button type="button" onClick={skipToResults} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",padding:"11px 0",fontFamily:"sans-serif"}}>
                  Skip — just show me my results
                </button>
              </div>
              {submitStatus&&<p style={{fontSize:12,color:C.olive,marginTop:10,fontFamily:"monospace"}}>{submitStatus}</p>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  if(view==="results") {
    const sorted = getSorted(scores);
    const pri = DOMAINS[sorted[0]]; const sec = DOMAINS[sorted[1]];
    const priKey = sorted[0]; const secKey = sorted[1];
    const priScore = scores[priKey];
    const {t:priLabel,c:priLabelColor} = getLabel(priScore);
    return (
      <div ref={topRef} style={{fontFamily:"sans-serif",background:C.offwhite,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        {navBar}
        {submitted&&<div style={{background:"rgba(122,156,40,0.12)",borderBottom:`1px solid rgba(122,156,40,0.25)`,padding:"10px 22px",fontSize:13,color:"#3A6B1E",textAlign:"center"}}>Results saved. Julian will be in touch within one business day.</div>}
        {/* Hero */}
        <div style={{background:pri.color,padding:"42px 24px 36px"}}>
          <div style={{maxWidth:700,margin:"0 auto"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"monospace",marginBottom:14}}>Your primary pressure point</div>
            <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(1.5rem,4vw,2.4rem)",fontWeight:500,color:C.white,marginBottom:10,lineHeight:1.2}}>{pri.name}</h1>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.68)",marginBottom:18,lineHeight:1.6,maxWidth:"44ch"}}>{pri.tagline}</p>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.12)",borderRadius:100,padding:"5px 14px"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:priLabelColor}}/>
              <span style={{fontSize:12,color:C.white,fontFamily:"monospace"}}>{priLabel} · Score: {priScore}/100</span>
            </div>
          </div>
        </div>
        <div style={{maxWidth:700,margin:"0 auto",padding:"36px 22px 80px",flex:1}}>
          {/* What this means */}
          <div style={{background:C.white,borderRadius:8,padding:"22px 24px",marginBottom:18,borderLeft:`3px solid ${pri.color}`}}>
            <div style={{fontSize:10,color:pri.color,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"monospace",marginBottom:10}}>What this means</div>
            <p style={{fontSize:14,lineHeight:1.8,color:C.charcoal,margin:0}}>
              {priScore<40
                ? "The gap between where you are operating and where your leadership needs you to be is generating real and measurable costs. This does not resolve by managing it — it resolves by addressing it directly."
                : priScore<60
                ? "This domain is under genuine strain. The costs may be diffuse — showing up in your energy, your relationships, or the quality of your decisions rather than in a single visible failure. But they are real."
                : "This domain has room to develop further. The gap between your current functioning and your potential in this area is worth addressing before it becomes the constraint that limits everything else."}
              {" "}{COACHING_FOCUS[priKey]}
            </p>
          </div>
          {/* Research */}
          <div style={{background:C.navyLight,borderRadius:8,padding:"18px 20px",marginBottom:18,border:"1px solid rgba(27,58,90,0.12)"}}>
            <div style={{fontSize:10,color:C.navy,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"monospace",marginBottom:8}}>Research basis</div>
            <p style={{fontSize:13,lineHeight:1.75,color:C.muted,margin:0}}>{DOMAIN_RESEARCH[priKey]}</p>
          </div>
          {/* All domains */}
          <h2 style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:500,color:C.charcoal,marginBottom:6,marginTop:32}}>All six domains</h2>
          <p style={{fontSize:13,color:C.muted,marginBottom:20,lineHeight:1.6}}>The lowest-scoring domain is your primary pressure point. The second-lowest is often where the primary pressure point is expressing itself most visibly. Click any domain to expand research context.</p>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:32}}>
            {sorted.map((dk,idx)=>{
              const d=DOMAINS[dk]; const sc=scores[dk]; const {t:lbl,c:lc}=getLabel(sc);
              const isOpen = expandedDomain===dk;
              return (
                <div key={dk} style={{background:C.white,borderRadius:8,border:`1.5px solid ${dk===priKey?d.color:"rgba(0,0,0,0.08)"}`,overflow:"hidden"}}>
                  <div style={{padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}} onClick={()=>setExpandedDomain(isOpen?null:dk)}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:dk===priKey?d.color:"rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontFamily:"monospace",color:dk===priKey?C.white:C.muted,fontWeight:700,flexShrink:0}}>{idx+1}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                        <span style={{fontSize:13,fontWeight:600,color:C.charcoal}}>{d.name}</span>
                        {dk===priKey&&<span style={{fontSize:9,background:d.color,color:C.white,padding:"1px 7px",borderRadius:3,fontFamily:"monospace",letterSpacing:"0.06em"}}>PRIMARY</span>}
                        {dk===secKey&&<span style={{fontSize:9,background:"rgba(0,0,0,0.06)",color:C.muted,padding:"1px 7px",borderRadius:3,fontFamily:"monospace",letterSpacing:"0.06em"}}>SECONDARY</span>}
                      </div>
                      <div style={{fontSize:11,color:C.muted,marginTop:2}}>{d.tagline}</div>
                    </div>
                    <div style={{flexShrink:0,textAlign:"right"}}>
                      <div style={{fontFamily:"monospace",fontSize:17,fontWeight:700,color:lc}}>{sc}</div>
                      <div style={{fontSize:10,color:lc}}>{lbl}</div>
                    </div>
                    <div style={{color:C.muted,fontSize:11,flexShrink:0}}>{isOpen?"▲":"▼"}</div>
                  </div>
                  <div style={{height:3,background:"rgba(0,0,0,0.05)"}}>
                    <div style={{height:"100%",width:`${sc}%`,background:d.color,transition:"width 0.6s ease"}}/>
                  </div>
                  {isOpen&&(
                    <div style={{padding:"18px 16px",borderTop:"1px solid rgba(0,0,0,0.05)",background:"rgba(0,0,0,0.01)"}}>
                      <p style={{fontSize:13,lineHeight:1.75,color:C.charcoal,marginBottom:10}}>{sc>=60?`This domain is functioning well. ${COACHING_FOCUS[dk]}`:`${DOMAIN_RESEARCH[dk]}`}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* CTA */}
          <div style={{background:C.navy,borderRadius:8,padding:"32px 26px",textAlign:"center"}}>
            <div style={{fontSize:10,color:C.oliveL,letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"monospace",marginBottom:12}}>Next step</div>
            <h2 style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:500,color:C.white,marginBottom:10}}>A 30-minute conversation to go deeper.</h2>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginBottom:22,lineHeight:1.7,maxWidth:"42ch",margin:"0 auto 22px"}}>This assessment surfaces the pressure point. The coaching conversation is where you figure out exactly what is driving it and what it would take to resolve it.</p>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",background:C.olive,color:C.white,padding:"12px 26px",borderRadius:4,fontFamily:"sans-serif",fontSize:13,fontWeight:600,textDecoration:"none"}}>Book a discovery call — Julian Johnson, ICF PCC</a>
            <div style={{marginTop:12,fontSize:11,color:"rgba(255,255,255,0.35)"}}>contact@unifiedsolutionsinc.com · 952.594.8611</div>
          </div>
          <div style={{marginTop:24,textAlign:"center"}}>
            <p style={{fontSize:11,color:C.muted,lineHeight:1.7}}>This instrument was developed by Julian Johnson, ICF PCC, ACTC Candidate. It is a reflective self-assessment, not a validated psychometric tool. Results are most useful as a starting point for structured coaching conversation.</p>
            <button onClick={()=>{setView("intro");setCurrent(0);setAnswers({});setSelected(null);setSubmitted(false);setEmail("");setFirstName("");scrollTop();}} style={{background:"none",border:"none",color:C.muted,fontSize:11,cursor:"pointer",textDecoration:"underline",marginTop:8}}>Retake the assessment</button>
          </div>
        </div>
      </div>
    );
  }

  // ── ADMIN LOGIN ─────────────────────────────────────────────────────────────
  if(view==="adminLogin") return (
    <div ref={topRef} style={{fontFamily:"sans-serif",background:C.navyDark,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      {navBar}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
        <div style={{background:C.white,borderRadius:8,padding:"36px 32px",width:"100%",maxWidth:380,boxShadow:"0 4px 24px rgba(0,0,0,0.2)"}}>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:500,color:C.navy,marginBottom:6}}>CRM Dashboard</h2>
          <p style={{fontSize:13,color:C.muted,marginBottom:24,lineHeight:1.6}}>Enter your admin PIN to access coaching contacts and follow-up tools.</p>
          <form onSubmit={loginAdmin}>
            <input type="password" value={adminPin} onChange={e=>setAdminPin(e.target.value)} placeholder="Admin PIN" required style={{width:"100%",padding:"10px 12px",border:"1.5px solid rgba(0,0,0,0.15)",borderRadius:4,fontFamily:"monospace",fontSize:14,outline:"none",marginBottom:14,boxSizing:"border-box"}}/>
            <button type="submit" style={{width:"100%",background:C.navy,color:C.white,border:"none",padding:"11px",borderRadius:4,fontFamily:"sans-serif",fontSize:13,fontWeight:600,cursor:"pointer"}}>
              {adminLoading?"Loading contacts...":"Access CRM"}
            </button>
          </form>
          <button onClick={()=>{setView("intro");scrollTop();}} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",marginTop:16,display:"block",textAlign:"center",width:"100%"}}>Back to assessment</button>
        </div>
      </div>
    </div>
  );

  // ── ADMIN CRM ───────────────────────────────────────────────────────────────
  if(view==="admin") {
    const STATUSES = ["New Lead","Email Sent","Discovery Call Booked","In Coaching","Not a Fit","Nurture"];
    const statusColors = {"New Lead":"#B07820","Email Sent":"#1B3A5A","Discovery Call Booked":"#2E6B3E","In Coaching":"#4A3A7A","Not a Fit":"#6B6B6B","Nurture":"#7A5C28"};
    return (
      <div ref={topRef} style={{fontFamily:"sans-serif",background:C.offwhite,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        {navBar}
        <div style={{maxWidth:1100,margin:"0 auto",padding:"32px 22px 80px",flex:1,width:"100%",boxSizing:"border-box"}}>
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28,flexWrap:"wrap",gap:12}}>
            <div>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:500,color:C.navy,marginBottom:4}}>Coaching Contacts CRM</h1>
              <p style={{fontSize:13,color:C.muted}}>{adminContacts.length} total contacts · <a href="https://www.notion.so/2607b51163ef4049a44e08d10a36a959" target="_blank" rel="noopener noreferrer" style={{color:C.olive}}>Open in Notion →</a></p>
            </div>
            {/* Pipeline summary */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {STATUSES.map(s=>{
                const count = adminContacts.filter(c=>(c.status||"New Lead")===s).length;
                return count>0?(
                  <div key={s} style={{background:C.white,border:`1px solid rgba(0,0,0,0.1)`,borderRadius:6,padding:"8px 12px",textAlign:"center",minWidth:70}}>
                    <div style={{fontFamily:"monospace",fontSize:16,fontWeight:700,color:statusColors[s]}}>{count}</div>
                    <div style={{fontSize:10,color:C.muted,marginTop:2,lineHeight:1.3}}>{s}</div>
                  </div>
                ):null;
              })}
            </div>
          </div>

          {adminContacts.length===0?(
            <div style={{background:C.white,borderRadius:8,padding:"60px 40px",textAlign:"center",border:"1px solid rgba(0,0,0,0.08)"}}>
              <div style={{fontSize:32,marginBottom:12}}>◈</div>
              <h3 style={{fontFamily:"Georgia,serif",fontSize:17,color:C.navy,marginBottom:8}}>No contacts yet</h3>
              <p style={{fontSize:13,color:C.muted,lineHeight:1.7}}>Contacts will appear here when someone completes the assessment and provides their email. They are also synced to your Notion CRM automatically.</p>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {adminContacts.map((contact,i)=>{
                const pri = contact.primary;
                const isSel = selectedContact?.timestamp===contact.timestamp;
                const status = contact.status||"New Lead";
                return (
                  <div key={i} style={{background:C.white,borderRadius:8,border:`1px solid ${isSel?"rgba(27,58,90,0.3)":"rgba(0,0,0,0.08)"}`,overflow:"hidden"}}>
                    {/* Contact row */}
                    <div style={{padding:"16px 18px",display:"grid",gridTemplateColumns:"1fr auto",gap:16,alignItems:"start"}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:6}}>
                          <span style={{fontSize:14,fontWeight:600,color:C.navy}}>{contact.name||contact.email}</span>
                          {contact.name&&<span style={{fontSize:12,color:C.muted}}>{contact.email}</span>}
                          <span style={{fontSize:10,background:statusColors[status]||"#888",color:C.white,padding:"2px 8px",borderRadius:3,fontFamily:"monospace"}}>{status}</span>
                        </div>
                        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                          {pri&&<span style={{fontSize:11,background:C.navyLight,color:C.navy,padding:"3px 9px",borderRadius:100,fontWeight:600}}>Primary: {pri.name}</span>}
                          <span style={{fontSize:11,color:C.muted,fontFamily:"monospace"}}>{contact.date}</span>
                          {contact.scores&&<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                            {Object.entries(contact.scores).map(([dk,sc])=>(
                              <span key={dk} style={{fontSize:10,fontFamily:"monospace",color:getLabel(sc).c}}>{DOMAINS[dk].shortName||dk.slice(0,4)}: {sc}</span>
                            ))}
                          </div>}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}}>
                        <select value={status} onChange={e=>updateContactStatus(contact,e.target.value)} style={{fontSize:11,padding:"5px 8px",border:"1px solid rgba(0,0,0,0.15)",borderRadius:4,fontFamily:"sans-serif",color:C.charcoal,cursor:"pointer",background:C.white}}>
                          {STATUSES.map(s=><option key={s}>{s}</option>)}
                        </select>
                        <button onClick={()=>{setSelectedContact(isSel?null:contact);setFollowUpEmail("");}} style={{background:isSel?C.navy:C.offwhite,color:isSel?C.white:C.charcoal,border:"1px solid rgba(0,0,0,0.12)",padding:"5px 12px",borderRadius:4,fontFamily:"sans-serif",fontSize:11,cursor:"pointer",fontWeight:600}}>
                          {isSel?"Close":"Follow-up tools"}
                        </button>
                        <a href={`mailto:${contact.email}`} style={{background:C.olive,color:C.white,border:"none",padding:"5px 12px",borderRadius:4,fontFamily:"sans-serif",fontSize:11,cursor:"pointer",fontWeight:600,textDecoration:"none",display:"inline-flex",alignItems:"center"}}>Email</a>
                      </div>
                    </div>

                    {/* Follow-up panel */}
                    {isSel&&(
                      <div style={{borderTop:"1px solid rgba(0,0,0,0.07)",padding:"20px 18px",background:"rgba(0,0,0,0.015)"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
                          <h4 style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:500,color:C.navy,margin:0}}>AI-generated personalized follow-up</h4>
                          <button onClick={()=>generateEmail(contact)} disabled={generatingEmail} style={{background:generatingEmail?"rgba(0,0,0,0.1)":C.navy,color:C.white,border:"none",padding:"8px 16px",borderRadius:4,fontFamily:"sans-serif",fontSize:12,fontWeight:600,cursor:generatingEmail?"not-allowed":"pointer"}}>
                            {generatingEmail?"Generating...":followUpEmail?"Regenerate":"Generate email"}
                          </button>
                        </div>
                        {generatingEmail&&<div style={{padding:"20px",textAlign:"center",color:C.muted,fontSize:13,fontStyle:"italic"}}>Writing a personalized email based on {contact.name||"their"} {pri?.name} results...</div>}
                        {followUpEmail&&!generatingEmail&&(
                          <div>
                            <pre style={{background:C.white,border:"1px solid rgba(0,0,0,0.1)",borderRadius:6,padding:"16px",fontSize:12,lineHeight:1.8,color:C.charcoal,whiteSpace:"pre-wrap",fontFamily:"sans-serif",margin:"0 0 12px"}}>{followUpEmail}</pre>
                            <div style={{display:"flex",gap:8}}>
                              <button onClick={async()=>{await navigator.clipboard.writeText(followUpEmail);setCopiedEmail(true);setTimeout(()=>setCopiedEmail(false),2000);}} style={{background:copiedEmail?C.olive:C.offwhite,color:copiedEmail?C.white:C.charcoal,border:"1px solid rgba(0,0,0,0.12)",padding:"7px 14px",borderRadius:4,fontFamily:"sans-serif",fontSize:12,cursor:"pointer",fontWeight:600}}>
                                {copiedEmail?"Copied!":"Copy to clipboard"}
                              </button>
                              <a href={`mailto:${contact.email}?subject=${encodeURIComponent(followUpEmail.split('\n')[0].replace('Subject:','').trim())}&body=${encodeURIComponent(followUpEmail.split('\n').slice(2).join('\n').trim())}`} style={{background:C.navy,color:C.white,border:"none",padding:"7px 14px",borderRadius:4,fontFamily:"sans-serif",fontSize:12,cursor:"pointer",fontWeight:600,textDecoration:"none",display:"inline-block"}}>Open in Gmail</a>
                            </div>
                          </div>
                        )}
                        {/* 3-touch sequence note */}
                        {!followUpEmail&&!generatingEmail&&(
                          <div style={{background:C.navyLight,borderRadius:6,padding:"14px 16px"}}>
                            <div style={{fontSize:10,color:C.navy,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"monospace",marginBottom:8}}>Recommended 3-touch follow-up sequence</div>
                            <div style={{display:"flex",flexDirection:"column",gap:8}}>
                              {[["Within 24 hrs","Touch 1: Personalized email referencing their specific pressure point and what the research says about it. Generated above."],["Day 5-7","Touch 2: Send a short resource — one article, framework, or insight directly relevant to their primary domain. No ask."],["Day 14-21","Touch 3: Brief check-in. Has anything shifted? Restate the invitation to a discovery call. Keep it to 3 sentences."]].map(([timing,desc])=>(
                                <div key={timing} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                                  <span style={{fontFamily:"monospace",fontSize:10,color:C.olive,whiteSpace:"nowrap",paddingTop:1}}>{timing}</span>
                                  <span style={{fontSize:12,color:C.muted,lineHeight:1.6}}>{desc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Notion link */}
          <div style={{marginTop:32,padding:"20px 22px",background:C.white,borderRadius:8,border:"1px solid rgba(0,0,0,0.08)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.navy,marginBottom:2}}>Notion CRM is live and syncing</div>
              <div style={{fontSize:12,color:C.muted}}>All contacts are automatically created in your Notion database with full score data, pipeline board, and table views.</div>
            </div>
            <a href="https://www.notion.so/2607b51163ef4049a44e08d10a36a959" target="_blank" rel="noopener noreferrer" style={{background:C.navy,color:C.white,padding:"9px 18px",borderRadius:4,fontFamily:"sans-serif",fontSize:12,fontWeight:600,textDecoration:"none",whiteSpace:"nowrap"}}>Open Notion CRM →</a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
