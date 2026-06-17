import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { Application } from "../types.tsx";
import { Building, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

export function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch("https://hired-project.onrender.com/api/applications/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setApplications(await res.json());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [token]);

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-8">My Applications</h1>
      
      {loading ? (
        <div className="text-center py-12 font-bold text-slate-500">Loading...</div>
      ) : applications.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-slate-100 text-center">
          <p className="text-slate-500 font-bold mb-4 tracking-tight">You haven't applied to any jobs yet.</p>
          <Link to="/jobs" className="text-indigo-600 font-black hover:text-indigo-700 italic transition-colors">Find jobs to apply</Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border-2 border-slate-100 overflow-hidden">
          <ul className="divide-y divide-slate-50 flex flex-col">
            {applications.map(app => (
              <li key={app._id} className="p-8 hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link to={`/jobs/${app.jobId._id}`} className="block focus:outline-none group">
                      <h4 className="text-xl font-black text-slate-900 truncate tracking-tight group-hover:text-indigo-600 transition-colors">{app.jobId.title}</h4>
                      <div className="mt-2 flex items-center text-sm font-bold text-slate-500">
                        <Building className="flex-shrink-0 mr-1.5 h-4 w-4 text-slate-400" strokeWidth={2.5} />
                        <span className="truncate">{app.jobId.company}</span>
                        <span className="mx-3 text-slate-300">&bull;</span>
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-slate-400" strokeWidth={2.5} />
                        <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  </div>
                  <div className="flex flex-col items-end sm:pl-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={app.status} />
                      <span className={`text-[10px] uppercase tracking-wider font-black px-3 py-1 rounded-full ${
                        app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                        app.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
