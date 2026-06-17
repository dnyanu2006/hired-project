import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Job } from "../types";
import { Search, MapPin, DollarSign, Briefcase } from "lucide-react";


export function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  
 const fetchJobs = async () => {
  console.log("🔥 fetchJobs STARTED");
  setLoading(true);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`);

    console.log("🔥 response received:", res);

    const data = await res.json();

    console.log("🔥 data:", data);

    setJobs(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("❌ ERROR:", err);
  } finally {
    console.log("🔥 fetchJobs FINISHED");
    setLoading(false);
  }
};
useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100 mb-10">
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-6">Search Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-2 relative">
            <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" strokeWidth={2.5} />
            <input 
              type="text" placeholder="Job title or keywords" 
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-xl font-bold text-slate-900 ring-0 focus:ring-2 focus:ring-indigo-500 transition-shadow"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" strokeWidth={2.5} />
            <input 
              type="text" placeholder="Location" 
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-xl font-bold text-slate-900 ring-0 focus:ring-2 focus:ring-indigo-500 transition-shadow"
              value={location} onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select 
              className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl font-bold text-slate-900 ring-0 focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none"
              value={type} onChange={(e) => setType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
            <button 
              onClick={fetchJobs}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md shadow-indigo-200 hover:scale-[1.05] active:scale-[0.95] transition-transform"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-12 font-bold text-slate-500">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-slate-100">
            <p className="text-slate-500 text-lg font-bold tracking-tight">No jobs found matching your criteria.</p>
          </div>
        ) : (
          jobs.map(job => (
            <Link key={job._id} to={`/jobs/${job._id}`} className="block bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all hover:scale-[1.01]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">{job.title}</h3>
                  <p className="text-slate-500 font-bold tracking-tight">{job.company}</p>
                </div>
                <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  {job.type}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500">
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" strokeWidth={2.5} /> {job.location}</div>
                {job.salary && <div className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-slate-400" strokeWidth={2.5} /> {job.salary}</div>}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

