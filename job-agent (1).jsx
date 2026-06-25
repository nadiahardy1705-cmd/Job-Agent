import { useState, useCallback } from "react";

// ─── Nadia's Profile ─────────────────────────────────────────────────────────
const PROFILE = {
  name: "Nadia Hardy",
  email: "nadia.hardy1705@gmail.com",
  phone: "646-696-5734",
  location: "New York, NY",
  education: "B.A. Political Science, Minor History — Cum Laude, Howard University (May 2026)",
  experience: [
    { title: "Administrative Assistant", employer: "Dunton Consulting", location: "New York, NY", dates: "Jul 2024 – May 2026", bullets: ["Supported intake and documentation for 35–50 individuals per cycle, verifying materials and tracking completion status", "Maintained and updated tracking databases with close attention to accuracy and procedural compliance", "Drafted progress summaries and status reports for supervisors and stakeholders", "Served as primary point of contact for 100+ daily inquiries, routing requests and maintaining records from intake through resolution", "Coordinated scheduling, calendar maintenance, and distribution of communications across teams"] },
    { title: "Childcare Provider", employer: "Concerned Parents NYC Early Education Center", location: "New York, NY", dates: "Jul 2023 – Aug 2025", bullets: ["Maintained daily logs and communicated progress reports to parents and supervisors", "Built consistent, trust-based relationships with families from diverse backgrounds in a high-responsibility setting"] },
    { title: "Volunteer Mentor", employer: "Youth Justice Advocates — Howard University", location: "Washington, DC", dates: "2024 – 2026", bullets: ["Mentored incarcerated youth twice weekly at a DC juvenile detention center, providing one-on-one support to individuals navigating serious mental health and life challenges", "Practiced active listening, consistent boundary-setting, and patience while building trust with young people in crisis"] },
    { title: "Member", employer: "NCNW Howard Chapter", location: "Washington, DC", dates: "2024 – Present", bullets: ["Organized mentoring programs, community service drives, and scholarship initiatives", "Contributed to chapter earning 2025–2026 Advocacy Organization of the Year"] }
  ],
  skills: ["Client Intake & Documentation", "Database & Records Management", "Progress Reporting", "Scheduling & Calendar Coordination", "Microsoft Word, Excel & Outlook", "Community Resource Awareness", "Direct Care Support", "Attention to Detail Under Deadlines"],
  certifications: ["AI Fluency: Framework & Foundations — Anthropic", "AI Fluency for Nonprofits — Anthropic", "Claude 101 — Anthropic (2026)"],
  qualifications: {
    education_level: "bachelors",
    admin_experience_months: 22,
    direct_care_experience: true,
    mental_health_adjacent: true,
    min_qualifications_met: ["high school diploma", "bachelor's degree", "6 months admin experience", "1 year admin experience", "2 years admin experience", "clerical experience", "direct care experience"]
  }
};

const RESUME_BASE = `NADIA HARDY
New York, NY | nadia.hardy1705@gmail.com | 646-696-5734

PROFESSIONAL SUMMARY
Recent Howard University graduate (Cum Laude, B.A. Political Science) with over two years of experience in client intake, high-volume service coordination, records management, and administrative support. Background includes direct work alongside individuals navigating serious mental health and behavioral challenges through weekly mentorship at a correctional facility. Detail-oriented, reliable, and committed to public service and healthcare environments.

CORE SKILLS
Client Intake & Documentation | Database & Records Management | Progress Reporting | Scheduling & Calendar Coordination | Community Resource Awareness | Client Follow-Up & Communication | Microsoft Word, Excel & Outlook | Attention to Detail Under Deadlines

EXPERIENCE
Administrative Assistant — Dunton Consulting, New York, NY (Jul 2024 – May 2026)
• Supported intake and documentation for 35–50 individuals per cycle, verifying required materials and tracking completion status across multiple systems
• Maintained and updated tracking databases, monitoring records with close attention to accuracy and procedural compliance
• Drafted progress summaries, status reports, and correspondence for supervisors and stakeholders
• Served as primary point of contact for 100+ daily inquiries, routing requests and maintaining organized records from intake through resolution
• Coordinated scheduling, calendar maintenance, and distribution of communications across teams

Childcare Provider — Concerned Parents NYC Early Education Center, New York, NY (Jul 2023 – Aug 2025)
• Maintained daily logs and communicated progress reports to parents and supervisors
• Built consistent, trust-based relationships with families from diverse backgrounds

COMMUNITY ENGAGEMENT & LEADERSHIP
Volunteer Mentor — Youth Justice Advocates, Howard University, Washington, DC (2024 – 2026)
• Mentored incarcerated youth twice weekly at a DC juvenile detention center, providing one-on-one support alongside individuals navigating serious mental health and life challenges
• Practiced active listening, consistent boundary-setting, and patience while building trust with young people in crisis

Member — NCNW Howard Chapter, Washington, DC (2024 – Present)
• Organized mentoring programs, community service drives, and scholarship initiatives
• Contributed to chapter earning 2025–2026 Advocacy Organization of the Year

EDUCATION
B.A. Political Science, Minor: History — Cum Laude
Howard University, Washington, DC — May 2026

CERTIFICATIONS
AI Fluency: Framework & Foundations — Anthropic | AI Fluency for Nonprofits — Anthropic | Claude 101 — Anthropic (2026)`;

// ─── Mock Jobs ────────────────────────────────────────────────────────────────
const MOCK_JOBS = [
  { id: "SJ-219001", source: "StateJobs NY", title: "Mental Health Therapy Aide", agency: "OMH — Creedmoor Psychiatric Center", location: "Queens Village, NY", salary: "$58,225 – $62,413", deadline: "2026-07-15", description: "Direct care staff supporting individuals with serious mental illness. No psychiatric experience required. High school diploma required.", email: "cr-hr-mail@omh.ny.gov", subjectNote: "Title and Location", extraDocs: ["OMH Employment Application"] },
  { id: "SJ-219002", source: "StateJobs NY", title: "Administrative Assistant 1 Trainee", agency: "OPWDD — Bernard Fineson DDSO", location: "Queens Village, NY", salary: "$44,625+", deadline: "2026-07-20", description: "Clerical and administrative support for Article 16 Clinic and Medical Records. Six months of admin experience required.", email: "BernardFineson.Careers@opwdd.ny.gov", subjectNote: "EOA# and Title", extraDocs: [] },
  { id: "HH-001", source: "H+H Careers", title: "Clerical Associate", agency: "NYC Health + Hospitals — Queens Hospital Center", location: "Jamaica, NY", salary: "$35,000 – $42,000", deadline: "2026-07-30", description: "Filing, data entry, scheduling, and patient coordination support. High school diploma required.", email: "hh-hr@nychhc.org", subjectNote: "Job Title and ID", extraDocs: [] },
  { id: "HH-002", source: "H+H Careers", title: "Community Health Worker", agency: "NYC Health + Hospitals — Elmhurst Hospital", location: "Elmhurst, NY", salary: "$40,000 – $50,000", deadline: "2026-08-01", description: "Connect patients to community resources, assist with navigation of social services and health education. Bachelor's degree preferred.", email: "hh-outreach@nychhc.org", subjectNote: "Job Title and ID", extraDocs: [] },
  { id: "OMH-001", source: "OMH Portal", title: "Program Aide", agency: "NYC Office of Mental Health — Manhattan", location: "New York, NY", salary: "$42,000 – $48,000", deadline: "2026-07-18", description: "Support program operations and documentation in a psychiatric outpatient setting. High school diploma required, bachelor's preferred.", email: "hr@omh.ny.gov", subjectNote: "Vacancy Title", extraDocs: ["OMH Employment Application"] },
  { id: "IN-001", source: "Indeed", title: "Case Manager Trainee", agency: "Women In Need (WIN)", location: "Brooklyn, NY", salary: "$42,000 – $46,000", deadline: "2026-07-25", description: "Support women in shelter with intake, case documentation, and referrals to services. Bachelor's degree required.", email: "careers@win-nyc.org", subjectNote: "Position Title", extraDocs: [] },
  { id: "LI-001", source: "LinkedIn", title: "Eligibility Specialist Trainee", agency: "NYC Human Resources Administration", location: "New York, NY", salary: "$38,000 – $45,000", deadline: "2026-08-05", description: "Determine eligibility for public assistance programs, conduct interviews, maintain case files. Bachelor's degree or equivalent experience.", email: "hra-hr@dss.nyc.gov", subjectNote: "Title and Exam Number", extraDocs: [] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const callClaude = async (prompt, maxTokens = 1000) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
};

const STATUS_COLOR = {
  pending: "bg-gray-100 text-gray-500",
  qualified: "bg-emerald-100 text-emerald-700",
  review: "bg-amber-100 text-amber-700",
  not_qualified: "bg-red-100 text-red-700",
  drafting: "bg-blue-100 text-blue-700",
  drafted: "bg-purple-100 text-purple-700",
};

const STATUS_LABEL = {
  pending: "Pending",
  qualified: "Qualified",
  review: "Needs Review",
  not_qualified: "Not Qualified",
  drafting: "Drafting...",
  drafted: "Draft Ready",
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function JobAgent() {
  const [tab, setTab] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanLog, setScanLog] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [filterSource, setFilterSource] = useState("All");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const log = (msg) => setScanLog((p) => [...p, { time: new Date().toLocaleTimeString(), msg }]);

  // ── Qualify ──
  const qualifyJob = useCallback(async (job) => {
    const prompt = `You are an AI assistant reviewing a job posting for Nadia Hardy to determine if she qualifies.

NADIA'S QUALIFICATIONS:
- Education: B.A. Political Science, Cum Laude, Howard University (May 2026)
- Admin experience: 22 months (intake, database management, scheduling, reporting)
- Direct care: Yes — mentored incarcerated youth twice weekly at a DC juvenile detention center
- Mental health adjacent: Yes — worked directly with individuals navigating serious mental health challenges
- Other: childcare provider with documentation and parent communication experience
- Minimum quals she meets: high school diploma, bachelor's degree, 6 months admin, 1 year admin, 2 years admin, clerical experience, direct care experience

JOB POSTING:
Title: ${job.title}
Agency: ${job.agency}
Description: ${job.description}

Respond ONLY with valid JSON, no markdown:
{"status": "qualified" OR "review" OR "not_qualified", "reason": "one clear sentence explaining why"}`;

    try {
      const text = await callClaude(prompt);
      const clean = text.replace(/```json|```/g, "").trim();
      return JSON.parse(clean);
    } catch {
      return { status: "review", reason: "Could not auto-assess — review manually." };
    }
  }, []);

  // ── Tailor Resume ──
  const tailorResume = useCallback(async (job) => {
    const prompt = `Rewrite the Professional Summary section of this resume to better match the job posting. Keep everything else exactly the same. Only rewrite the summary — 3-4 sentences max, natural and honest, no exaggeration.

JOB: ${job.title} at ${job.agency}
DESCRIPTION: ${job.description}

CURRENT RESUME:
${RESUME_BASE}

Return the full resume with only the Professional Summary rewritten. No extra commentary.`;

    try {
      return await callClaude(prompt, 1500);
    } catch {
      return RESUME_BASE;
    }
  }, []);

  // ── Draft Email ──
  const draftEmail = useCallback(async (job) => {
    const prompt = `Write a professional job application email for Nadia Hardy.

NADIA:
- Recent Howard University grad, B.A. Political Science, Cum Laude (May 2026)
- 22 months admin experience (intake, databases, scheduling, reporting, 100+ daily inquiries)
- Volunteer mentor at DC juvenile detention center — direct care with individuals with serious mental health challenges
- Committed to healthcare and public service

JOB:
Title: ${job.title}
Agency: ${job.agency}
Job ID: ${job.id}
Description: ${job.description}
Subject must include: ${job.subjectNote}
${job.extraDocs.length > 0 ? `Mention attaching: ${job.extraDocs.join(", ")} along with resume` : "Mention attaching resume"}

Write a natural email — professional but not stiff. Casual with a hint of professionalism.

Format exactly like this:
SUBJECT: [subject line here]
BODY:
[email body here]`;

    try {
      const text = await callClaude(prompt);
      const subjectMatch = text.match(/SUBJECT:\s*(.+)/);
      const bodyMatch = text.match(/BODY:\n([\s\S]+)/);
      return {
        subject: subjectMatch?.[1]?.trim() || `Application: ${job.title}`,
        body: bodyMatch?.[1]?.trim() || text,
      };
    } catch {
      return { subject: `Application: ${job.title} — ${job.agency}`, body: "Error generating email. Please write manually." };
    }
  }, []);

  // ── Full Draft Flow ──
  const runDraft = useCallback(async (job) => {
    setJobs((p) => p.map((j) => j.id === job.id ? { ...j, status: "drafting" } : j));

    const [email, resume] = await Promise.all([
      draftEmail(job),
      tailorResume(job),
    ]);

    const draft = {
      id: job.id,
      job,
      subject: email.subject,
      body: email.body,
      resume,
      createdAt: new Date().toLocaleString(),
    };

    setDrafts((p) => [...p.filter((d) => d.id !== job.id), draft]);
    setJobs((p) => p.map((j) => j.id === job.id ? { ...j, status: "drafted" } : j));
    showToast("Draft ready!");
  }, [draftEmail, tailorResume]);

  // ── Scan ──
  const runScan = useCallback(async () => {
    setScanning(true);
    setScanLog([]);
    setJobs([]);

    const sources = ["StateJobs NY", "H+H Careers", "OMH Portal", "Indeed", "LinkedIn"];
    for (const src of sources) {
      log(`Scanning ${src}...`);
      await sleep(600);
      const count = MOCK_JOBS.filter((j) => j.source === src).length;
      log(`Found ${count} posting${count !== 1 ? "s" : ""} on ${src}`);
    }

    log("Running AI qualification check on all postings...");
    const results = [];
    for (const job of MOCK_JOBS) {
      log(`Reviewing: ${job.title}`);
      const qual = await qualifyJob(job);
      results.push({ ...job, status: qual.status, reason: qual.reason });
      await sleep(200);
    }

    const qualified = results.filter((j) => j.status === "qualified").length;
    const review = results.filter((j) => j.status === "review").length;
    log(`Done. ${qualified} qualified, ${review} to review, ${results.length - qualified - review} not qualified.`);

    setJobs(results);
    setScanning(false);
    setTab("jobs");
  }, [qualifyJob]);

  const allSources = ["All", ...new Set(MOCK_JOBS.map((j) => j.source))];
  const filteredJobs = filterSource === "All" ? jobs : jobs.filter((j) => j.source === filterSource);

  // ── Dashboard ──
  const Dashboard = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Jobs Found", value: jobs.length, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Qualified", value: jobs.filter((j) => ["qualified","drafted"].includes(j.status)).length, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Drafts Ready", value: drafts.length, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "To Review", value: jobs.filter((j) => j.status === "review").length, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.bg}`}>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="font-semibold text-gray-800 mb-1">Job Search Agent</p>
        <p className="text-sm text-gray-400 mb-4">Searches 5 job boards, qualifies each posting against your profile with AI, then drafts tailored emails and resumes for every match.</p>
        <button onClick={runScan} disabled={scanning} className="w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition">
          {scanning ? "Scanning..." : jobs.length > 0 ? "Run New Scan" : "Run Job Scan"}
        </button>
      </div>

      {scanLog.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-4 font-mono text-xs text-green-400 space-y-1 max-h-52 overflow-y-auto">
          {scanLog.map((l, i) => (
            <div key={i}><span className="text-gray-500">[{l.time}]</span> {l.msg}</div>
          ))}
          {scanning && <div className="animate-pulse text-green-300">▊</div>}
        </div>
      )}

      {drafts.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="font-semibold text-gray-800 mb-3">Recent Drafts</p>
          {drafts.slice(-3).map((d) => (
            <div key={d.id} onClick={() => { setSelectedDraft(d); setTab("drafts"); }} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-700">{d.job.title}</p>
                <p className="text-xs text-gray-400">{d.job.agency}</p>
              </div>
              <span className="text-xs text-purple-600 font-medium">View →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Jobs ──
  const Jobs = () => (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {allSources.map((s) => (
          <button key={s} onClick={() => setFilterSource(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${filterSource === s ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>{s}</button>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-16 text-gray-300">
          <p className="text-5xl mb-3">🔍</p>
          <p className="font-medium text-gray-400">No jobs yet</p>
          <p className="text-sm">Run a scan from the Dashboard</p>
        </div>
      )}

      {filteredJobs.map((job) => (
        <div key={job.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{job.title}</p>
              <p className="text-xs text-gray-400 truncate">{job.agency}</p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_COLOR[job.status]}`}>{STATUS_LABEL[job.status]}</span>
          </div>
          <div className="flex gap-3 text-xs text-gray-400 mb-3 flex-wrap">
            <span>📍 {job.location}</span>
            <span>💰 {job.salary}</span>
            <span>⏰ {job.deadline}</span>
          </div>
          {job.reason && <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3 leading-relaxed">{job.reason}</p>}
          <div className="flex gap-2">
            <button onClick={() => setSelectedJob(job)} className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition">Details</button>
            {(job.status === "qualified" || job.status === "review") && (
              <button onClick={() => runDraft(job)} className="flex-1 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition">
                Draft Email + Resume
              </button>
            )}
            {job.status === "drafted" && (
              <button onClick={() => { setSelectedDraft(drafts.find((d) => d.id === job.id)); setTab("drafts"); }} className="flex-1 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition">View Draft</button>
            )}
            {job.status === "drafting" && (
              <button disabled className="flex-1 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-500 cursor-not-allowed">Writing...</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // ── Drafts ──
  const Drafts = () => (
    <div className="space-y-4">
      {drafts.length === 0 && (
        <div className="text-center py-16 text-gray-300">
          <p className="text-5xl mb-3">✉️</p>
          <p className="font-medium text-gray-400">No drafts yet</p>
          <p className="text-sm">Hit "Draft Email + Resume" on any qualified job</p>
        </div>
      )}

      {selectedDraft ? (
        <div className="space-y-4">
          <button onClick={() => setSelectedDraft(null)} className="text-sm text-indigo-600 font-medium">← All Drafts</button>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="font-bold text-gray-800">{selectedDraft.job.title}</p>
            <p className="text-sm text-gray-400 mb-4">{selectedDraft.job.agency}</p>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Email</p>
            <div className="bg-indigo-50 rounded-xl px-3 py-2 mb-2">
              <p className="text-xs text-indigo-500 font-medium">Subject</p>
              <p className="text-sm text-indigo-900 font-medium">{selectedDraft.subject}</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-3 mb-3 max-h-52 overflow-y-auto">
              <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">{selectedDraft.body}</p>
            </div>

            {selectedDraft.job.extraDocs.length > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3">
                <p className="text-xs font-semibold text-amber-700 mb-1">⚠️ Also attach before sending:</p>
                {selectedDraft.job.extraDocs.map((d) => <p key={d} className="text-xs text-amber-700">• {d}</p>)}
              </div>
            )}

            <div className="flex gap-2 mb-5">
              <button onClick={() => { navigator.clipboard.writeText(`To: ${selectedDraft.job.email}\nSubject: ${selectedDraft.subject}\n\n${selectedDraft.body}`); showToast("Email copied!"); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Copy Email</button>
              <a href={`mailto:${selectedDraft.job.email}?subject=${encodeURIComponent(selectedDraft.subject)}&body=${encodeURIComponent(selectedDraft.body)}`} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition text-center">Open in Mail</a>
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tailored Resume</p>
            <div className="bg-gray-50 rounded-xl px-3 py-3 max-h-52 overflow-y-auto mb-3">
              <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed font-mono">{selectedDraft.resume}</p>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(selectedDraft.resume); showToast("Resume copied!"); }} className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Copy Resume Text</button>
          </div>
        </div>
      ) : (
        drafts.map((d) => (
          <div key={d.id} onClick={() => setSelectedDraft(d)} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:border-indigo-200 transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-800">{d.job.title}</p>
                <p className="text-xs text-gray-400">{d.job.agency}</p>
                <p className="text-xs text-gray-300 mt-1">{d.createdAt}</p>
              </div>
              <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">Ready</span>
            </div>
            <p className="text-xs text-gray-500 mt-3 truncate">📧 {d.subject}</p>
          </div>
        ))
      )}
    </div>
  );

  // ── Profile ──
  const Profile = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">N</div>
          <div>
            <p className="font-bold text-gray-800 text-lg">{PROFILE.name}</p>
            <p className="text-sm text-gray-400">{PROFILE.email}</p>
            <p className="text-sm text-gray-400">{PROFILE.phone}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-gray-500 mb-1">Education</p>
          <p className="text-sm text-gray-700">{PROFILE.education}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="font-semibold text-gray-800 mb-3">Qualification Flags</p>
        <div className="space-y-2">
          {[
            { label: "Admin Experience", value: "22 months", ok: true },
            { label: "Direct Care Experience", value: "Yes — DC juvenile detention center", ok: true },
            { label: "Mental Health Adjacent", value: "Yes — worked with individuals w/ serious MH challenges", ok: true },
            { label: "Education", value: "Bachelor's Degree", ok: true },
          ].map((f) => (
            <div key={f.label} className="flex items-start gap-3">
              <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
              <div>
                <p className="text-sm font-medium text-gray-700">{f.label}</p>
                <p className="text-xs text-gray-400">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="font-semibold text-gray-800 mb-3">Skills</p>
        <div className="flex flex-wrap gap-2">
          {PROFILE.skills.map((s) => <span key={s} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">{s}</span>)}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="font-semibold text-gray-800 mb-3">Experience</p>
        <div className="space-y-4">
          {PROFILE.experience.map((e) => (
            <div key={e.title} className="border-l-2 border-indigo-100 pl-3">
              <p className="text-sm font-semibold text-gray-700">{e.title}</p>
              <p className="text-xs text-gray-400 mb-1">{e.employer} · {e.dates}</p>
              {e.bullets.slice(0, 2).map((b) => <p key={b} className="text-xs text-gray-500 leading-relaxed">• {b}</p>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Job Modal ──
  const JobModal = () => !selectedJob ? null : (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={() => setSelectedJob(null)}>
      <div className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-bold text-gray-800 text-lg leading-tight">{selectedJob.title}</p>
            <p className="text-gray-400 text-sm">{selectedJob.agency}</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_COLOR[selectedJob.status]}`}>{STATUS_LABEL[selectedJob.status]}</span>
        </div>
        <div className="space-y-2.5 mb-4">
          {[
            ["Source", selectedJob.source],
            ["Location", selectedJob.location],
            ["Salary", selectedJob.salary],
            ["Deadline", selectedJob.deadline],
            ["Send To", selectedJob.email],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="text-gray-400">{k}</span>
              <span className="font-medium text-gray-700 text-right max-w-48 truncate">{v}</span>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          <p className="text-xs font-semibold text-gray-500 mb-1">Description</p>
          <p className="text-sm text-gray-600 leading-relaxed">{selectedJob.description}</p>
        </div>
        {selectedJob.reason && (
          <div className={`rounded-xl p-3 mb-4 ${STATUS_COLOR[selectedJob.status]}`}>
            <p className="text-xs font-semibold mb-1">AI Assessment</p>
            <p className="text-xs leading-relaxed">{selectedJob.reason}</p>
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={() => setSelectedJob(null)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold">Close</button>
          {(selectedJob.status === "qualified" || selectedJob.status === "review") && (
            <button onClick={() => { runDraft(selectedJob); setSelectedJob(null); }} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold">Draft Email</button>
          )}
        </div>
      </div>
    </div>
  );

  const TABS = [
    { id: "dashboard", icon: "⚡", label: "Home" },
    { id: "jobs", icon: "🔍", label: "Jobs" },
    { id: "drafts", icon: "✉️", label: "Drafts" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto pb-24">
        <div className="bg-white border-b border-gray-100 px-5 pt-10 pb-4 sticky top-0 z-40">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-0.5">WithLoveYourRN</p>
          <h1 className="text-xl font-bold text-gray-900">Job Agent 🤖</h1>
        </div>

        <div className="px-4 pt-5">
          {tab === "dashboard" && <Dashboard />}
          {tab === "jobs" && <Jobs />}
          {tab === "drafts" && <Drafts />}
          {tab === "profile" && <Profile />}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex max-w-md mx-auto">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => { setTab(t.id); setSelectedDraft(null); }} className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors ${tab === t.id ? "text-indigo-600" : "text-gray-300"}`}>
            <span className="text-xl">{t.icon}</span>
            <span className="text-xs font-medium">{t.label}</span>
          </button>
        ))}
      </nav>

      <JobModal />

      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
