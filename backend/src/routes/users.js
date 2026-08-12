const express = require('express');
const {
  getAllUsers,
  getUserById,
  getSkillsForUser,
  getRecommendedJobsForUser,
} = require('../queries/jobQueries');
const { handleRouteError } = require('../utils/errors');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ status: 'ok', data: users });
  } catch (error) {
    handleRouteError(res, error, 'Failed to fetch users');
  }
});

router.get('/:userId/skills', async (req, res) => {
  const { userId } = req.params;

  if (!userId || !userId.trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'userId route parameter is required',
    });
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: `User not found: ${userId}`,
      });
    }

    const skills = await getSkillsForUser(userId);
    res.json({ status: 'ok', data: { user, skills } });
  } catch (error) {
    handleRouteError(res, error, 'Failed to fetch user skills');
  }
});

router.get('/:userId/recommendations', async (req, res) => {
  const { userId } = req.params;

  if (!userId || !userId.trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'userId route parameter is required',
    });
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: `User not found: ${userId}`,
      });
    }

    const recommendations = await getRecommendedJobsForUser(userId);
    res.json({ status: 'ok', data: { user, recommendations } });
  } catch (error) {
    handleRouteError(res, error, 'Failed to fetch job recommendations');
  }
});

module.exports = router;
