"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getIdeaById } from "../../api/idea";

interface BmcType {
  [key: string]: any;
}

interface ValidationReport {
  overall_feasibility_score?: number;
  segment_scores?: Record<string, number>;
  suggestions?: string[];
  strengths?: string[];
  risks?: string[];
}

interface SwotType {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface IdeaObjType {
  idea?: string;
  businessidea?: string;
  bmc?: {
    bmc_draft?: BmcType;
    validation_report?: ValidationReport;
    swot_analysis?: SwotType;
  };
}

export default function DashboardPage() {
  const [idea, setIdea] = useState<string>("");
  const [bmc, setBmc] = useState<BmcType | null>(null);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [swot, setSwot] = useState<SwotType>({ strengths: [], weaknesses: [], opportunities: [], threats: [] });
  const [error, setError] = useState<string>("");
  const [ideaObj, setIdeaObj] = useState<IdeaObjType | null>(null);

  // Dropdown open/close state
  const [openIdea, setOpenIdea] = useState(false);
  const [openBmc, setOpenBmc] = useState(false);
  const [openValidation, setOpenValidation] = useState(false);
  const [openSwot, setOpenSwot] = useState(false);

  const loadData = async () => {
    setError("");
    const userId = localStorage.getItem("userId");
    const ideaId = localStorage.getItem("IdeaId");
    if (userId && ideaId) {
      const ideaData = await getIdeaById(userId, ideaId, setError);
      if (ideaData && ideaData.idea) {
        setIdeaObj(ideaData);
        setIdea(ideaData.idea);
        if (ideaData.bmc && ideaData.bmc.bmc && ideaData.bmc.bmc.bmc_components) {
          setBmc(ideaData.bmc.bmc.bmc_components);
        } else {
          setBmc(null);
        }
        setValidationReport(ideaData.bmc?.bmc?.validation_report || null);
        // Set SWOT analysis if available
        const swotData = ideaData.bmc?.bmc?.swot_analysis || {};
        setSwot({
          strengths: swotData.strengths || [],
          weaknesses: swotData.weaknesses || [],
          opportunities: swotData.opportunities || [],
          threats: swotData.threats || [],
        });
      } else {
        setIdeaObj(null);
        setIdea("");
        setBmc(null);
        setValidationReport(null);
        setSwot({ strengths: [], weaknesses: [], opportunities: [], threats: [] });
      }
    } else {
      setIdeaObj(null);
      setIdea("");
      setBmc(null);
      setValidationReport(null);
      setSwot({ strengths: [], weaknesses: [], opportunities: [], threats: [] });
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
    <div className="animate-bg-gradient bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 min-h-screen flex flex-col items-center justify-center relative">
      <Link 
        href="/bmc" 
        className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 active:scale-95 focus:ring-2 focus:ring-green-300 transition-all duration-200 absolute top-4 left-4"
      >
        Back
      </Link>
      <Link 
        href="/control-panel" 
        className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 active:scale-95 focus:ring-2 focus:ring-green-300 transition-all duration-200 absolute top-4 right-4"
      >
        Go to Control Panel
      </Link>
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-12 flex flex-col gap-8 mt-10 mb-10">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 drop-shadow-lg tracking-tight">Result Dashboard</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</div>
        )}
        {/* Business Idea Dropdown */}
        <div className="rounded-2xl shadow-lg overflow-hidden mb-2">
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-lg font-bold text-gray-700 bg-white hover:bg-gray-50 transition rounded-t-2xl focus:outline-none"
            onClick={() => setOpenIdea((v) => !v)}
            aria-expanded={openIdea}
          >
            <span className="flex items-center gap-2"><Arrow open={openIdea} /><svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>Business Idea</span>
          </button>
          {openIdea && (
            <div className="border-t border-gray-200 px-6 py-4 text-gray-700 bg-white whitespace-pre-line">
              {/* {idea || <span className="text-gray-400">No idea submitted yet.</span>} */}
              {ideaObj?.businessidea && (
                <div className="mt-4">
                  {/* <strong>Business Idea (Detailed):</strong> */}
                  <div>{ideaObj.businessidea}</div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* BMC Dropdown */}
        <div className="rounded-2xl shadow-lg overflow-hidden mb-2">
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-lg font-bold text-gray-700 bg-white hover:bg-gray-50 transition rounded-t-2xl focus:outline-none"
            onClick={() => setOpenBmc((v) => !v)}
            aria-expanded={openBmc}
          >
            <span className="flex items-center gap-2"><Arrow open={openBmc} /><svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h4m0 0V7a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4h4" /></svg>Business Model Canvas (BMC) Draft</span>
          </button>
          {openBmc && (
            <div className="border-t border-gray-200 px-6 py-4 bg-white">
              {bmc ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(bmc).map(([key, value]: [string, any]) => (
                    key !== "date" && (
                      <div key={key} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <span className="block font-medium mb-1 capitalize text-gray-700">{key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
                        <div className="min-h-[40px] text-gray-600">
                          {Array.isArray(value)
                            ? value.length > 0
                              ? <ul className="list-disc ml-4">{value.map((v: string, i: number) => <li key={i}>{v}</li>)}</ul>
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
            className="w-full flex items-center justify-between px-6 py-4 text-lg font-bold text-gray-700 bg-white hover:bg-gray-50 transition rounded-t-2xl focus:outline-none"
            onClick={() => setOpenValidation((v) => !v)}
            aria-expanded={openValidation}
          >
            <span className="flex items-center gap-2"><Arrow open={openValidation} /><svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>Validation Reports</span>
          </button>
          {openValidation && (
            <div className="border-t border-gray-200 px-6 py-4 bg-white">
              {validationReport ? (
                <div className="space-y-2">
                  <div><span className="font-semibold text-gray-700">Overall Feasibility Score:</span> <span className="text-gray-600">{validationReport.overall_feasibility_score ?? "-"}</span></div>
                  <div>
                    <span className="font-semibold text-gray-700">Segment Scores:</span>
                    <ul className="list-disc ml-6 text-gray-600">
                      {validationReport.segment_scores && Object.entries(validationReport.segment_scores).map(([seg, score]: [string, number]) => (
                        <li key={seg}><span className="capitalize">{seg.replace(/_/g, " ")}</span>: {score}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Suggestions:</span>
                    <ul className="list-disc ml-6 text-gray-600">
                      {validationReport.suggestions && validationReport.suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Strengths:</span>
                    <ul className="list-disc ml-6 text-gray-600">
                      {validationReport.strengths && validationReport.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Risks:</span>
                    <ul className="list-disc ml-6 text-gray-600">
                      {validationReport.risks && validationReport.risks.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">(Validation reports will appear here.)</div>
              )}
            </div>
          )}
        </div>
        {/* SWOT Analysis Dropdown */}
        <div className="rounded-2xl shadow-lg overflow-hidden mb-2">
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-lg font-bold text-gray-700 bg-white hover:bg-gray-50 transition rounded-t-2xl focus:outline-none"
            onClick={() => setOpenSwot((v) => !v)}
            aria-expanded={openSwot}
          >
            <span className="flex items-center gap-2"><Arrow open={openSwot} /><svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>SWOT Analysis</span>
          </button>
          {openSwot && (
            <div className="border-t border-gray-200 px-6 py-4 bg-white">
              {swot.strengths.length + swot.weaknesses.length + swot.opportunities.length + swot.threats.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <span className="font-semibold text-gray-700">Strengths</span>
                    <ul className="list-disc ml-6 text-gray-600 mt-1">
                      {swot.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Weaknesses</span>
                    <ul className="list-disc ml-6 text-gray-600 mt-1">
                      {swot.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Opportunities</span>
                    <ul className="list-disc ml-6 text-gray-600 mt-1">
                      {swot.opportunities.map((o: string, i: number) => <li key={i}>{o}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Threats</span>
                    <ul className="list-disc ml-6 text-gray-600 mt-1">
                      {swot.threats.map((t: string, i: number) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">(SWOT analysis will appear here if available.)</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 