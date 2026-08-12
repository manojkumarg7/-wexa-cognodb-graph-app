const express = require('express');
const { getAllJobsWithCompanies, getJobById } = require('../queries/jobQueries');
const { handleRouteError } = require('../utils/errors');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const jobs = await getAllJobsWithCompanies();
    res.json({ status: 'ok', data: jobs });
  } catch (error) {
    handleRouteError(res, error, 'Failed to fetch jobs');
  }
});

router.get('/:jobId', async (req, res) => {
  const { jobId } = req.params;

  if (!jobId || !jobId.trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'jobId route parameter is required',
    });
  }

  try {
    const job = await getJobById(jobId);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: `Job not found: ${jobId}`,
      });
    }

    res.json({ status: 'ok', data: job });
  } catch (error) {
    handleRouteError(res, error, 'Failed to fetch job details');
  }
});

module.exports = router;
