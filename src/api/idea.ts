export type IdeaData = {
  userId: string;
  idea: string;
  businessidea: string;
};

export const handleIdeaSubmit = async (
  e: React.FormEvent,
  ideaData: IdeaData,
  setError: (msg: string) => void
) => {
  e.preventDefault();
  setError("");
  if (!ideaData.userId || !ideaData.idea || !ideaData.businessidea) {
    setError("Please fill in all fields.");
    return;
  }
  try {
    const res = await fetch("http://localhost:3002/api/business-ideas/idea", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ideaData),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Idea submission failed");
    } else {
      // Store the returned id in localStorage
      if (data.id) {
        localStorage.setItem("IdeaId", data.id);
      }
      return data.id; // Optionally return the id
    }
  } catch (err) {
    setError("Network error");
  }
};

export const getIdeaById = async (
  userId: string,
  ideaId: string,
  setError: (msg: string) => void
) => {
  setError("");
  if (!userId || !ideaId) {
    setError("User ID and Idea ID are required.");
    return;
  }
  try {
    const res = await fetch(`http://localhost:3002/api/business-ideas/${userId}/${ideaId}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Failed to fetch idea data");
    } else {
      return data;
    }
  } catch (err) {
    setError("Network error");
  }
};


export const updateVersionHistory = async (
  ideaId: string,
  version_history: any,
  setError: (msg: string) => void
) => {
  setError("");
  if (!ideaId || !version_history) {
    setError("Idea ID and version history are required.");
    return;
  }
  try {
    const res = await fetch(`http://localhost:3002/api/business-ideas/${ideaId}/version-history`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version_history }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to update version history");
    } else {
      return data.version_history;
    }
  } catch (err) {
    setError("Network error");
  }
};

export const getIdeasByUserId = async (
  userId: string,
  setError: (msg: string) => void
) => {
  setError("");
  if (!userId) {
    setError("User ID is required.");
    return;
  }
  try {
    const res = await fetch(`http://localhost:3002/api/business-ideas/${userId}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Failed to fetch ideas");
    } else {
      return data;
    }
  } catch (err) {
    setError("Network error");
  }
};