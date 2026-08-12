const neo4j = require('neo4j-driver');

const { COGNODB_URI, COGNODB_USERNAME, COGNODB_PASSWORD } = process.env;

if (!COGNODB_URI || !COGNODB_USERNAME || !COGNODB_PASSWORD) {
  throw new Error(
    'Missing CognoDB credentials. Set COGNODB_URI, COGNODB_USERNAME, and COGNODB_PASSWORD in .env'
  );
}

const driver = neo4j.driver(
  COGNODB_URI,
  neo4j.auth.basic(COGNODB_USERNAME, COGNODB_PASSWORD)
);

async function verifyConnection() {
  const session = driver.session();

  try {
    const result = await session.run('RETURN 1 AS result');
    const value = result.records[0].get('result');
    return { ok: true, result: neo4j.isInt(value) ? value.toNumber() : value };
  } finally {
    await session.close();
  }
}

async function closeDriver() {
  await driver.close();
}

module.exports = {
  driver,
  verifyConnection,
  closeDriver,
};
