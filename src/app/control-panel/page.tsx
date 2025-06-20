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
          const bmcDraft = data.bmc.bmc_draft;
          setBmc({
            keyPartners: (bmcDraft.key_partnerships || []).join("\n"),
            keyActivities: (bmcDraft.key_activities || []).join("\n"),
            valuePropositions: bmcDraft.value_proposition || "",
            customerRelationships: (bmcDraft.customer_relationships || []).join("\n"),
            channels: (bmcDraft.channels || []).join("\n"),
            customerSegments: (bmcDraft.customer_segments || []).join("\n"),
            costStructure: (bmcDraft.cost_structures || []).join("\n"),
            revenueStreams: (bmcDraft.revenue_streams || []).join("\n"),
          });

          // Set version history from API
          if (Array.isArray(data.bmc.version_history)) {
            const apiVersions = data.bmc.version_history.map((version: any) => {
              const v = version.bmc_data;
              return {
                keyPartners: (v.key_partnerships || []).join("\n"),
                keyActivities: (v.key_activities || []).join("\n"),
                valuePropositions: v.value_proposition || "",
                customerRelationships: (v.customer_relationships || []).join("\n"),
                channels: (v.channels || []).join("\n"),
                customerSegments: (v.customer_segments || []).join("\n"),
                costStructure: (v.cost_structures || []).join("\n"),
                revenueStreams: (v.revenue_streams || []).join("\n"),
                date: version.timestamp ? new Date(version.timestamp).toLocaleString() : "",
                version_id: version.version_id,
              };
            });
            setVersions(apiVersions);
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
    const ideaId = "68551d72ac3a27e9943e1513";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-800 via-purple-800 to-blue-600">
      <div className="w-full  bg-[#181c2f] rounded-3xl shadow-2xl p-6 md:p-12 flex flex-col gap-8 ">
        <h1 className="text-3xl font-extrabold text-center text-white mb-8 drop-shadow-lg tracking-tight">User Control Panel</h1>
        {loading && <div className="text-white text-center">Loading...</div>}
        {error && <div className="text-red-400 text-center mb-4">{error}</div>}
        <div className="mb-8">
          <h2 className="font-semibold text-blue-200 mb-4 text-lg">Edit BMC</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(bmc).filter(([key]) => key !== "date").map(([key, value]) => (
              <div key={key}>
                <label className="block font-medium mb-2 capitalize text-blue-100 tracking-wide">{key.replace(/([A-Z])/g, " $1").trim()}</label>
                <textarea
                  className="bg-[#23284a] border-none rounded-lg p-3 w-full min-h-[150px] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow"
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
              className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors"
              onClick={saveVersion}
              type="button"
            >
              Save as New Version
            </button>
            <button
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors"
              onClick={resetBmc}
              type="button"
            >
              Reset BMC
            </button>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="font-semibold text-purple-200 mb-4 text-lg">Manage Versions</h2>
          {versions.length === 0 ? (
            <div className="text-blue-100">No versions saved yet.</div>
          ) : (
            <ul className="space-y-3">
              {versions.map((version, idx) => (
                <li key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-[#23284a] rounded-lg p-3 shadow">
                  <button
                    className="underline text-blue-300 hover:text-pink-400 font-semibold text-left"
                    onClick={() => loadVersion(version)}
                    type="button"
                  >
                    Load version from {version.date}
                  </button>
                  <button
                    className="text-xs text-red-400 hover:underline ml-0 sm:ml-4"
                    onClick={() => deleteVersion(idx)}
                    type="button"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link href="/dashboard" className="w-full md:w-auto underline text-blue-300 hover:text-pink-400 font-semibold text-center">Back to Dashboard</Link>
      </div>
    </div>
  );
} 