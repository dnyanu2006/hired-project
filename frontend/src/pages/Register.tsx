import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok) {
        addToast("Registration successful, please login", "success");
        navigate("/login");
      } else {
        addToast(data.error || "Registration failed", "error");
      }
    } catch (e) {
      addToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100">
        <h2 className="text-3xl font-black text-center text-slate-900 tracking-tighter mb-8">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Full Name</label>
            <input 
              type="text" required
              className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl font-bold text-slate-900 ring-0 focus:ring-2 focus:ring-indigo-500 transition-shadow"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Email</label>
            <input 
              type="email" required
              className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl font-bold text-slate-900 ring-0 focus:ring-2 focus:ring-indigo-500 transition-shadow"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Password</label>
            <input 
              type="password" required minLength={6}
              className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl font-bold text-slate-900 ring-0 focus:ring-2 focus:ring-indigo-500 transition-shadow"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">I am a...</label>
            <select 
              className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl font-bold text-slate-900 ring-0 focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none"
              value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="user">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:bg-indigo-400 disabled:scale-100 mt-6"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 font-bold">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-700 italic tracking-tight ml-1">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
