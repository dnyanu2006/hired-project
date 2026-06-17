import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { useToast } from "../context/ToastContext.tsx";
import { Job } from "../types.tsx";
import { MapPin, DollarSign, Briefcase, Building, ChevronLeft } from "lucide-react";

export function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`);
        if (res.ok) {
          setJob(await res.json());
        } else {
          addToast("Job not found", "error");
          navigate("/jobs");
        }
      } catch (e) {
        addToast("Error fetching job", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate, addToast]);

  const handleApply = async () => {
    if (!user) {
      addToast("Please login to apply", "info");
      navigate("/login");
      return;
    }
    if (user.role !== "user") {
      addToast("Only job seekers can apply", "error");
      return;
    }

    if (!resumeFile) {
      addToast("Please upload a resume", "error");
      return;
    }

    setApplying(true);
    try {
      const formData = new FormData();
      formData.append("jobId", id as string);
      formData.append("resume", resumeFile);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      
      if (res.ok) {
        addToast("Application submitted successfully!", "success");
        navigate("/applications");
      } else {
        addToast(data.error || "Failed to apply", "error");
      }
    } catch (e) {
      addToast("Network error", "error");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-slate-400">Loading...</div>;
  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-8">
        <ChevronLeft className="w-5 h-5 mr-1" strokeWidth={2.5} /> Back to jobs
      </button>

      <div className="bg-white rounded-3xl shadow-sm border-2 border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{job.title}</h1>
              <div className="flex items-center text-lg text-slate-500 font-bold tracking-tight mb-6">
                <Building className="w-5 h-5 mr-2 text-indigo-500" strokeWidth={2.5} />
                {job.company}
              </div>
              <div className="flex flex-wrap gap-3 text-slate-600">
                <div className="flex items-center bg-slate-100 text-slate-600 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  <MapPin className="w-4 h-4 mr-1.5 text-slate-400" strokeWidth={2.5}/> {job.location}
                </div>
                <div className="flex items-center bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 mr-1.5 text-indigo-400" strokeWidth={2.5} /> {job.type}
                </div>
                {job.salary && (
                  <div className="flex items-center bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    <DollarSign className="w-4 h-4 mr-1.5 text-emerald-400" strokeWidth={2.5}/> {job.salary}
                  </div>
                )}
              </div>
            </div>
            {(user?.role === "user" || !user) && (
              <div className="flex flex-col gap-4 w-full sm:w-auto">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Resume (PDF/DOC)</label>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-wider file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>
                <button 
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full bg-indigo-600 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:bg-indigo-400 disabled:scale-100"
                >
                  {applying ? "Applying..." : "Apply Now"}
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-10">
          <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6">Job Description</h2>
          <div className="prose max-w-none text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
            {job.description}
          </div>
        </div>
      </div>
    </div>
  );
}
