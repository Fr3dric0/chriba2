const express = require('express');
const router = express.Router();
const { notFound } = require('../middleware/error');

// GET /api
router.get('/', (req, res, next) => {
    res.status(200).json({ title: 'Hello world' });
});

/////////////////////////////
//      404 API-ERROR      //
/////////////////////////////
router.all('*', notFound);

module.exports = router;
