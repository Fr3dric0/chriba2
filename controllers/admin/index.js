const express = require('express');
const router = express.Router();
const { requireToken } = require('../../middleware/auth');
const { authenticate } = require('./token');
const { register } = require('./register');
const { update } = require('./update');
const { findByUid } = require('./findByUid');
const { remove } = require('./remove');


router.get('/', requireToken, findByUid);
router.post('/token', authenticate);
router.post('/register', register);
router.put('/', requireToken, update);
router.delete('/', requireToken, remove);


module.exports = router;
