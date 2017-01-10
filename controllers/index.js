const express = require('express');
const router = express.Router();

// GET /api
router.get('/', (req, res, next) => {
    res.status(200).json({ title: 'Hello world' });
});


/////////////////////////////
//      404 API-ERROR      //
/////////////////////////////
router.get('*', (req, res, next) => {
    const err = new Error(`Cannot find route ${req.url}`);
    err.status = 404;
    next(err);
});

module.exports = router;
