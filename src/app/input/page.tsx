"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleIdeaSubmit } from "../../api/idea";

export default function InputPage() {
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const maxChars = 500;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const userId = localStorage.getItem("userId") || "";
    const result = await handleIdeaSubmit(
      e,
      { userId, idea },
      setError
    );
    setLoading(false);
    if (result === true) {
      setSubmitted(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      router.push("/bmc");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative w-full max-w-xl p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">Share Your Business Idea</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="idea" className="font-semibold text-gray-700">Business Idea</label>
          <textarea
            id="idea"
            className="border border-gray-300 rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Describe your business idea..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            maxLength={maxChars}
            required
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{idea.length} / {maxChars} characters</span>
            {idea.length === maxChars && <span className="text-red-500">Max reached</span>}
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className={`self-end flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed`}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            ) : (
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            )}
            {loading ? "Submitting..." : "Submit Idea"}
          </button>
        </form>
        {submitted && (
          <div className="mt-6 text-center">
            <span className="text-green-600 font-semibold">Idea submitted!</span>
            <br />
            <Link href="/dashboard" className="underline text-blue-600 hover:text-blue-800">Go to Dashboard</Link>
          </div>
        )}
        {showToast && (
          <div className="fixed left-1/2 top-8 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded shadow-lg animate-fade-in">
            Idea submitted!
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease;
        }
      `}</style>
    </div>
  );
} 