import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { useToast } from "../context/ToastContext.tsx";

export function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [view, setView] = useState<"stats" | "users">("stats");
  const { token } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` }});
        if (res.ok) setStats(await res.json());
      } catch (e) {
        console.error(e);
      }
    };
    if (view === "stats") fetchStats();
  }, [view, token]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` }});
        if (res.ok) setUsers(await res.json());
      } catch (e) {
        console.error(e);
      }
    };
    if (view === "users") fetchUsers();
  }, [view, token]);

  const toggleBlock = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isBlocked: !currentStatus })
      });
      if (res.ok) {
        addToast(`User ${!currentStatus ? 'blocked' : 'unblocked'}`, "success");
        setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !currentStatus } : u));
      }
    } catch (e) {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex gap-8 flex-col sm:flex-row">
      <div className="w-full sm:w-64 flex-shrink-0">
        <div className="bg-white rounded-3xl shadow-sm border-2 border-slate-100 p-6 sticky top-24">
          <div className="mb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Admin Console</div>
          <ul className="space-y-2">
            <li>
              <button 
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-bold ${view === "stats" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-500 hover:bg-slate-50"}`}
                onClick={() => setView("stats")}
              >
                Dashboard Stats
              </button>
            </li>
            <li>
              <button 
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-bold ${view === "users" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-500 hover:bg-slate-50"}`}
                onClick={() => setView("users")}
              >
                Manage Users
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-1">
        {view === "stats" && (
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-8">Platform Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100 text-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Total Users</span>
                <p className="text-5xl font-black text-indigo-600 mt-3 tracking-tighter">{stats.users}</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100 text-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Active Jobs</span>
                <p className="text-5xl font-black text-indigo-600 mt-3 tracking-tighter">{stats.jobs}</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100 text-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Applications</span>
                <p className="text-5xl font-black text-indigo-600 mt-3 tracking-tighter">{stats.applications}</p>
              </div>
            </div>
          </div>
        )}

        {view === "users" && (
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-8">User Management</h2>
            <div className="bg-white rounded-3xl shadow-sm border-2 border-slate-100 overflow-hidden">
              <table className="min-w-full text-left border-collapse">
                <thead className="bg-slate-50/50">
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900">{u.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold tracking-tight text-slate-500">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-[10px] font-black uppercase tracking-wider text-slate-600">{u.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-[10px] uppercase font-black tracking-wider rounded-full ${u.isBlocked ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {u.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {u.role !== 'admin' && (
                          <button 
                            onClick={() => toggleBlock(u._id, !!u.isBlocked)}
                            className={`text-[10px] uppercase font-black tracking-wider ${u.isBlocked ? 'text-emerald-500 hover:text-emerald-700' : 'text-rose-500 hover:text-rose-700'}`}
                          >
                            {u.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
