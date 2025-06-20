export type LoginData = {
  email: string;
  password: string;
};

export type SignupData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const handleLogin = async (
  e: React.FormEvent,
  loginData: LoginData,
  setError: (msg: string) => void
) => {
  e.preventDefault();
  setError("");
  if (!loginData.email || !loginData.password) {
    setError("Please fill in all fields.");
    return;
  }
  try {
    const res = await fetch("http://localhost:3002/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Login failed");
    } else {
      // handle success (e.g., save token, redirect)
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
      }
      // alert("Logged in!");
      return true;
    }
  } catch (err) {
    setError("Network error");
  }
};

export const handleSignup = async (
  e: React.FormEvent,
  signupData: SignupData,
  setError: (msg: string) => void
) => {
  e.preventDefault();
  setError("");
  if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
    setError("Please fill in all fields.");
    return;
  }
  if (signupData.password !== signupData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }
  try {
    const res = await fetch("http://localhost:3002/api/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Signup failed");
    } else {
      // handle success (e.g., save token, redirect)
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
      }
      alert("Signed up!");
    }
  } catch (err) {
    setError("Network error");
  }
};
