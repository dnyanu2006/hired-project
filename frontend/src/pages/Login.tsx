import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import axios from "axios";
export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  const { addToast } = useToast();
  const navigate = useNavigate();
console.log("EMAIL:", email);
console.log("PASSWORD:", password);

const handleLogin = async () => {
  const res = await axios.post("https://hired-project.onrender.com/api/auth/login", {
    email,
    password
  });
  login(res.data.user, res.data.token);
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://hired-project.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.user, data.token);
        addToast("Logged in successfully", "success");
        if (data.user.role === "admin") navigate("/admin");
        else if (data.user.role === "recruiter") navigate("/recruiter");
        else navigate("/jobs");
      } else {
        addToast(data.error || "Login failed", "error");
      }
    } catch (e) {
      addToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100">
        <h2 className="text-3xl font-black text-center text-slate-900 tracking-tighter mb-8">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Email</label>
            <input 
              type="email" required
              className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl font-bold text-slate-900 ring-0 focus:ring-2 focus:ring-indigo-500 transition-shadow"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Password</label>
            <input 
              type="password" required
              className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl font-bold text-slate-900 ring-0 focus:ring-2 focus:ring-indigo-500 transition-shadow"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:bg-indigo-400 disabled:scale-100 mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 font-bold">
          Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-700 italic tracking-tight ml-1">Register</Link>
        </p>
      </div>
    </div>
  );
}
