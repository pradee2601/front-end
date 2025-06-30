"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogin as apiHandleLogin, handleSignup as apiHandleSignup } from "../../api/user";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = await apiHandleLogin(e, loginData, setError);
      if (result === true) {
        router.push("/home");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    const result = await apiHandleSignup(e, signupData, setError);
    if (result === true) {
      router.push("/home");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden">
      {/* Animated, interactive background */}
      <div className="fixed inset-0 -z-10 animate-bg-gradient bg-gradient-to-br from-blue-100 via-green-100 to-blue-200" />
      {/* Floating shapes */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-10 left-1/4 w-40 h-40 bg-blue-300 opacity-30 rounded-full blur-2xl animate-float-slow" />
        <div className="absolute bottom-20 right-1/5 w-32 h-32 bg-green-300 opacity-30 rounded-full blur-2xl animate-float-medium" />
        <div className="absolute top-1/2 left-3/4 w-24 h-24 bg-yellow-200 opacity-20 rounded-full blur-2xl animate-float-fast" />
        <div className="absolute bottom-10 left-10 w-28 h-28 bg-pink-200 opacity-20 rounded-full blur-2xl animate-float-medium" />
      </div>
      <div className="w-full max-w-6xl h-[600px] bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left: Welcome Section */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-center relative">
          <div className="relative z-10 flex flex-col items-center text-center px-10">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4 drop-shadow-lg">Welcome.</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xs">Welcome to Agentic AI Generator for Founder-Centric Business Model Canvas (BMC). Enter your credentials to access your account or sign up to get started!</p>
          </div>
        </div>
        {/* Vertical Divider */}
        <div className="hidden md:block w-0.5 bg-gray-400 h-4/5 self-center" />
        {/* Right: Login/Signup Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-10 py-12 relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full border-2 border-blue-400 flex items-center justify-center mb-4">
              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-blue-400"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
            </div>
            <div className="w-full mb-6 border-b border-gray-200">
              <button
                className={`flex-1 py-2 text-lg font-semibold transition-colors ${tab === "login" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-400"}`}
                onClick={() => { setTab("login"); setError(""); }}
              >
                Login
              </button>
              <button
                className={`flex-1 py-2 px-4 text-lg font-semibold transition-colors ${tab === "signup" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-400"}`}
                onClick={() => { setTab("signup"); setError(""); }}
              >
                Sign Up
              </button>
            </div>
          </div>
          {error && <div className="mb-4 text-red-500 text-sm text-center w-full">{error}</div>}
          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5 w-full">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 pl-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="Username"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/><path d="M12 16c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4Z"/></svg>
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 pl-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="Password"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="12" x="3" y="8" rx="6"/><circle cx="12" cy="14" r="2"/></svg>
                </span>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-green-400 text-white py-3 rounded-lg font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
              >
                LOGIN
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5 w-full">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 pl-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="Name"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
                </span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 pl-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="Email"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/><path d="M12 16c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4Z"/></svg>
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 pl-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="Password"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="12" x="3" y="8" rx="6"/><circle cx="12" cy="14" r="2"/></svg>
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-3 pl-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="Confirm Password"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="12" x="3" y="8" rx="6"/><circle cx="12" cy="14" r="2"/></svg>
                </span>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-green-400 text-white py-3 rounded-lg font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
              >
                SIGN UP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
