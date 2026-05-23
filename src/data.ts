import { ResumeData } from "./types";

export const sampleResumeData: ResumeData = {
  personalInfo: {
    name: "Alex Sterling",
    title: "Senior Full Stack Engineer",
    email: "alex.sterling@example.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    website: "https://sterlingcodes.dev",
    linkedin: "linkedin.com/in/alexsterling",
    github: "github.com/alexsterling",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&auto=format&fit=crop"
  },
  summary: "Results-driven Full Stack Developer with 6+ years of experience designing and optimizing scalable, user-centric web applications. Proven success spearheading system migrations, introducing modern framework architectures, and boosting response times by up to 35%. Passionate about mentoring junior developers and applying Gemini AI to advance productivity frameworks.",
  workExperience: [
    {
      id: "w1",
      role: "Lead Software Architect",
      company: "InnovateTech Solutions",
      location: "San Francisco, CA",
      startDate: "2023-01",
      endDate: "",
      current: true,
      description: "• Spearheaded modular migration of legacy CRM to a modern React & Node.js architecture, which improved core web vitals by 40% .\n• Architected cloud-native API dispatchers handling 12M+ daily requests, decreasing server latency by 28%.\n• Built and automated continuous deployment workflows, which eliminated up to 6 hours of developer deployment overhead weekly.\n• Led, mentored, and coached a high-performing agile engineering squad of 8 frontend and backend engineers."
    },
    {
      id: "w2",
      role: "Senior Full Stack Engineer",
      company: "Quantum SaaS Inc.",
      location: "Remote",
      startDate: "2020-05",
      endDate: "2022-12",
      current: false,
      description: "• Engineered key client-facing interactive data visualizers using D3.js and Tailwind CSS, increasing overall user engagement by 22%.\n• Designed and maintained microservices-based database APIs using Postgres and Redis cache matrices, eliminating redundant SQL cycles.\n• Formulated automated unit and integration suites, securing test branch code coverage from 60% to 92%."
    }
  ],
  education: [
    {
      id: "e1",
      degree: "B.S. in Computer Science & Engineering",
      school: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2016-09",
      endDate: "2020-05",
      description: "Graduated with Honors. Specialized in Software Engineering & Database Systems."
    }
  ],
  skills: [
    {
      id: "s1",
      category: "Languages & Core",
      items: ["TypeScript", "JavaScript", "Python", "SQL", "Go", "HTML5/CSS3"]
    },
    {
      id: "s2",
      category: "Frameworks & UI",
      items: ["React", "Express", "Vite", "Tailwind CSS", "Next.js", "Redux Toolkit"]
    },
    {
      id: "s3",
      category: "Cloud & Devops",
      items: ["Amazon AWS", "Docker", "Node.js", "GitHub Actions", "Terraform", "PostgreSQL"]
    }
  ],
  projects: [
    {
      id: "p1",
      name: "Automated Resumé Matching Engine",
      description: "Developed a natural language utility that uses local LLM endpoints to parse and map candidate skill arrays to active tech roles.",
      technologies: "TypeScript, Python, FastAPI, React",
      link: "github.com/alexsterling/resume-ai"
    },
    {
      id: "p2",
      name: "Distributed Task Scheduler",
      description: "Engineered a low-latency cron-like task coordinator that guarantees exactly-once payload delivery under extreme network partitions.",
      technologies: "Go, Redis, gRPC, Docker",
      link: "github.com/alexsterling/task-sync"
    }
  ],
  certifications: [
    {
      id: "c1",
      name: "AWS Certified Solutions Architect – Professional",
      issuer: "Amazon Web Services (AWS)",
      date: "2024-03"
    },
    {
      id: "c2",
      name: "Professional Scrum Master (PSM I)",
      issuer: "Scrum.org",
      date: "2021-11"
    }
  ]
};
