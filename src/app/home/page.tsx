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
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 700 }}>
          {ideas.map((idea, idx) => (
            <div
              key={idx}
              style={{
                padding: "1rem 1.25rem",
                borderRadius: 10,
                background: "#f1f5fb",
                cursor: "pointer",
                border: "1px solid",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                color: "#222",
                fontSize: 18,
                fontWeight: 500,
                transition: "background 0.2s"
              }}
              onClick={() => handleIdeaClick(idea._id)}
              onMouseOver={e => {
                e.currentTarget.style.background = '#e0e7ef';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#f1f5fb';
              }}
            >
              {idea.idea}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
