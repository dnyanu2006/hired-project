export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "recruiter" | "admin";
  isBlocked?: boolean;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  recruiterId: any;
  createdAt: string;
}

export interface Application {
  _id: string;
  jobId: Job;
  userId: User;
  status: "pending" | "accepted" | "rejected";
  resumeUrl?: string;
  createdAt: string;
}
