import "dotenv/config";
import { PrismaClient, JobCategory, JobType } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const companies = [
  {
    name: "Google",
    slug: "google",
    logo: "/uploads/logos/google.svg",
    description: "Global technology leader building products that help billions of people.",
    website: "https://google.com",
  },
  {
    name: "Microsoft",
    slug: "microsoft",
    logo: "/uploads/logos/microsoft.svg",
    description: "Empowering every person and organization on the planet to achieve more.",
    website: "https://microsoft.com",
  },
  {
    name: "Amazon",
    slug: "amazon",
    logo: "/uploads/logos/amazon.svg",
    description: "Earth's most customer-centric company.",
    website: "https://amazon.com",
  },
  {
    name: "Flipkart",
    slug: "flipkart",
    logo: "/uploads/logos/flipkart.svg",
    description: "India's leading e-commerce marketplace.",
    website: "https://flipkart.com",
  },
  {
    name: "Infosys",
    slug: "infosys",
    logo: "/uploads/logos/infosys.svg",
    description: "Global leader in next-generation digital services and consulting.",
    website: "https://infosys.com",
  },
  {
    name: "TCS",
    slug: "tcs",
    logo: "/uploads/logos/tcs.svg",
    description: "IT services, consulting and business solutions organization.",
    website: "https://tcs.com",
  },
  {
    name: "Wipro",
    slug: "wipro",
    logo: "/uploads/logos/wipro.svg",
    description: "Leading global information technology, consulting and business process services company.",
    website: "https://wipro.com",
  },
  {
    name: "Zomato",
    slug: "zomato",
    logo: "/uploads/logos/zomato.svg",
    description: "Food delivery and restaurant discovery platform.",
    website: "https://zomato.com",
  },
];

const jobsData = [
  {
    searchCode: "CS001",
    companyName: "Google",
    role: "Software Engineer Intern",
    category: JobCategory.INTERNSHIP,
    jobType: JobType.INTERNSHIP,
    location: "Bangalore, India",
    experience: "0-1 years",
    qualification: "B.Tech/M.Tech in CS or related field",
    salary: "₹80,000/month",
    description: "Join Google's engineering internship program and work on cutting-edge products used by billions worldwide.",
    responsibilities: ["Write clean, efficient code", "Collaborate with engineers", "Participate in code reviews", "Present project outcomes"],
    skills: ["Python", "Java", "Data Structures", "Algorithms"],
    applyLink: "https://careers.google.com",
    featured: true,
    trending: true,
  },
  {
    searchCode: "CS002",
    companyName: "Microsoft",
    role: "Associate Software Engineer",
    category: JobCategory.FRESHER,
    jobType: JobType.FULL_TIME,
    location: "Hyderabad, India",
    experience: "0-2 years",
    qualification: "B.E/B.Tech in Computer Science",
    salary: "₹12-18 LPA",
    description: "Microsoft is hiring fresh graduates for its Azure and Office teams. Great learning environment with mentorship.",
    responsibilities: ["Develop cloud solutions", "Debug and fix issues", "Write unit tests", "Document technical designs"],
    skills: ["C#", ".NET", "Azure", "TypeScript"],
    applyLink: "https://careers.microsoft.com",
    featured: true,
    trending: false,
  },
  {
    searchCode: "CS003",
    companyName: "Amazon",
    role: "SDE-1",
    category: JobCategory.FRESHER,
    jobType: JobType.FULL_TIME,
    location: "Chennai, India",
    experience: "0-1 years",
    qualification: "B.Tech/M.Tech",
    salary: "₹18-24 LPA",
    description: "Amazon is looking for passionate SDEs to build scalable systems for millions of customers.",
    responsibilities: ["Design distributed systems", "Optimize performance", "Own feature delivery", "Mentor interns"],
    skills: ["Java", "AWS", "System Design", "SQL"],
    applyLink: "https://amazon.jobs",
    featured: false,
    trending: true,
  },
  {
    searchCode: "CS004",
    companyName: "Flipkart",
    role: "Frontend Developer",
    category: JobCategory.REMOTE,
    jobType: JobType.REMOTE,
    location: "Remote, India",
    experience: "1-3 years",
    qualification: "Any graduate with relevant experience",
    salary: "₹10-15 LPA",
    description: "Build delightful shopping experiences for millions of Indian customers. Fully remote role.",
    responsibilities: ["Build React components", "Improve page performance", "A/B test UI changes", "Collaborate with designers"],
    skills: ["React", "TypeScript", "Next.js", "CSS"],
    applyLink: "https://flipkartcareers.com",
    featured: false,
    trending: true,
  },
  {
    searchCode: "CS005",
    companyName: "Infosys",
    role: "Systems Engineer",
    category: JobCategory.FRESHER,
    jobType: JobType.FULL_TIME,
    location: "Pune, India",
    experience: "0 years",
    qualification: "B.E/B.Tech/MCA",
    salary: "₹3.6-4.5 LPA",
    description: "Infosys campus hiring for 2025 batch. Training provided on latest technologies.",
    responsibilities: ["Develop client applications", "Support production systems", "Follow agile practices", "Learn new technologies"],
    skills: ["Java", "SQL", "Communication", "Problem Solving"],
    applyLink: "https://infosys.com/careers",
    featured: false,
    trending: false,
  },
  {
    searchCode: "CS006",
    companyName: "TCS",
    role: "Graduate Trainee",
    category: JobCategory.OFF_CAMPUS,
    jobType: JobType.FULL_TIME,
    location: "Mumbai, India",
    experience: "0 years",
    qualification: "B.E/B.Tech (2024/2025 passout)",
    salary: "₹3.36 LPA",
    description: "TCS off-campus drive for fresh graduates. Multiple locations available after training.",
    responsibilities: ["Complete training program", "Work on client projects", "Maintain documentation", "Meet delivery timelines"],
    skills: ["Programming", "Database", "English", "Teamwork"],
    applyLink: "https://tcs.com/careers",
    featured: false,
    trending: false,
  },
  {
    searchCode: "CS007",
    companyName: "Wipro",
    role: "Project Engineer",
    category: JobCategory.FRESHER,
    jobType: JobType.FULL_TIME,
    location: "Noida, India",
    experience: "0-1 years",
    qualification: "B.Tech/BCA/MCA",
    salary: "₹3.5-5 LPA",
    description: "Wipro is hiring project engineers for digital transformation projects across industries.",
    responsibilities: ["Implement solutions", "Test applications", "Client interaction", "Report progress"],
    skills: ["Java", "Angular", "SQL", "Git"],
    applyLink: "https://wipro.com/careers",
    featured: false,
    trending: false,
  },
  {
    searchCode: "CS008",
    companyName: "Zomato",
    role: "Product Analyst Intern",
    category: JobCategory.INTERNSHIP,
    jobType: JobType.INTERNSHIP,
    location: "Gurgaon, India",
    experience: "0 years",
    qualification: "Pursuing B.Tech/MBA",
    salary: "₹25,000/month",
    description: "6-month internship in product analytics team. Work on data-driven product decisions.",
    responsibilities: ["Analyze user data", "Create dashboards", "Support A/B tests", "Present insights"],
    skills: ["SQL", "Excel", "Python", "Analytics"],
    applyLink: "https://zomato.com/careers",
    featured: true,
    trending: false,
  },
  {
    searchCode: "CS009",
    companyName: "Google",
    role: "Senior Software Engineer",
    category: JobCategory.EXPERIENCED,
    jobType: JobType.FULL_TIME,
    location: "Bangalore, India",
    experience: "5+ years",
    qualification: "B.Tech/M.Tech + relevant experience",
    salary: "₹40-70 LPA",
    description: "Lead complex engineering projects at Google scale. Mentor junior engineers and drive technical strategy.",
    responsibilities: ["Lead technical design", "Mentor team members", "Drive architecture decisions", "Cross-team collaboration"],
    skills: ["System Design", "Go", "Python", "Leadership"],
    applyLink: "https://careers.google.com",
    featured: true,
    trending: true,
  },
  {
    searchCode: "CS010",
    companyName: "Microsoft",
    role: "Cloud Solutions Architect",
    category: JobCategory.EXPERIENCED,
    jobType: JobType.FULL_TIME,
    location: "Remote, India",
    experience: "7+ years",
    qualification: "B.Tech + Azure certifications preferred",
    salary: "₹35-55 LPA",
    description: "Design enterprise cloud solutions for Microsoft Azure customers across India.",
    responsibilities: ["Architect cloud solutions", "Pre-sales support", "Customer workshops", "Best practices guidance"],
    skills: ["Azure", "Architecture", "DevOps", "Communication"],
    applyLink: "https://careers.microsoft.com",
    featured: false,
    trending: true,
  },
  {
    searchCode: "CS011",
    companyName: "Amazon",
    role: "Customer Support Associate",
    category: JobCategory.WORK_FROM_HOME,
    jobType: JobType.PART_TIME,
    location: "Work From Home",
    experience: "0-1 years",
    qualification: "12th pass / Any graduate",
    salary: "₹15,000-20,000/month",
    description: "Work from home customer support role for Amazon India. Flexible shifts available.",
    responsibilities: ["Handle customer queries", "Resolve order issues", "Maintain quality scores", "Follow SOPs"],
    skills: ["Communication", "English", "Computer basics", "Patience"],
    applyLink: "https://amazon.jobs",
    featured: false,
    trending: false,
  },
  {
    searchCode: "CS012",
    companyName: "Flipkart",
    role: "Data Science Intern",
    category: JobCategory.INTERNSHIP,
    jobType: JobType.INTERNSHIP,
    location: "Bangalore, India",
    experience: "0 years",
    qualification: "B.Tech/M.Tech in CS/Stats",
    salary: "₹50,000/month",
    description: "Summer internship in Flipkart's data science team working on recommendation systems.",
    responsibilities: ["Build ML models", "Analyze datasets", "Present findings", "Deploy prototypes"],
    skills: ["Python", "ML", "Pandas", "Statistics"],
    applyLink: "https://flipkartcareers.com",
    featured: false,
    trending: true,
  },
  {
    searchCode: "CS013",
    companyName: "Infosys",
    role: "DevOps Engineer",
    category: JobCategory.REMOTE,
    jobType: JobType.REMOTE,
    location: "Remote, India",
    experience: "2-4 years",
    qualification: "B.Tech + DevOps experience",
    salary: "₹8-14 LPA",
    description: "Remote DevOps role managing CI/CD pipelines and cloud infrastructure for global clients.",
    responsibilities: ["Manage CI/CD", "Monitor infrastructure", "Automate deployments", "Incident response"],
    skills: ["Docker", "Kubernetes", "Jenkins", "AWS"],
    applyLink: "https://infosys.com/careers",
    featured: false,
    trending: false,
  },
  {
    searchCode: "CS014",
    companyName: "TCS",
    role: "Business Analyst",
    category: JobCategory.EXPERIENCED,
    jobType: JobType.FULL_TIME,
    location: "Kolkata, India",
    experience: "3-5 years",
    qualification: "MBA/B.Tech with BA experience",
    salary: "₹10-16 LPA",
    description: "Bridge business and technology for enterprise clients in banking and finance domain.",
    responsibilities: ["Gather requirements", "Create BRDs", "Stakeholder management", "UAT support"],
    skills: ["Business Analysis", "SQL", "Agile", "Documentation"],
    applyLink: "https://tcs.com/careers",
    featured: false,
    trending: false,
  },
  {
    searchCode: "CS015",
    companyName: "Zomato",
    role: "Android Developer",
    category: JobCategory.WORK_FROM_HOME,
    jobType: JobType.REMOTE,
    location: "Work From Home",
    experience: "2-4 years",
    qualification: "B.Tech in CS",
    salary: "₹12-20 LPA",
    description: "Build and maintain Zomato's Android app. Hybrid WFH model with occasional office visits.",
    responsibilities: ["Develop Android features", "Fix bugs", "Code reviews", "Performance optimization"],
    skills: ["Kotlin", "Android", "REST APIs", "Git"],
    applyLink: "https://zomato.com/careers",
    featured: true,
    trending: false,
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.adminUser.deleteMany();

  const createdCompanies = await Promise.all(
    companies.map((c) => prisma.company.create({ data: c }))
  );

  const companyMap = Object.fromEntries(
    createdCompanies.map((c) => [c.name, c.id])
  );

  for (const job of jobsData) {
    await prisma.job.create({
      data: {
        ...job,
        companyId: companyMap[job.companyName],
        companyLogo:
          companies.find((c) => c.name === job.companyName)?.logo ?? null,
        postedDate: new Date(
          Date.now() - Math.floor(Math.random() * 14) * 86400000
        ),
      },
    });
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.create({
    data: {
      email: process.env.ADMIN_EMAIL || "admin@careersnap.com",
      password: hashedPassword,
      name: "Admin",
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
