import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { Briefcase, LogOut } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
  logout();           // IMPORTANT (context logout)
  navigate("/login");
};
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 text-indigo-600 hover:opacity-80 transition-opacity">
              <Briefcase className="h-6 w-6" strokeWidth={2.5} />
              <span className="font-black text-2xl tracking-tighter italic">Hired.</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-slate-500 font-bold hidden sm:block tracking-tight text-sm">Hello, {user.name}</span>
                {user.role === 'admin' && <Link to="/admin" className="text-slate-500 hover:text-slate-900 font-bold transition-colors">Dashboard</Link>}
                {user.role === 'recruiter' && <Link to="/recruiter" className="text-slate-500 hover:text-slate-900 font-bold transition-colors">Dashboard</Link>}
                {user.role === 'user' && <Link to="/jobs" className="text-slate-500 hover:text-slate-900 font-bold transition-colors">Find Jobs</Link>}
                {user.role === 'user' && <Link to="/applications" className="text-slate-500 hover:text-slate-900 font-bold transition-colors">My Applications</Link>}
                
                <button onClick={handleLogout} className="text-slate-400 hover:text-rose-600 flex items-center gap-1 font-bold transition-colors ml-2">
                  <LogOut size={18} strokeWidth={2.5} />
                  <span className="hidden sm:inline uppercase text-[10px] tracking-widest mt-0.5">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-500 hover:text-slate-900 font-bold transition-colors">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all">Sign up</Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-rose-600 flex items-center gap-1 font-bold transition-colors ml-2">
                  <LogOut size={18} strokeWidth={2.5} />
                  <span className="hidden sm:inline uppercase text-[10px] tracking-widest mt-0.5">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
