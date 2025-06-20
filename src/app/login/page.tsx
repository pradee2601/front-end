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
        router.push("/input");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    apiHandleSignup(e, signupData, setError);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-800 via-purple-800 to-blue-600">
      <div className="w-full max-w-6xl h-[600px] bg-[#181c2f] rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left: Login/Signup Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-10 py-12 relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full border-2 border-blue-400 flex items-center justify-center mb-4">
              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-blue-400"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
            </div>
            <div className="flex w-full mb-6 border-b border-gray-700">
              <button
                className={`flex-1 py-2 text-lg font-semibold transition-colors ${tab === "login" ? "border-b-2 border-pink-500 text-pink-400" : "text-gray-400"}`}
                onClick={() => { setTab("login"); setError(""); }}
              >
                Login
              </button>
              <button
                className={`flex-1 py-2 px-4 text-lg font-semibold transition-colors ${tab === "signup" ? "border-b-2 border-pink-500 text-pink-400" : "text-gray-400"}`}
                onClick={() => { setTab("signup"); setError(""); }}
              >
                Sign Up
              </button>
            </div>
          </div>
          {error && <div className="mb-4 text-pink-400 text-sm text-center w-full">{error}</div>}
          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5 w-full">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full bg-[#23284a] border-none rounded-lg px-4 py-3 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
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
                  className="w-full bg-[#23284a] border-none rounded-lg px-4 py-3 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="Password"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="12" x="3" y="8" rx="6"/><circle cx="12" cy="14" r="2"/></svg>
                </span>
              </div>
              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg transition-colors"
              >
                LOGIN
              </button>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <label className="flex items-center gap-1">
                  <input type="checkbox" className="accent-pink-500" /> Remember me
                </label>
                <a href="#" className="hover:underline text-pink-400">Forgot your password?</a>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5 w-full">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  className="w-full bg-[#23284a] border-none rounded-lg px-4 py-3 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
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
                  className="w-full bg-[#23284a] border-none rounded-lg px-4 py-3 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
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
                  className="w-full bg-[#23284a] border-none rounded-lg px-4 py-3 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
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
                  className="w-full bg-[#23284a] border-none rounded-lg px-4 py-3 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="Confirm Password"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="12" x="3" y="8" rx="6"/><circle cx="12" cy="14" r="2"/></svg>
                </span>
              </div>
              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg transition-colors"
              >
                SIGN UP
              </button>
            </form>
          )}
        </div>
        {/* Right: Welcome Section */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-gradient-to-br from-blue-900 via-purple-900 to-blue-700 relative">
          {/* Abstract swirl background effect */}
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
              <defs>
                <radialGradient id="swirl" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#7f5af0" />
                  <stop offset="100%" stopColor="#23284a" />
                </radialGradient>
              </defs>
              <ellipse cx="200" cy="200" rx="160" ry="80" fill="url(#swirl)"/>
              <ellipse cx="200" cy="220" rx="120" ry="60" fill="#5f4bb6" fillOpacity="0.3"/>
              <ellipse cx="200" cy="180" rx="100" ry="40" fill="#7f5af0" fillOpacity="0.2"/>
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center px-10">
            <h1 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg">Welcome.</h1>
            <p className="text-lg text-blue-100 mb-8 max-w-xs">Welcome to Agentic AI Generator for Founder-Centric Business Model Canvas (BMC). Enter your credentials to access your account or sign up to get started!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
