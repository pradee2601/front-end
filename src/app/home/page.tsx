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
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{title}</div>
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#f7f8fa",
        padding: "2rem 1rem"
      }}
    >
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
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#222", margin: 0 }}>
          Your Ideas
        </h1>
        <button
          onClick={handleAddIdea}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 18,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#0059c1')}
          onMouseOut={e => (e.currentTarget.style.background = '#0070f3')}
        >
          + Add Idea
        </button>
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
  );
};

export default HomePage;
