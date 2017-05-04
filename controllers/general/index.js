const express = require('express');
const router = express.Router();
const { requireToken } = require('../../middleware/auth');
const { update } = require('./update');
const { find } = require('./find');

// GET /api/general
router.get('/', find);
// PUT /api/general
router.patch('/', requireToken, update);

module.exports = router;
