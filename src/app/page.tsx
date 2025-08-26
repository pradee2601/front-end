'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Define BMC type
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
}



export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/login');
  }, [router]);

  const [idea, setIdea] = useState("");
  const [bmc, setBmc] = useState<BmcType>({
    keyPartners: "",
    keyActivities: "",
    valuePropositions: "",
    customerRelationships: "",
    channels: "",
    customerSegments: "",
    costStructure: "",
    revenueStreams: "",
  });
  const [versions, setVersions] = useState<BmcType[]>([]);
  const [editing, setEditing] = useState(false);

  const handleIdeaSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditing(true);
    // Optionally, generate a BMC draft from the idea here
  };

  const handleBmcChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBmc({ ...bmc, [e.target.name]: e.target.value });
  };

  const saveVersion = () => {
    setVersions([
      { ...bmc, date: new Date().toLocaleString() },
      ...versions,
    ]);
    setEditing(false);
  };

  const loadVersion = (version: BmcType) => {
    setBmc(version);
    setEditing(false);
  };

  return (
    <div className=" mx-auto p-6 space-y-10">
      {/* 1. Business Idea Input */}
      <section className="bg-white dark:bg-gray-900 rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">Business Idea Input</h2>
        <form onSubmit={handleIdeaSubmit} className="flex flex-col gap-4">
          <textarea
            className="border rounded p-2 min-h-[80px]"
            placeholder="Describe your business idea..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            required
          />
          <button
            type="submit"
            className="self-end bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Idea
          </button>
        </form>
      </section>

      {/* 2. Result Dashboard */}
      <section className="bg-white dark:bg-gray-900 rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">Result Dashboard</h2>
        {/* BMC Draft */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Business Model Canvas (BMC) Draft</h3>
          {editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(bmc).map(([key, value]) => (
                key !== "date" && (
                  <div key={key}>
                    <label className="block font-medium mb-1 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <textarea
                      className="border rounded p-2 w-full min-h-[40px]"
                      name={key}
                      value={value as string}
                      onChange={handleBmcChange}
                    />
                  </div>
                )
              ))}
              <button
                className="col-span-1 sm:col-span-2 bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700"
                onClick={saveVersion}
                type="button"
              >
                Save BMC Version
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(bmc).map(([key, value]) => (
                key !== "date" && (
                  <div key={key}>
                    <span className="block font-medium mb-1 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div className="border rounded p-2 min-h-[40px] bg-gray-50 dark:bg-gray-800">
                      {value || <span className="text-gray-400">(empty)</span>}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
        {/* Validation Reports */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Validation Reports</h3>
          <div className="text-gray-500">(Validation reports will appear here.)</div>
        </div>
        {/* Company Examples */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Company Examples</h3>
          <div className="text-gray-500">(Company examples will appear here.)</div>
        </div>
        {/* Version History */}
        <div>
          <h3 className="font-semibold mb-2">Version History</h3>
          {versions.length === 0 ? (
            <div className="text-gray-500">No versions saved yet.</div>
          ) : (
            <ul className="space-y-2">
              {versions.map((version, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <button
                    className="underline text-blue-600 hover:text-blue-800"
                    onClick={() => loadVersion(version)}
                  >
                    Load version from {version.date}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 3. User Control Panel */}
      <section className="bg-white dark:bg-gray-900 rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">User Control Panel</h2>
        <div className="flex gap-4">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            onClick={() => setEditing(true)}
            disabled={editing}
          >
            Edit BMC
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => {
              setBmc({
                keyPartners: "",
                keyActivities: "",
                valuePropositions: "",
                customerRelationships: "",
                channels: "",
                customerSegments: "",
                costStructure: "",
                revenueStreams: "",
              });
              setEditing(false);
            }}
          >
            Reset BMC
          </button>
        </div>
      </section>
    </div>
  );
}
