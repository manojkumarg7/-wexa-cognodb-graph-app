require("dotenv").config();

const { driver, verifyConnection, closeDriver } = require("./db/neo4j");

const users = [
  { id: "user-1", name: "Aisha Khan", email: "aisha.khan@email.com" },
  { id: "user-2", name: "Ben Torres", email: "ben.torres@email.com" },
  { id: "user-3", name: "Chloe Nguyen", email: "chloe.nguyen@email.com" },
  { id: "user-4", name: "David Okonkwo", email: "david.okonkwo@email.com" },
  { id: "user-5", name: "Elena Rossi", email: "elena.rossi@email.com" },
];

const skills = [
  { id: "skill-1", name: "JavaScript", category: "Programming" },
  { id: "skill-2", name: "TypeScript", category: "Programming" },
  { id: "skill-3", name: "React", category: "Frontend" },
  { id: "skill-4", name: "Node.js", category: "Backend" },
  { id: "skill-5", name: "Python", category: "Programming" },
  { id: "skill-6", name: "Graph Databases", category: "Data" },
  { id: "skill-7", name: "Cypher", category: "Data" },
  { id: "skill-8", name: "System Design", category: "Architecture" },
  { id: "skill-9", name: "Docker", category: "DevOps" },
  { id: "skill-10", name: "AWS", category: "Cloud" },
];

const companies = [
  { id: "company-1", name: "NovaSoft Labs", industry: "Software" },
  { id: "company-2", name: "Graphify AI", industry: "Artificial Intelligence" },
  { id: "company-3", name: "CloudNest Systems", industry: "Cloud Computing" },
  { id: "company-4", name: "PixelForge Studio", industry: "Product Design" },
];

const jobs = [
  {
    id: "job-1",
    title: "Full Stack Engineer",
    location: "Remote",
    experience: "3+ years",
    companyId: "company-1",
  },
  {
    id: "job-2",
    title: "Frontend Engineer",
    location: "San Francisco, CA",
    experience: "2+ years",
    companyId: "company-4",
  },
  {
    id: "job-3",
    title: "Backend Engineer",
    location: "Austin, TX",
    experience: "4+ years",
    companyId: "company-1",
  },
  {
    id: "job-4",
    title: "Graph Database Engineer",
    location: "Remote",
    experience: "3+ years",
    companyId: "company-2",
  },
  {
    id: "job-5",
    title: "Cloud Platform Engineer",
    location: "Seattle, WA",
    experience: "5+ years",
    companyId: "company-3",
  },
  {
    id: "job-6",
    title: "AI Application Developer",
    location: "New York, NY",
    experience: "3+ years",
    companyId: "company-2",
  },
];

const skillRelations = [
  { from: "skill-1", to: "skill-2" },
  { from: "skill-1", to: "skill-3" },
  { from: "skill-1", to: "skill-4" },
  { from: "skill-2", to: "skill-3" },
  { from: "skill-4", to: "skill-9" },
  { from: "skill-5", to: "skill-6" },
  { from: "skill-6", to: "skill-7" },
  { from: "skill-8", to: "skill-10" },
  { from: "skill-9", to: "skill-10" },
];

const userSkills = [
  { userId: "user-1", skillId: "skill-1" },
  { userId: "user-1", skillId: "skill-3" },
  { userId: "user-1", skillId: "skill-4" },
  { userId: "user-2", skillId: "skill-2" },
  { userId: "user-2", skillId: "skill-3" },
  { userId: "user-2", skillId: "skill-8" },
  { userId: "user-3", skillId: "skill-5" },
  { userId: "user-3", skillId: "skill-6" },
  { userId: "user-3", skillId: "skill-7" },
  { userId: "user-4", skillId: "skill-4" },
  { userId: "user-4", skillId: "skill-9" },
  { userId: "user-4", skillId: "skill-10" },
  { userId: "user-5", skillId: "skill-1" },
  { userId: "user-5", skillId: "skill-2" },
  { userId: "user-5", skillId: "skill-5" },
];

const jobSkills = [
  { jobId: "job-1", skillId: "skill-1" },
  { jobId: "job-1", skillId: "skill-3" },
  { jobId: "job-1", skillId: "skill-4" },
  { jobId: "job-2", skillId: "skill-1" },
  { jobId: "job-2", skillId: "skill-2" },
  { jobId: "job-2", skillId: "skill-3" },
  { jobId: "job-3", skillId: "skill-4" },
  { jobId: "job-3", skillId: "skill-8" },
  { jobId: "job-3", skillId: "skill-9" },
  { jobId: "job-4", skillId: "skill-5" },
  { jobId: "job-4", skillId: "skill-6" },
  { jobId: "job-4", skillId: "skill-7" },
  { jobId: "job-5", skillId: "skill-9" },
  { jobId: "job-5", skillId: "skill-10" },
  { jobId: "job-5", skillId: "skill-8" },
  { jobId: "job-6", skillId: "skill-5" },
  { jobId: "job-6", skillId: "skill-1" },
  { jobId: "job-6", skillId: "skill-4" },
];

const applications = [
  { userId: "user-1", jobId: "job-1" },
  { userId: "user-1", jobId: "job-2" },
  { userId: "user-2", jobId: "job-2" },
  { userId: "user-2", jobId: "job-1" },
  { userId: "user-3", jobId: "job-4" },
  { userId: "user-3", jobId: "job-6" },
  { userId: "user-4", jobId: "job-3" },
  { userId: "user-4", jobId: "job-5" },
  { userId: "user-5", jobId: "job-6" },
  { userId: "user-5", jobId: "job-1" },
];

async function runQuery(session, label, cypher, params) {
  await session.run(cypher, params);
  console.log(`✓ ${label}`);
}

async function seed() {
  console.log("Connecting to CognoDB...");
  await verifyConnection();
  console.log("Connected. Seeding graph data...\n");

  const session = driver.session();

  try {
    await runQuery(
      session,
      `Merged ${users.length} Users`,
      `
      UNWIND $users AS user
      MERGE (u:User {id: user.id})
      SET u.name = user.name, u.email = user.email
      `,
      { users },
    );

    await runQuery(
      session,
      `Merged ${skills.length} Skills`,
      `
      UNWIND $skills AS skill
      MERGE (s:Skill {id: skill.id})
      SET s.name = skill.name, s.category = skill.category
      `,
      { skills },
    );

    await runQuery(
      session,
      `Merged ${companies.length} Companies`,
      `
      UNWIND $companies AS company
      MERGE (c:Company {id: company.id})
      SET c.name = company.name, c.industry = company.industry
      `,
      { companies },
    );

    await runQuery(
      session,
      `Merged ${jobs.length} Jobs`,
      `
      UNWIND $jobs AS job
      MERGE (j:Job {id: job.id})
      SET j.title = job.title, j.location = job.location, j.experience = job.experience
      `,
      { jobs },
    );

    await runQuery(
      session,
      `Merged ${jobs.length} Job-[:BELONGS_TO]->Company relationships`,
      `
      UNWIND $jobs AS job
      MATCH (j:Job {id: job.id})
      MATCH (c:Company {id: job.companyId})
      MERGE (j)-[:BELONGS_TO]->(c)
      `,
      { jobs },
    );

    await runQuery(
      session,
      `Merged ${skillRelations.length} Skill-[:RELATED_TO]->Skill relationships`,
      `
      UNWIND $relations AS rel
      MATCH (from:Skill {id: rel.from})
      MATCH (to:Skill {id: rel.to})
      MERGE (from)-[:RELATED_TO]->(to)
      `,
      { relations: skillRelations },
    );

    await runQuery(
      session,
      `Merged ${userSkills.length} User-[:HAS_SKILL]->Skill relationships`,
      `
      UNWIND $userSkills AS rel
      MATCH (u:User {id: rel.userId})
      MATCH (s:Skill {id: rel.skillId})
      MERGE (u)-[:HAS_SKILL]->(s)
      `,
      { userSkills },
    );

    await runQuery(
      session,
      `Merged ${jobSkills.length} Job-[:REQUIRES]->Skill relationships`,
      `
      UNWIND $jobSkills AS rel
      MATCH (j:Job {id: rel.jobId})
      MATCH (s:Skill {id: rel.skillId})
      MERGE (j)-[:REQUIRES]->(s)
      `,
      { jobSkills },
    );

    await runQuery(
      session,
      `Merged ${applications.length} User-[:APPLIED_TO]->Job relationships`,
      `
      UNWIND $applications AS rel
      MATCH (u:User {id: rel.userId})
      MATCH (j:Job {id: rel.jobId})
      MERGE (u)-[:APPLIED_TO]->(j)
      `,
      { applications },
    );

    const counts = await session.run(`
      MATCH (u:User) WITH count(u) AS users
      MATCH (s:Skill) WITH users, count(s) AS skills
      MATCH (j:Job) WITH users, skills, count(j) AS jobs
      MATCH (c:Company) WITH users, skills, jobs, count(c) AS companies
      RETURN users, skills, jobs, companies
    `);

    const record = counts.records[0];
    console.log("\nSeed completed successfully.");
    console.log(
      `Counts => Users: ${record.get("users")}, Skills: ${record.get("skills")}, Jobs: ${record.get("jobs")}, Companies: ${record.get("companies")}`,
    );
  } finally {
    await session.close();
  }
}

seed()
  .catch((error) => {
    console.error("\nSeed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDriver();
  });
