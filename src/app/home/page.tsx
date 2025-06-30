"use client";
import React, { useEffect, useState } from "react";
import { getIdeasByUserId } from "../../api/idea";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }
    getIdeasByUserId(userId, setError)
      .then((data: any[] | undefined) => {
        if (data) setIdeas(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleIdeaClick = (id: string) => {
    console.log("Clicked idea id:", id);
    localStorage.setItem("IdeaId", id);
    router.push("/bmc");
  };

  const handleAddIdea = () => {
    localStorage.removeItem("IdeaId");
    router.push("/input");
  };

  // IdeaCard component for displaying each idea as a card
  interface IdeaCardProps {
    label: string;
    title: string;
    onClick: () => void;
    bgGradient: string;
  }
  const IdeaCard: React.FC<IdeaCardProps> = ({ label, title, onClick, bgGradient }) => (
    <div
      style={{
        borderRadius: 20,
        background: bgGradient,
        padding: "1.5rem",
        minWidth: 250,
        minHeight: 180,
        boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        transition: "transform 0.15s",
      }}
      onClick={onClick}
      onMouseOver={e => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
    >
      <span style={{
        fontSize: 12,
        fontWeight: 600,
        color: "#fff",
        background: "rgba(0,0,0,0.15)",
        borderRadius: 6,
        padding: "2px 10px",
        alignSelf: "flex-start",
        marginBottom: 10
      }}>{label}</span>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          {title.length > 90 ? title.slice(0, 90) + '...' : title}
        </div>
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-start relative overflow-x-hidden" style={{ background: 'none', padding: 0 }}>
      {/* Animated, interactive background */}
      <div className="fixed inset-0 -z-10 animate-bg-gradient bg-gradient-to-br from-blue-100 via-green-100 to-blue-200" />
      {/* Floating shapes */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-10 left-1/4 w-40 h-40 bg-blue-300 opacity-30 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute bottom-20 right-1/5 w-32 h-32 bg-green-300 opacity-30 rounded-full blur-2xl animate-float-medium" />
        <div className="absolute top-1/2 left-3/4 w-24 h-24 bg-yellow-200 opacity-20 rounded-full blur-2xl animate-float-fast" />
        <div className="absolute bottom-10 left-10 w-28 h-28 bg-pink-200 opacity-20 rounded-full blur-2xl animate-float-medium" />
      </div>
      <div style={{ width: '100%', margin: '0 auto', padding: '2rem 2rem' }} className="w-full">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-4xl font-bold text-blue-700 drop-shadow mb-1">Welcome</h1>
          <p style={{ fontSize: 18, color: '#555', marginTop: 8, marginBottom: 0 }}>Ignite your creativity. Build your future.</p>
        </div>
        <div
          style={{
            width: "100%",
            maxWidth: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32
          }}
        >
          <h1 style={{ fontSize: 28, fontWeight: 400, color: "#222", margin: 0 }}>
            Your Ideas 
          </h1>
        </div>
        {ideas.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", width: "100%", maxWidth: 700 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💡</div>
            <p style={{ fontSize: 18 }}>No ideas found. Start by adding your first idea!</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
              width: "100%",
              maxWidth: 900,
            }}
          >
            {/* Add New Product Card */}
            <div
              onClick={handleAddIdea}
              className="hover:scale-105 active:scale-95 transition-all duration-200"
              style={{
                border: "2px dashed #bbb",
                borderRadius: 20,
                background: "#ffffff",
                minWidth: 250,
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "box-shadow 0.15s, border-color 0.15s",
                boxShadow: "0 4px 24px rgba(0,112,243,0.08)",
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = '#0070f3';
                e.currentTarget.style.boxShadow = '0 4px 32px rgba(0,112,243,0.12)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = '#bbb';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,112,243,0.08)';
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                fontSize: 28,
                color: "#0070f3",
                border: "1.5px solid #e0e0e0"
              }}>+
              </div>
              <div style={{ fontWeight: 600, fontSize: 20, color: "#222", textAlign: "center" }}>
                Add New Idea 💡
              </div>
            </div>
            {/* Idea Cards */}
            {ideas.map((idea, idx) => (
              <IdeaCard
                key={idx}
                label="IDEA"
                title={idea.businessidea}
                onClick={() => handleIdeaClick(idea._id)}
                bgGradient={
                  [
                    "linear-gradient(135deg, #fbeee6 60%, #f7c8a0 100%)",
                    "linear-gradient(135deg, #e6fbe9 60%, #b0eacb 100%)",
                    "linear-gradient(135deg, #f3e6fb 60%, #d1b0ea 100%)",
                    "linear-gradient(135deg, #e6eafb 60%, #b0c3ea 100%)"
                  ][idx % 4]
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
