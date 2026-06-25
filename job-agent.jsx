import { useState, useEffect, useCallback } from "react";

// ─── Nadia's Profile ────────────────────────────────────────────────────────
const PROFILE = {
  name: "Nadia Hardy",
  email: "nadia.hardy1705@gmail.com",
  phone: "646-696-5734",
  location: "New York, NY",
  education: "B.A. Political Science, Minor History — Cum Laude, Howard University (May 2026)",
  experience: [
    { title: "Administrative Assistant", employer: "Dunton Consulting", dates: "Jul 2024 – May 2026", bullets: ["Supported intake and documentation for 35–50 individuals per cycle", "Maintained tracking databases across multiple platforms", "Drafted progress summaries and status reports for supervisors", "Served as primary point of contact for 100+ daily inquiries", "Coordinated scheduling and calendar management"] },
    { title: "Childcare Provider", employer: "Concerned Parents NYC Early Education Center", dates: "Jul 2023 – Aug 2025", bullets: ["Maintained daily logs and communicated progress reports to parents and supervisors", "Built relationships with families from diverse backgrounds"] },
    { title: "Volunteer Mentor", employer: "Youth Justice Advocates — Howard University", dates: "2024 – 2026", bullets: ["Mentored incarcerated youth twice weekly at a DC juvenile detention center", "Provided one-on-one support to individuals navigating mental health challenges", "Practiced active listening and boundary-setting in a high-stakes environment"] },
    { title: "Member", employer: "NCNW Howard Chapter", dates: "2024 – Present", bullets: ["Organized mentoring programs, service drives, and scholarship initiatives", "Contributed to chapter earning 2025–2026 Advocacy Organization of the Year"] }
  ],
  skills: ["Client Intake & Documentation", "Database & Records Management", "Progress Reporting", "Scheduling & Calendar Coordination", "Microsoft Word, Excel & Outlook", "Community Resource Awareness", "Direct Care Support", "Attention to Detail"],
  certifications: ["AI Fluency: Framework & Foundations — Anthropic", "AI Fluency for Nonprofits — Anthropic", "Claude 101 — Anthropic (2026)"],
  qualifications: {
    education_level: "bachelors",
    admin_experience_months: 22,
    direct_care_experience: true,
    mental_health_adjacent: true,
    min_qualifications_met: ["high school diploma", "bachelor's degree", "6 months admin experience", "1 year admin experience", "2 years admin experience", "clerical experience", "direct care experience"]
  }
};

// ─── Mock Job Sources ────────────────────────────────────────────────────────
const MOCK_JOBS = [
  { id: "SJ-219001", source: "StateJobs NY", title: "Mental Health Therapy Aide", agency: "OMH — Creedmoor Psychiatric Center", location: "Queens Village, NY", salary: "$58,225 – $62,413", deadline: "2026-07-15", url: "https://statejobs.ny.gov", description: "Direct care staff supporting individuals with serious mental illness. No psychiatric experience required. High school diploma required.", email: "cr-hr-mail@omh.ny.gov", subject_must_include: "Title and Location", extra_attachments: ["OMH Employment Application"] },
  { id: "SJ-219002", source: "StateJobs NY", title: "Administrative Assistant 1 Trainee", agency: "OPWDD — Bernard Fineson DDSO", location: "Queens Village, NY", salary: "$44,625+", deadline: "2026-07-20", url: "https://statejobs.ny.gov", description: "Clerical and administrative support for Article 16 Clinic and Medical Records. Six months of admin experience required.", email: "BernardFineson.Careers@opwdd.ny.gov", subject_must_include: "EOA# and Title", extra_attachments: [] },
  { id: "HH-001", source: "H+H Careers", title: "Clerical Associate", agency: "NYC Health + Hospitals — Queens Hospital Center", location: "Jamaica, NY", salary: "$35,000 – $42,000", deadline: "2026-07-30", url: "https://careers.nychhc.org", description: "Filing, data entry, scheduling, and patient coordination support. High school diploma required.", email: "hh-hr@nychhc.org", subject_must_include: "Job Title and ID", extra_attachments: [] },
  { id: "HH-002", source: "H+H Careers", title: "Community Health Worker", agency: "NYC Health + Hospitals — Elmhurst Hospital", location: "Elmhurst, NY", salary: "$40,000 – $50,000", deadline: "2026-08-01", url: "https://careers.nychhc.org", description: "Connect patients to community resources, assist with navigation of social services and health education. Bachelor's degree preferred.", email: "hh-hr@nychhc.org", subject_must_include: "Job Title and ID", extra_attachments: [] },
  { id: "IN-001", source: "Indeed", title: "Program Aide", agency: "NYC Office of Mental Health", location: "New York, NY", salary: "$42,000 – $48,000", deadline: "2026-07-18", url: "https://indeed.com", description: "Support program operations and documentation in a psychiatric outpatient setting. High school diploma required, bachelor's preferred.", email: "hr@omh.ny.gov", subject_must_include: "Vacancy Title", extra_attachments: ["OMH Employment Application"] },
  { id: "LI-001", source: "LinkedIn", title: "Case Manager Trainee", agency: "Women In Need (WIN)", location: "Brooklyn, NY", salary: "$42,000 – $46,000", deadline: "2026-07-25", url: "https://linkedin.com", description: "Support women in shelter with intake, case documentation, and referrals to services. Bachelor's degree required.", email: "careers@win-nyc.org", subject_must_include: "Position Title", extra_attachments: [] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const callClaude = async (prompt) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
};

const statusColors = {
  qualified: "bg-emerald-100 text-emerald-800",
  review: "bg-amber-100 text-amber-800",
  not_qualified: "bg-red-100 text-red-800",
  drafting: "bg-blue-100 text-blue-800",
  drafted: "bg-purple-100 text-purple-800",
  pending: "bg-gray-100 text-gray-600",
};

const statusLabels = {
  qualified: "Qualified",
  review: "Review",
  not_qualified: "Not Qualified",
  drafting: "Drafting...",
  drafted: "Draft Ready",
  pending: "Pending",
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function JobAgent() {
  const [tab, setTab] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanLog, setScanLog] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [filterSource, setFilterSource] = useState("All");

  const sources = ["All", "StateJobs NY", "H+H Careers", "OMH Portal", "Indeed", "LinkedIn"];

  const addLog = (msg) => setScanLog((p) => [...p, { time: new Date().toLocaleTimeString(), msg }]);

  const qualifyJob = useCallback(async (job) => {
    const prompt = `You are reviewing a job posting for Nadia Hardy.

NADIA'S PROFILE:
- Education: ${PROFILE.education}
- Admin experience: ${PROFILE.qualifications.admin_experience_months} months
- Direct care experience: ${PROFILE.qualifications.direct_care_experience}
- Mental health adjacent experience: ${PROFILE.qualifications.mental_health_adjacent}
- Minimum qualifications she meets: ${PROFILE.qualifications.min_qualifications_met.join(", ")}

JOB POSTING:
Title: ${job.title}
Agency: ${job.agency}
Description: ${job.description}

Does Nadia qualify? Reply with ONLY a JSON object like:
{"status": "qualified" or "review" or "not_qualified", "reason": "one sentence explanation"}`;

    try {
      const text = await callClaude(prompt);
      const clean = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(clean);
      return result;
    } catch {
      return { status: "review", reason: "Could not auto-qualify — please review manually." };
    }
  }, []);

  const runScan = useCallback(async () => {
    setScanning(true);
    setScanLog([]);
    setJobs([]);

    const sourcesToScan = ["StateJobs NY", "H+H Careers", "OMH Portal", "Indeed", "LinkedIn"];

    for (const source of sourcesToScan) {
      addLog(`Scanning ${source}...`);
      await sleep(800);
      const found = MOCK_JOBS.filter((j) => j.source === source || (source === "OMH Portal" && j.id.startsWith("IN")));
      addLog(`Found ${found.length} posting(s) on ${source}`);
    }

    addLog("Running AI qualification check...");
    await sleep(500);

    const results = [];
    for (const job of MOCK_JOBS) {
      addLog(`Reviewing: ${job.title} at ${job.agency}`);
      const qual = await qualifyJob(job);
      results.push({ ...job, status: qual.status, reason: qual.reason });
      await sleep(300);
    }

    setJobs(results);
    addLog(`Done. Found ${results.filter(j => j.status === "qualified").length} qualified, ${results.filter(j => j.status === "review").length} to review.`);
    setScanning(false);
    setTab("jobs");
  }, [qualifyJob]);

  const draftEmail = useCallback(async (job) => {
    setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, status: "drafting" } : j));

    const prompt = `Write a professional job application email for Nadia Hardy applying to the following position.

NADIA'S PROFILE:
Name: ${PROFILE.name}
Email: ${PROFILE.email}
Phone: ${PROFILE.phone}
Education: ${PROFILE.education}
Key experience: Administrative support (22 months), volunteer mentor at DC juvenile detention center (direct care with individuals with mental health challenges), childcare provider
Skills: ${PROFILE.skills.join(", ")}

JOB:
Title: ${job.title}
Agency: ${job.agency}
Job ID: ${job.id}
Description: ${job.description}
Subject line must include: ${job.subject_must_include}
${job.extra_attachments.length > 0 ? `Extra attachments required: ${job.extra_attachments.join(", ")}` : ""}

Write a natural, professional email (not stiff or overly formal). Include:
1. A subject line
2. The email body

Format as:
SUBJECT: [subject line]
BODY:
[email body]`;

    try {
      const text = await callClaude(prompt);
      const subjectMatch = text.match(/SUBJECT:\s*(.+)/);
      const bodyMatch = text.match(/BODY:\n([\s\S]+)/);
      const subject = subjectMatch ? subjectMatch[1].trim() : `Application: ${job.title} — ${job.agency}`;
      const body = bodyMatch ? bodyMatch[1].trim() : text;

      const draft = { id: job.id, job, subject, body, createdAt: new Date().toLocaleString() };
      setDrafts((prev) => [...prev.filter((d) => d.id !== job.id), draft]);
      setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, status: "drafted" } : j));
    } catch {
      setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, status: "qualified" } : j));
    }
  }, []);

  const filteredJobs = filterSource === "All" ? jobs : jobs.filter((j) => j.source === filterSource);

  // ── Dashboard ──
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Jobs Found", value: jobs.length, color: "text-blue-600" },
          { label: "Qualified", value: jobs.filter(j => j.status === "qualified" || j.status === "drafted").length, color: "text-emerald-600" },
          { label: "Drafts Ready", value: drafts.length, color: "text-purple-600" },
          { label: "Needs Review", value: jobs.filter(j => j.status === "review").length, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-1">Job Search Agent</h2>
        <p className="text-sm text-gray-500 mb-4">Searches StateJobs NY, H+H, OMH, Indeed, and LinkedIn. Qualifies each posting against your profile using AI, then drafts emails for matches.</p>
        <button
          onClick={runScan}
          disabled={scanning}
          className="w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {scanning ? "Scanning..." : "Run Job Scan"}
        </button>
      </div>

      {scanLog.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-4 font-mono text-xs text-green-400 space-y-1 max-h-48 overflow-y-auto">
          {scanLog.map((l, i) => (
            <div key={i}><span className="text-gray-500">[{l.time}]</span> {l.msg}</div>
          ))}
          {scanning && <div className="animate-pulse">▊</div>}
        </div>
      )}
    </div>
  );

  // ── Jobs Tab ──
  const Jobs = () => (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {sources.map((s) => (
          <button
            key={s}
            onClick={() => setFilterSource(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${filterSource === s ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >{s}</button>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No jobs yet</p>
          <p className="text-sm">Run a scan from the Dashboard</p>
        </div>
      )}

      {filteredJobs.map((job) => (
        <div key={job.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="font-semibold text-gray-800">{job.title}</p>
              <p className="text-sm text-gray-500">{job.agency}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${statusColors[job.status]}`}>
              {statusLabels[job.status]}
            </span>
          </div>
          <div className="flex gap-3 text-xs text-gray-400 mb-3">
            <span>📍 {job.location}</span>
            <span>💰 {job.salary}</span>
            <span>⏰ Due {job.deadline}</span>
          </div>
          {job.reason && (
            <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3">{job.reason}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedJob(job)}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >View Details</button>
            {(job.status === "qualified" || job.status === "review") && (
              <button
                onClick={() => draftEmail(job)}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >Draft Email</button>
            )}
            {job.status === "drafted" && (
              <button
                onClick={() => { setTab("drafts"); }}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition"
              >View Draft</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // ── Drafts Tab ──
  const Drafts = () => (
    <div className="space-y-4">
      {drafts.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">✉️</p>
          <p className="font-medium">No drafts yet</p>
          <p className="text-sm">Draft emails from the Jobs tab</p>
        </div>
      )}
      {drafts.map((draft) => (
        <div key={draft.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-800">{draft.job.title}</p>
              <p className="text-sm text-gray-500">{draft.job.agency}</p>
            </div>
            <span className="text-xs text-gray-400">{draft.createdAt}</span>
          </div>
          <div className="bg-indigo-50 rounded-lg px-3 py-2 mb-3">
            <p className="text-xs font-medium text-indigo-700">Subject:</p>
            <p className="text-sm text-indigo-900">{draft.subject}</p>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 py-3 mb-3 max-h-48 overflow-y-auto">
            <p className="text-xs text-gray-600 whitespace-pre-wrap">{draft.body}</p>
          </div>
          {draft.job.extra_attachments.length > 0 && (
            <div className="bg-amber-50 rounded-lg px-3 py-2 mb-3">
              <p className="text-xs font-medium text-amber-700">⚠️ Also attach before sending:</p>
              {draft.job.extra_attachments.map((a) => (
                <p key={a} className="text-xs text-amber-800">• {a}</p>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`)}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >Copy Email</button>
            <a
              href={`mailto:${draft.job.email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition text-center"
            >Open in Mail</a>
          </div>
        </div>
      ))}
    </div>
  );

  // ── Profile Tab ──
  const Profile = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">N</div>
          <div>
            <p className="font-bold text-gray-800 text-lg">{PROFILE.name}</p>
            <p className="text-sm text-gray-500">{PROFILE.email}</p>
            <p className="text-sm text-gray-500">{PROFILE.phone}</p>
          </div>
        </div>
        <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
          <p className="font-medium text-gray-700 mb-1">Education</p>
          <p>{PROFILE.education}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="font-semibold text-gray-800 mb-3">Skills</p>
        <div className="flex flex-wrap gap-2">
          {PROFILE.skills.map((s) => (
            <span key={s} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">{s}</span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="font-semibold text-gray-800 mb-3">Experience</p>
        <div className="space-y-4">
          {PROFILE.experience.map((e) => (
            <div key={e.title}>
              <p className="font-medium text-gray-700 text-sm">{e.title}</p>
              <p className="text-xs text-gray-500 mb-1">{e.employer} · {e.dates}</p>
              {e.bullets.map((b) => (
                <p key={b} className="text-xs text-gray-600 before:content-['•'] before:mr-1">{b}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Job Detail Modal ──
  const JobModal = () => selectedJob && (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setSelectedJob(null)}>
      <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
        <p className="font-bold text-gray-800 text-lg">{selectedJob.title}</p>
        <p className="text-gray-500 mb-4">{selectedJob.agency}</p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Source</span><span className="font-medium">{selectedJob.source}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Location</span><span className="font-medium">{selectedJob.location}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Salary</span><span className="font-medium">{selectedJob.salary}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Deadline</span><span className="font-medium">{selectedJob.deadline}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Send To</span><span className="font-medium text-indigo-600">{selectedJob.email}</span></div>
        </div>
        <div className="mt-4 bg-gray-50 rounded-xl p-3">
          <p className="text-xs font-medium text-gray-700 mb-1">Description</p>
          <p className="text-xs text-gray-600">{selectedJob.description}</p>
        </div>
        {selectedJob.reason && (
          <div className={`mt-3 rounded-xl p-3 ${statusColors[selectedJob.status]}`}>
            <p className="text-xs font-medium mb-1">AI Assessment</p>
            <p className="text-xs">{selectedJob.reason}</p>
          </div>
        )}
        <button onClick={() => setSelectedJob(null)} className="mt-4 w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium">Close</button>
      </div>
    </div>
  );

  // ── Layout ──
  const tabs = [
    { id: "dashboard", icon: "⚡", label: "Dashboard" },
    { id: "jobs", icon: "🔍", label: "Jobs" },
    { id: "drafts", icon: "✉️", label: "Drafts" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-md mx-auto pb-24">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-5 pt-10 pb-4 sticky top-0 z-40">
          <p className="text-xs text-indigo-500 font-semibold uppercase tracking-widest mb-1">WithLoveYourRN</p>
          <h1 className="text-xl font-bold text-gray-800">Job Agent</h1>
        </div>

        {/* Content */}
        <div className="px-4 pt-5">
          {tab === "dashboard" && <Dashboard />}
          {tab === "jobs" && <Jobs />}
          {tab === "drafts" && <Drafts />}
          {tab === "profile" && <Profile />}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition ${tab === t.id ? "text-indigo-600" : "text-gray-400"}`}
          >
            <span className="text-lg">{t.icon}</span>
            <span className="text-xs font-medium">{t.label}</span>
          </button>
        ))}
      </div>

      <JobModal />
    </div>
  );
}
