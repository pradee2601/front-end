"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getIdeaById, updateVersionHistory } from "../../api/idea"; // Adjust the import path if needed

interface BmcType {
  keyPartners: string;
  keyActivities: string;
  valuePropositions: string;
  customerRelationships: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
  date?: string;
  version_id?: string;
}

const emptyBmc: BmcType = {
  keyPartners: "",
  keyActivities: "",
  valuePropositions: "",
  customerRelationships: "",
  channels: "",
  customerSegments: "",
  costStructure: "",
  revenueStreams: "",
};

export default function ControlPanelPage() {
  const [bmc, setBmc] = useState<BmcType>(emptyBmc);
  const [versions, setVersions] = useState<BmcType[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Replace these with your actual logic to get userId and ideaId
  

  useEffect(() => {
    // Fetch BMC data from API
    const userId = localStorage.getItem("userId");
    const ideaId = localStorage.getItem('IdeaId');
    if (!userId || !ideaId) {
      setError("User ID or Idea ID not found. Please log in again.");
      setLoading(false);
      return;
    }
    getIdeaById(userId, ideaId, setError)
      .then((data: any) => {
        if (data && data.bmc) {
          // Set current BMC
          const bmcDraft = data.bmc.bmc.bmc_components;
          setBmc({
            keyPartners: (bmcDraft.key_partnerships || []).join("\n"),
            keyActivities: (bmcDraft.key_activities || []).join("\n"),
            valuePropositions: bmcDraft.value_proposition || "",
            customerRelationships: (bmcDraft.customer_relationships || []).join("\n"),
            channels: (bmcDraft.channels || []).join("\n"),
            customerSegments: (bmcDraft.customer_segments || []).join("\n"),
            costStructure: (bmcDraft.cost_structure || []).join("\n"),
            revenueStreams: (bmcDraft.revenue_streams || []).join("\n"),
          });

          // Set version history from API (updated for new backend structure)
          if (data.bmc.version_history && Array.isArray(data.bmc.version_history)) {
            const apiVersions = data.bmc.version_history.map((version: any) => {
              const v = version.bmc;
              return {
                keyPartners: (v.key_partnerships || []).join("\n"),
                keyActivities: (v.key_activities || []).join("\n"),
                valuePropositions: Array.isArray(v.value_proposition) ? v.value_proposition.join("\n") : (v.value_proposition || ""),
                customerRelationships: (v.customer_relationships || []).join("\n"),
                channels: (v.channels || []).join("\n"),
                customerSegments: (v.customer_segments || []).join("\n"),
                costStructure: (v.cost_structure || v.cost_structures || []).join("\n"),
                revenueStreams: (v.revenue_streams || []).join("\n"),
                date: version.timestamp ? new Date(version.timestamp).toLocaleString() : "",
                version_id: version.version_id,
              };
            });
            setVersions(apiVersions);
          } else {
            // If no version history, just set the current version as the only version
            setVersions([
              {
                keyPartners: (bmcDraft.key_partnerships || []).join("\n"),
                keyActivities: (bmcDraft.key_activities || []).join("\n"),
                valuePropositions: Array.isArray(bmcDraft.value_proposition) ? bmcDraft.value_proposition.join("\n") : (bmcDraft.value_proposition || ""),
                customerRelationships: (bmcDraft.customer_relationships || []).join("\n"),
                channels: (bmcDraft.channels || []).join("\n"),
                customerSegments: (bmcDraft.customer_segments || []).join("\n"),
                costStructure: (bmcDraft.cost_structure || bmcDraft.cost_structures || []).join("\n"),
                revenueStreams: (bmcDraft.revenue_streams || []).join("\n"),
                date: data.bmc.updatedAt ? new Date(data.bmc.updatedAt).toLocaleString() : "",
                version_id: data.bmc.version_id,
              },
            ]);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleBmcChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBmc({ ...bmc, [e.target.name]: e.target.value });
  };

  const saveVersion = async () => {
    const userId = localStorage.getItem("userId");
    const ideaId = localStorage.getItem("ideaId");
    if (!userId || !ideaId) {
      setError("User ID or Idea ID missing.");
      return;
    }

    // Determine the next version number and parent_version_id
    let lastVersionNumber = 1;
    let parent_version_id = undefined;
    if (versions.length > 0) {
      const lastId = versions[0].version_id || "";
      const match = lastId.match(/^v(\d+)_/);
      if (match) {
        lastVersionNumber = parseInt(match[1], 10) + 1;
        parent_version_id = lastId;
      }
    }

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const version_id = parent_version_id;
    const timestamp = now.toISOString();

    // Convert BMC fields back to arrays for the backend
    const bmc_data = {
      key_partnerships: bmc.keyPartners.split("\n").filter(Boolean),
      key_activities: bmc.keyActivities.split("\n").filter(Boolean),
      value_proposition: bmc.valuePropositions,
      customer_relationships: bmc.customerRelationships.split("\n").filter(Boolean),
      channels: bmc.channels.split("\n").filter(Boolean),
      customer_segments: bmc.customerSegments.split("\n").filter(Boolean),
      cost_structures: bmc.costStructure.split("\n").filter(Boolean),
      revenue_streams: bmc.revenueStreams.split("\n").filter(Boolean),
    };

    // Prepare the version object
    const versionObj = {
      version_id,
      parent_version_id, // for chaining
      timestamp,
      bmc_data,
      validation_report: {}, // Fill with real data if available
      changes_made: [] // Fill with real data if available
    };

    // Prepare the payload in your required format
    const payload = {
      version_id,
      state: {
        version_history: [versionObj]
      }
    };

    setLoading(true);
    setError("");
    try {
      await updateVersionHistory(ideaId, payload, setError);
      setVersions([{ ...bmc, date: now.toLocaleString(), version_id }, ...versions]);
      localStorage.setItem("bmc", JSON.stringify(bmc));
      localStorage.setItem("bmcVersions", JSON.stringify([{ ...bmc, date: now.toLocaleString(), version_id }, ...versions]));
    } catch (err) {
      setError("Failed to update version history.");
    } finally {
      setLoading(false);
    }
  };

  const loadVersion = (version: BmcType) => {
    setBmc(version);
    localStorage.setItem("bmc", JSON.stringify(version));
  };

  const deleteVersion = (idx: number) => {
    const newVersions = versions.filter((_, i) => i !== idx);
    setVersions(newVersions);
    localStorage.setItem("bmcVersions", JSON.stringify(newVersions));
  };

  const resetBmc = () => {
    setBmc(emptyBmc);
    localStorage.setItem("bmc", JSON.stringify(emptyBmc));
  };

  return (
    <div className="min-h-screen flex flex-col items-start relative overflow-x-hidden">
      {/* Animated, interactive background */}
      <div className="fixed inset-0 -z-10 animate-bg-gradient bg-gradient-to-br from-blue-100 via-green-100 to-blue-200" />
      {/* Floating shapes */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-10 left-1/4 w-40 h-40 bg-blue-300 opacity-30 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute bottom-20 right-1/5 w-32 h-32 bg-green-300 opacity-30 rounded-full blur-2xl animate-float-medium" />
        <div className="absolute top-1/2 left-3/4 w-24 h-24 bg-yellow-200 opacity-20 rounded-full blur-2xl animate-float-fast" />
        <div className="absolute bottom-10 left-10 w-28 h-28 bg-pink-200 opacity-20 rounded-full blur-2xl animate-float-medium" />
      </div>
      <div className="w-full p-6 md:p-12">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-4xl font-bold text-blue-700 drop-shadow mb-1">Control Panel</h1>
          <p className="text-lg text-gray-600">Manage your business model canvas versions</p>
        </div>
        
        <div className="w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
          {loading && <div className="text-gray-600 text-center">Loading...</div>}
          {error && <div className="text-red-500 text-center mb-4 p-3 bg-red-50 rounded-lg">{error}</div>}
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit BMC</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.entries(bmc).filter(([key]) => key !== "date").map(([key, value]) => (
                <div key={key} className="bg-white/80 rounded-xl shadow-md p-4">
                  <label className="block font-medium mb-2 capitalize text-gray-700 tracking-wide">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <textarea
                    className="w-full min-h-[150px] bg-white border border-gray-200 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    name={key}
                    value={value}
                    onChange={handleBmcChange}
                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                onClick={saveVersion}
                type="button"
              >
                Save as New Version
              </button>
              <button
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                onClick={resetBmc}
                type="button"
              >
                Reset BMC
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Versions</h2>
            {versions.length === 0 ? (
              <div className="text-gray-600 bg-gray-50 rounded-lg p-4">No versions saved yet.</div>
            ) : (
              <div className="space-y-3">
                {versions.map((version, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:shadow-lg transition-shadow">
                    <button
                      className="text-blue-600 hover:text-green-500 font-medium transition-colors"
                      onClick={() => loadVersion(version)}
                      type="button"
                    >
                      Load version from {version.date}
                    </button>
                    <button
                      className="text-sm text-red-500 hover:text-red-600 hover:underline transition-colors"
                      onClick={() => deleteVersion(idx)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link 
            href="/dashboard" 
            className="inline-block bg-gradient-to-r from-blue-500 to-green-400 text-white px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 