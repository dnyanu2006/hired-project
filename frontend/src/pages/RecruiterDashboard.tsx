import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Job } from "../types";

export function RecruiterDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [view, setView] = useState<"list" | "create" | "manage">("list");
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({ title: "", description: "", company: "", location: "", salary: "", type: "full-time" });
  
  const { token } = useAuth();
  const { addToast } = useToast();

  const fetchMyJobs = async () => {
    try {
      const res = await fetch("https://hired-project.onrender.com/api/jobs/me/managed", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setJobs(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (view === "list") fetchMyJobs();
  }, [view]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://hired-project.onrender.com/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        addToast("Job posted successfully", "success");
        setFormData({ title: "", description: "", company: "", location: "", salary: "", type: "full-time" });
        setView("list");
      } else {
        addToast("Failed to post job", "error");
      }
    } catch (e) {
      addToast("Network error", "error");
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await fetch(`https://hired-project.onrender.com/api/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        addToast("Job deleted", "success");
        fetchMyJobs();
      }
    } catch (e) {
      addToast("Error deleting job", "error");
    }
  };

  const manageApplications = async (jobId: string) => {
    setSelectedJob(jobId);
    setView("manage");
    try {
      const res = await fetch(`https://hired-project.onrender.com/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setApplications(await res.json());
    } catch (e) {
      addToast("Error fetching applications", "error");
    }
  };

  const updateStatus = async (appId: string, status: "accepted" | "rejected") => {
    try {
      const res = await fetch(`https://hired-project.onrender.com/api/applications/${appId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        addToast(`Application ${status}`, "success");
        // Update local state
        setApplications(apps => apps.map(app => app._id === appId ? { ...app, status } : app));
      }
    } catch (e) {
      addToast("Error updating status", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex gap-8 flex-col sm:flex-row">
      <div className="w-full sm:w-64 flex-shrink-0">
        <div className="bg-white rounded-3xl shadow-sm border-2 border-slate-100 p-6 sticky top-24">
          <div className="mb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recruiter Console</div>
          <ul className="space-y-2">
            <li>
              <button 
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-bold ${view === "list" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-500 hover:bg-slate-50"}`}
                onClick={() => setView("list")}
              >
                My Jobs
              </button>
            </li>
            <li>
              <button 
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-bold ${view === "create" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-500 hover:bg-slate-50"}`}
                onClick={() => setView("create")}
              >
                Post New Job
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-1">
        {view === "list" && (
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-8">Manage Your Jobs</h2>
            <div className="grid gap-6">
              {jobs.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl text-center border-2 border-slate-100">
                  <p className="text-slate-500 font-bold mb-4 tracking-tight">You haven't posted any jobs yet.</p>
                  <button onClick={() => setView("create")} className="text-indigo-600 font-black hover:text-indigo-700 italic border-b-2 border-indigo-200">Post your first job</button>
                </div>
              ) : (
                jobs.map(job => (
                  <div key={job._id} className="bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-transform hover:scale-[1.01]">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">{job.title}</h3>
                      <p className="text-slate-500 font-bold tracking-tight text-sm">
                        <span className="text-indigo-600 uppercase text-[10px] font-black tracking-widest">{job.type}</span> 
                        <span className="mx-2">•</span> 
                        {job.location}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => manageApplications(job._id)} className="bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-wider hover:bg-indigo-100 transition-colors">View Applicants</button>
                      <button onClick={() => deleteJob(job._id)} className="bg-rose-50 text-rose-600 px-5 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-wider hover:bg-rose-100 transition-colors">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === "create" && (
          <div className="bg-white p-10 rounded-3xl shadow-sm border-2 border-slate-100">
            <h2 className="text-4xl font-black tracking-tighter mb-8">Post a New Job</h2>
            <form onSubmit={handleCreateJob} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Job Title</label>
                  <input type="text" required className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl font-bold text-slate-900 ring-0 focus:ring-2 focus:ring-indigo-500 transition-shadow" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Company</label>
                  <input type="text" required className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl font-bold text-slate-900 ring-0 focus:ring-2 focus:ring-indigo-500 transition-shadow" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Location</label>
                  <input type="text" required className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl font-bold text-slate-900 ring-0 focus:ring-2 focus:ring-indigo-500 transition-shadow" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Salary Range</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl font-bold text-slate-900 ring-0 focus:ring-2 focus:ring-indigo-500 transition-shadow" placeholder="e.g. $80k-$120k" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Type</label>
                  <select className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl font-bold text-slate-900 ring-0 focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Description</label>
                <textarea required rows={6} className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl font-bold text-slate-900 ring-0 focus:ring-2 focus:ring-indigo-500 transition-shadow" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <button type="submit" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-transform">Post Job</button>
            </form>
          </div>
        )}

        {view === "manage" && (
          <div>
            <button onClick={() => setView("list")} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-6 inline-flex mt-2">&larr; Back to jobs</button>
            <h2 className="text-4xl font-black tracking-tighter mb-8">Manage Applications</h2>
            {applications.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl text-center border-2 border-slate-100 text-slate-500 font-bold tracking-tight">No applicants yet.</div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border-2 border-slate-100 overflow-hidden">
                <table className="min-w-full text-left border-collapse">
                  <thead className="bg-slate-50/50">
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Applicant Name</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Resume</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Applied Date</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                      <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {applications.map(app => (
                      <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900">{app.userId.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-500 tracking-tight">{app.userId.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-500">
                          {app.resumeUrl ? (
  <a
    href={`https://hired-project.onrender.com${app.resumeUrl}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-indigo-600 hover:text-indigo-800 underline uppercase text-[10px] font-black tracking-widest"
  >
    View Resume
  </a>
) : (
  <span>No Resume</span>
)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-black rounded-full ${
                            app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                            app.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {app.status === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(app._id, 'accepted')} className="text-[10px] font-black uppercase tracking-wider text-emerald-500 hover:text-emerald-700 mr-4">Accept</button>
                              <button onClick={() => updateStatus(app._id, 'rejected')} className="text-[10px] font-black uppercase tracking-wider text-rose-500 hover:text-rose-700">Reject</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
