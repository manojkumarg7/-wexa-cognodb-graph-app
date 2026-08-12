require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { verifyConnection, closeDriver } = require('./db/neo4j');
const usersRouter = require('./routes/users');
const skillsRouter = require('./routes/skills');
const jobsRouter = require('./routes/jobs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
  });
});

app.get('/api/health/db', async (req, res) => {
  try {
    const { result } = await verifyConnection();
    res.json({
      status: 'ok',
      message: 'CognoDB connection is healthy',
      result,
    });
  } catch (error) {
    console.error('CognoDB health check failed:', error.message);
    res.status(503).json({
      status: 'error',
      message: 'CognoDB connection failed',
      error: error.message,
    });
  }
});

app.use('/api/users', usersRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/jobs', jobsRouter);

async function startServer() {
  try {
    const { result } = await verifyConnection();
    console.log(`CognoDB connected successfully (RETURN 1 AS result => ${result})`);
  } catch (error) {
    console.error('Failed to connect to CognoDB:', error.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

async function shutdown(signal) {
  console.log(`\n${signal} received. Closing Neo4j driver...`);
  try {
    await closeDriver();
    console.log('Neo4j driver closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error while closing Neo4j driver:', error.message);
    process.exit(1);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
