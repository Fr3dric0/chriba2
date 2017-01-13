const express = require('express');
const router = express.Router();
const { requireToken } = require('../../middleware/auth');
const { authenticate } = require('./token');
const { register } = require('./register');
const { update } = require('./update');

router.get('/', (req, res, next) => {

    res.status(200).json({title: 'Admin'});
});

router.post('/token', authenticate);
router.post('/register', register);
router.put('/', requireToken, update);

module.exports = router;
