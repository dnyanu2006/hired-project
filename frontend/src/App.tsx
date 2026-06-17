/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";
import { Navbar } from "./components/Navbar.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

import { Landing } from "./pages/Landing.tsx";
import { Login } from "./pages/Login.tsx";
import { Register } from "./pages/Register.tsx";
import { JobsList } from "./pages/JobsList.tsx";
import { JobDetails } from "./pages/JobDetails.tsx";
import { MyApplications } from "./pages/MyApplications.tsx";
import { RecruiterDashboard } from "./pages/RecruiterDashboard.tsx";
import { AdminDashboard } from "./pages/AdminDashboard.tsx";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/jobs" element={<JobsList />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                
                {/* User Only */}
                <Route path="/applications" element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <MyApplications />
                  </ProtectedRoute>
                } />
                
                {/* Recruiter Only */}
                <Route path="/recruiter" element={
                  <ProtectedRoute allowedRoles={["recruiter"]}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Admin Only */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
