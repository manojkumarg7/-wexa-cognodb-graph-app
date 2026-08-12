const express = require('express');
const { getAllSkills } = require('../queries/jobQueries');
const { handleRouteError } = require('../utils/errors');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const skills = await getAllSkills();
    res.json({ status: 'ok', data: skills });
  } catch (error) {
    handleRouteError(res, error, 'Failed to fetch skills');
  }
});

module.exports = router;
