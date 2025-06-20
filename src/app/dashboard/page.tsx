"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getIdeaById } from "../../api/idea";

interface BmcType {
  value_proposition: string;
  customer_segments: string[];
  channels: string[];
  revenue_streams: string[];
  cost_structures: string[];
  key_resources: string[];
  key_activities: string[];
  key_partnerships: string[];
  customer_relationships: string[];
  [key: string]: any;
}

interface ValidationReport {
  overall_feasibility_score: number;
  segment_scores: Record<string, number>;
  suggestions: string[];
  strengths: string[];
  risks: string[];
}

interface VersionHistoryItem {
  version_id: string;
  timestamp: string;
  bmc_data: BmcType;
  validation_report: ValidationReport;
  changes_made: string[];
}

export default function DashboardPage() {
  const [idea, setIdea] = useState("");
  const [bmc, setBmc] = useState<BmcType | null>(null);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [companyExamples, setCompanyExamples] = useState<any[]>([]);
  const [versions, setVersions] = useState<VersionHistoryItem[]>([]);
  const [error, setError] = useState("");

  // Dropdown open/close state
  const [openIdea, setOpenIdea] = useState(false);
  const [openBmc, setOpenBmc] = useState(false);
  const [openValidation, setOpenValidation] = useState(false);
  const [openExamples, setOpenExamples] = useState(false);
  const [openVersions, setOpenVersions] = useState(false);

  const loadData = async () => {
    setError("");
    const userId = localStorage.getItem("userId");
    const ideaId = "68551d72ac3a27e9943e1513";
    if (userId && ideaId) {
      const ideaData = await getIdeaById(userId, ideaId, setError);
      if (ideaData && ideaData.idea) {
        setIdea(ideaData.idea);
        if (ideaData.bmc && ideaData.bmc.bmc_draft) {
          setBmc(ideaData.bmc.bmc_draft);
        } else {
          setBmc(null);
        }
        setValidationReport(ideaData.bmc?.validation_report || null);
        setCompanyExamples(ideaData.bmc?.company_examples || []);
        setVersions(ideaData.bmc?.version_history || []);
      } else {
        setIdea("");
        setBmc(null);
        setValidationReport(null);
        setCompanyExamples([]);
        setVersions([]);
      }
    } else {
      setIdea("");
      setBmc(null);
      setValidationReport(null);
      setCompanyExamples([]);
      setVersions([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper for dropdown arrow
  const Arrow = ({ open }: { open: boolean }) => (
    <span className={`transform transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"}`}>▶</span>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-800 via-purple-800 to-blue-600">
      <div className="w-full max-w-5xl bg-[#181c2f] rounded-3xl shadow-2xl p-6 md:p-12 flex flex-col gap-8 mt-10 mb-10">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg tracking-tight">Result Dashboard</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</div>
        )}
        {/* Business Idea Dropdown */}
        <div className="rounded-2xl shadow-lg overflow-hidden mb-2">
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-lg font-bold text-blue-300 bg-[#23284a] hover:bg-blue-900 transition rounded-t-2xl focus:outline-none"
            onClick={() => setOpenIdea((v) => !v)}
            aria-expanded={openIdea}
          >
            <span className="flex items-center gap-2"><Arrow open={openIdea} /><svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>Business Idea</span>
          </button>
          {openIdea && (
            <div className="border-t border-blue-900 px-6 py-4 text-blue-100 bg-[#23284a]">{idea || <span className="text-gray-400">No idea submitted yet.</span>}</div>
          )}
        </div>
        {/* BMC Dropdown */}
        <div className="rounded-2xl shadow-lg overflow-hidden mb-2">
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-lg font-bold text-green-300 bg-[#23284a] hover:bg-green-900 transition rounded-t-2xl focus:outline-none"
            onClick={() => setOpenBmc((v) => !v)}
            aria-expanded={openBmc}
          >
            <span className="flex items-center gap-2"><Arrow open={openBmc} /><svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4m0 0V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4h4" /></svg>Business Model Canvas (BMC) Draft</span>
          </button>
          {openBmc && (
            <div className="border-t border-green-900 px-6 py-4 bg-[#23284a]">
              {bmc ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(bmc).map(([key, value]) => (
                    key !== "date" && (
                      <div key={key} className="bg-[#181c2f] rounded-lg p-3 border border-[#23284a]">
                        <span className="block font-medium mb-1 capitalize text-green-200">{key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                        <div className="min-h-[40px] text-blue-100">
                          {Array.isArray(value)
                            ? value.length > 0
                              ? <ul className="list-disc ml-4">{value.map((v, i) => <li key={i}>{v}</li>)}</ul>
                              : <span className="text-gray-400">(empty)</span>
                            : value || <span className="text-gray-400">(empty)</span>}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <div className="text-gray-400">(No BMC draft yet.)</div>
              )}
            </div>
          )}
        </div>
        {/* Validation Reports Dropdown */}
        <div className="rounded-2xl shadow-lg overflow-hidden mb-2">
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-lg font-bold text-yellow-200 bg-[#23284a] hover:bg-yellow-900 transition rounded-t-2xl focus:outline-none"
            onClick={() => setOpenValidation((v) => !v)}
            aria-expanded={openValidation}
          >
            <span className="flex items-center gap-2"><Arrow open={openValidation} /><svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>Validation Reports</span>
          </button>
          {openValidation && (
            <div className="border-t border-yellow-900 px-6 py-4 bg-[#23284a]">
              {validationReport ? (
                <div className="space-y-2">
                  <div><span className="font-semibold text-yellow-300">Overall Feasibility Score:</span> <span className="text-white">{validationReport.overall_feasibility_score}</span></div>
                  <div>
                    <span className="font-semibold text-yellow-300">Segment Scores:</span>
                    <ul className="list-disc ml-6 text-blue-100">
                      {Object.entries(validationReport.segment_scores).map(([seg, score]) => (
                        <li key={seg}><span className="capitalize">{seg.replace(/_/g, " ")}</span>: {score}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-yellow-300">Suggestions:</span>
                    <ul className="list-disc ml-6 text-blue-100">
                      {validationReport.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-yellow-300">Strengths:</span>
                    <ul className="list-disc ml-6 text-blue-100">
                      {validationReport.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-yellow-300">Risks:</span>
                    <ul className="list-disc ml-6 text-blue-100">
                      {validationReport.risks.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">(Validation reports will appear here.)</div>
              )}
            </div>
          )}
        </div>
        {/* Company Examples Dropdown */}
        <div className="rounded-2xl shadow-lg overflow-hidden mb-2">
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-lg font-bold text-purple-200 bg-[#23284a] hover:bg-purple-900 transition rounded-t-2xl focus:outline-none"
            onClick={() => setOpenExamples((v) => !v)}
            aria-expanded={openExamples}
          >
            <span className="flex items-center gap-2"><Arrow open={openExamples} /><svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M17 8V6a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4h4" /></svg>Company Examples</span>
          </button>
          {openExamples && (
            <div className="border-t border-purple-900 px-6 py-4 bg-[#23284a]">
              {companyExamples && companyExamples.length > 0 ? (
                <ul className="list-disc ml-6 text-blue-100">
                  {companyExamples.map((ex, i) => (
                    <li key={i}>{typeof ex === 'string' ? ex : JSON.stringify(ex)}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400">(Company examples will appear here.)</div>
              )}
            </div>
          )}
        </div>
        {/* Version History Dropdown */}
        <div className="rounded-2xl shadow-lg overflow-hidden mb-2">
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-lg font-bold text-pink-200 bg-[#23284a] hover:bg-pink-900 transition rounded-t-2xl focus:outline-none"
            onClick={() => setOpenVersions((v) => !v)}
            aria-expanded={openVersions}
          >
            <span className="flex items-center gap-2"><Arrow open={openVersions} /><svg className="h-6 w-6 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Version History</span>
          </button>
          {openVersions && (
            <div className="border-t border-pink-900 px-6 py-4 bg-[#23284a]">
              {versions.length === 0 ? (
                <div className="text-gray-400">(No versions saved yet.)</div>
              ) : (
                <ul className="space-y-2 text-blue-100">
                  {versions.map((version) => (
                    <li key={version.version_id} className="flex flex-col gap-1 border-b border-[#23284a] pb-2 mb-2">
                      <span className="text-xs text-gray-400">{new Date(version.timestamp).toLocaleString()}</span>
                      <span className="truncate font-semibold">{version.bmc_data.value_proposition?.slice(0, 80) || "(no value proposition)"}</span>
                      <span className="text-xs text-gray-500">Changes: {version.changes_made?.join(", ")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
          <button onClick={loadData} className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors">Reload</button>
          <Link href="/control-panel" className="w-full md:w-auto underline text-blue-300 hover:text-pink-400 font-semibold text-center">Go to Control Panel</Link>
        </div>
      </div>
    </div>
  );
} 