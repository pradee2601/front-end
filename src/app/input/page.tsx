"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleIdeaSubmit } from "../../api/idea";

const questionIcons = [
  "💡", // Idea
  "🎯", // Target market
  "🧩", // Problem/Solution
  "🌟"  // Unique
];

export default function InputPage() {
  const [formData, setFormData] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const maxChars = 500;
  const router = useRouter();
  const confettiRef = useRef<HTMLDivElement>(null);

  const questions = [
    {
      id: "question1",
      label: "What is your business idea?",
      placeholder: "Describe your main business concept..."
    },
    {
      id: "question2", 
      label: "Who is your target market?",
      placeholder: "Describe your ideal customers..."
    },
    {
      id: "question3",
      label: "What problem does your idea solve?",
      placeholder: "Explain the problem and your solution..."
    },
    {
      id: "question4",
      label: "What makes your idea unique?",
      placeholder: "Describe your competitive advantage..."
    }
  ];

  const handleInputChange = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const userId = localStorage.getItem("userId") || "";
    const businessidea = formData.question1;
    const idea = Object.values(formData).join("\n\n");
    const result = await handleIdeaSubmit(
      e,
      { userId, idea, businessidea },
      setError
    );
    setLoading(false);
    if (result) {
      setSubmitted(true);
      setShowToast(true);
      setShowConfetti(true);
      setTimeout(() => setShowToast(false), 2000);
      setTimeout(() => setShowConfetti(false), 2500);
      setTimeout(() => router.push("/bmc"), 2500);
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const currentValue = formData[currentQuestionData.id as keyof typeof formData];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-x-hidden">
      {/* Back Button */}
      <Link href="/home" className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white text-blue-700 rounded-lg shadow font-semibold transition-all duration-200 backdrop-blur border border-blue-100">
        <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back
      </Link>
      {/* Animated, interactive background */}
      <div className="fixed inset-0 -z-10 animate-bg-gradient bg-gradient-to-br from-blue-100 via-green-100 to-blue-200" />
      {/* Floating shapes */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-10 left-1/4 w-40 h-40 bg-blue-300 opacity-30 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute bottom-20 right-1/5 w-32 h-32 bg-green-300 opacity-30 rounded-full blur-2xl animate-float-medium" />
        <div className="absolute top-1/2 left-3/4 w-24 h-24 bg-yellow-200 opacity-20 rounded-full blur-2xl animate-float-fast" />
        <div className="absolute bottom-10 left-10 w-28 h-28 bg-pink-200 opacity-20 rounded-full blur-2xl animate-float-medium" />
      </div>
      {/* Confetti Animation */}
      {showConfetti && (
        <div ref={confettiRef} className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 animate-confetti" />
        </div>
      )}
      <div className="relative w-full max-w-xl p-2 sm:p-4 md:p-6 lg:p-8">
        {/* Animated Progress Bar */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-6 shadow">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="relative bg-white rounded-2xl shadow-xl p-3 sm:p-6 md:p-8 lg:p-10 transition-all duration-500">
          <div className="mb-6 flex flex-col items-center">
            <span className="text-5xl mb-2 animate-bounce-slow">{questionIcons[currentQuestion]}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-center text-blue-700">
              {currentQuestionData.label}
            </h1>
            <p className="text-center text-gray-600 text-sm sm:text-base">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              id={currentQuestionData.id}
              className="border border-gray-300 rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition text-gray-700 text-base shadow-sm bg-gradient-to-br from-white to-blue-50 animate-fade-in"
              placeholder={currentQuestionData.placeholder}
              value={currentValue}
              onChange={(e) => handleInputChange(currentQuestionData.id, e.target.value)}
              maxLength={maxChars}
              required
              autoFocus
            />
            <div className="flex justify-between text-sm text-gray-500 font-medium">
              <span className={`transition-all duration-300 ${currentValue.length > maxChars * 0.8 ? 'text-orange-500 font-bold scale-110' : ''}`}>{currentValue.length} / {maxChars} characters</span>
              {currentValue.length === maxChars && <span className="text-red-500 animate-pulse">Max reached</span>}
            </div>
            {error && <div className="text-red-500 text-sm animate-shake">{error}</div>}
            <div className="flex justify-between mt-4 gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-300 ${
                  currentQuestion === 0 
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                    : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                }`}
                disabled={currentQuestion === 0}
              >
                ← Previous
                
              </button>
              {currentQuestion < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 active:scale-95 focus:ring-2 focus:ring-green-300 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={!currentValue.trim()}
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className={`flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-400 text-white px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 active:scale-95 focus:ring-2 focus:ring-green-300 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed`}
                  disabled={loading || !currentValue.trim()}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                  ) : (
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  )}
                  {loading ? "Submitting..." : "Submit All Answers"}
                </button>
              )}
            </div>
          </form>
          {submitted && (
            <div className="mt-6 text-center">
              <span className="text-green-600 font-semibold text-lg flex items-center justify-center gap-2"><svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>All answers submitted!</span>
              <br />
              <Link href="/dashboard" className="underline text-blue-600 hover:text-blue-800">Go to Dashboard</Link>
            </div>
          )}
          {showToast && (
            <div className="fixed left-1/2 top-8 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded shadow-lg">
              All answers submitted!
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s;
        }
        @keyframes confetti {
          0% { opacity: 1; }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
        }
        .animate-confetti::before, .animate-confetti::after {
          content: '';
          position: absolute;
          width: 100vw;
          height: 100vh;
          left: 0;
          top: 0;
          pointer-events: none;
          background-image: 
            repeating-linear-gradient(120deg, #34d399 0 8px, transparent 8px 16px),
            repeating-linear-gradient(60deg, #60a5fa 0 8px, transparent 8px 16px),
            repeating-linear-gradient(90deg, #fbbf24 0 8px, transparent 8px 16px),
            repeating-linear-gradient(150deg, #f472b6 0 8px, transparent 8px 16px);
          background-size: 100vw 100vh;
          opacity: 0.7;
          animation: confetti 1.5s linear;
        }
        @keyframes bg-gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-bg-gradient {
          background-size: 200% 200%;
          animation: bg-gradient 10s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(20px) scale(0.97); }
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.1); }
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 