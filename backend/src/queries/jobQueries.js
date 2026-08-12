const { driver } = require('../db/neo4j');

function toPlain(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'object' && typeof value.toNumber === 'function') {
    return value.toNumber();
  }

  if (Array.isArray(value)) {
    return value.map(toPlain);
  }

  if (value && typeof value === 'object' && value.properties) {
    return toPlain(value.properties);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, toPlain(entry)])
    );
  }

  return value;
}

async function runQuery(cypher, params = {}) {
  const session = driver.session();

  try {
    const result = await session.run(cypher, params);
    return result.records.map((record) => {
      const row = {};
      record.keys.forEach((key) => {
        row[key] = toPlain(record.get(key));
      });
      return row;
    });
  } finally {
    await session.close();
  }
}

async function getAllUsers() {
  return runQuery(`
    MATCH (u:User)
    RETURN u.id AS id, u.name AS name, u.email AS email
    ORDER BY u.name
  `);
}

async function getUserById(userId) {
  const rows = await runQuery(
    `
    MATCH (u:User {id: $userId})
    RETURN u.id AS id, u.name AS name, u.email AS email
    `,
    { userId }
  );

  return rows[0] || null;
}

async function getAllSkills() {
  return runQuery(`
    MATCH (s:Skill)
    RETURN s.id AS id, s.name AS name, s.category AS category
    ORDER BY s.name
  `);
}

async function getJobById(jobId) {
  const rows = await runQuery(
    `
    MATCH (j:Job {id: $jobId})-[:BELONGS_TO]->(c:Company)
    OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)
    WITH j, c, collect(DISTINCT s { .id, .name, .category }) AS requiredSkills
    RETURN
      j.id AS jobId,
      j.title AS title,
      j.location AS location,
      j.experience AS experience,
      c.id AS companyId,
      c.name AS companyName,
      c.industry AS industry,
      [skill IN requiredSkills WHERE skill IS NOT NULL] AS requiredSkills
    `,
    { jobId }
  );

  return rows[0] || null;
}

async function getAllJobsWithCompanies() {
  return runQuery(`
    MATCH (j:Job)-[:BELONGS_TO]->(c:Company)
    RETURN
      j.id AS jobId,
      j.title AS title,
      j.location AS location,
      j.experience AS experience,
      c.id AS companyId,
      c.name AS companyName,
      c.industry AS industry
    ORDER BY j.title
  `);
}

async function getSkillsForUser(userId) {
  return runQuery(
    `
    MATCH (u:User {id: $userId})-[:HAS_SKILL]->(s:Skill)
    RETURN s.id AS id, s.name AS name, s.category AS category
    ORDER BY s.name
    `,
    { userId }
  );
}

async function getJobsMatchingUserSkills(userId) {
  return runQuery(
    `
    MATCH (u:User {id: $userId})-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES]-(j:Job)
    WITH j, collect(DISTINCT s { .id, .name, .category }) AS matchingSkills
    RETURN
      j.id AS jobId,
      j.title AS title,
      j.location AS location,
      j.experience AS experience,
      matchingSkills,
      size(matchingSkills) AS matchCount
    ORDER BY matchCount DESC, j.title
    `,
    { userId }
  );
}

async function getRelatedSkills(skillId) {
  return runQuery(
    `
    MATCH (s:Skill {id: $skillId})-[:RELATED_TO]->(related:Skill)
    RETURN
      s.id AS skillId,
      s.name AS skillName,
      related.id AS relatedSkillId,
      related.name AS relatedSkillName,
      related.category AS relatedCategory
    ORDER BY related.name
    `,
    { skillId }
  );
}

async function getUserSkillJobCompanyGraph(userId) {
  return runQuery(
    `
    MATCH (u:User {id: $userId})-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES]-(j:Job)-[:BELONGS_TO]->(c:Company)
    RETURN
      u.id AS userId,
      u.name AS userName,
      s.id AS skillId,
      s.name AS skillName,
      j.id AS jobId,
      j.title AS jobTitle,
      c.id AS companyId,
      c.name AS companyName
    ORDER BY j.title, s.name
    `,
    { userId }
  );
}

async function getRecommendedJobsForUser(userId) {
  return runQuery(
    `
    MATCH (u:User {id: $userId})-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES]-(j:Job)-[:BELONGS_TO]->(c:Company)
    OPTIONAL MATCH (s)-[:RELATED_TO]->(related:Skill)
    WITH
      u,
      j,
      c,
      collect(DISTINCT s { .id, .name, .category }) AS matchingSkills,
      collect(DISTINCT related { .id, .name, .category }) AS relatedSkills
    RETURN
      u.id AS userId,
      u.name AS userName,
      j.id AS jobId,
      j.title AS jobTitle,
      j.location AS location,
      j.experience AS experience,
      c.id AS companyId,
      c.name AS companyName,
      c.industry AS industry,
      matchingSkills,
      [skill IN relatedSkills WHERE skill IS NOT NULL] AS relatedSkills,
      size(matchingSkills) AS matchCount
    ORDER BY matchCount DESC, j.title
    `,
    { userId }
  );
}

module.exports = {
  getAllUsers,
  getUserById,
  getAllSkills,
  getJobById,
  getAllJobsWithCompanies,
  getSkillsForUser,
  getJobsMatchingUserSkills,
  getRelatedSkills,
  getUserSkillJobCompanyGraph,
  getRecommendedJobsForUser,
};
