import { Link } from "react-router-dom";
import { Search, Briefcase, Users, ShieldCheck } from "lucide-react";

export function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-50 border-b border-slate-200 py-24 px-4 sm:px-6 lg:px-8 flex-grow flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
            Find Your <span className="text-indigo-600 italic">Dream Job</span> Today.
          </h1>
          <p className="text-xl text-slate-500 font-medium mb-10 max-w-2xl mx-auto tracking-tight">
            Connect with top companies, apply seamlessly, and keep track of your career progression on Hired.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/jobs" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 transition-transform">
              Browse Jobs
            </Link>
            <Link to="/register" className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider border-2 border-indigo-100 hover:bg-slate-50 hover:border-indigo-200 transition-colors">
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-slate-50 rounded-3xl border-2 border-slate-100 transition-transform hover:scale-105">
              <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <Search className="w-8 h-8 text-indigo-600" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-3">Smart Search</h3>
              <p className="text-slate-500 font-bold text-sm leading-relaxed">Find exactly what you're looking for with our advanced filtering system by location and job type.</p>
            </div>
            <div className="text-center p-8 bg-slate-50 rounded-3xl border-2 border-slate-100 transition-transform hover:scale-105">
              <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                <Briefcase className="w-8 h-8 text-emerald-600" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-3">Easy Applications</h3>
              <p className="text-slate-500 font-bold text-sm leading-relaxed">Apply to multiple jobs with a single click and track your status securely.</p>
            </div>
            <div className="text-center p-8 bg-slate-50 rounded-3xl border-2 border-slate-100 transition-transform hover:scale-105">
              <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <ShieldCheck className="w-8 h-8 text-amber-600" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-3">Verified Recruiters</h3>
              <p className="text-slate-500 font-bold text-sm leading-relaxed">All companies are verified. Get direct updates to your email on application success or reject.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
