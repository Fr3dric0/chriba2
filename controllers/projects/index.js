const express = require('express');
const router = express.Router();
const multer = require('multer');
let uploadFolder = multer({ dest: 'resources/uploads' }); // Video resources should be placed in it's own folder

const { requireToken } = require('../../middleware/auth');
const { find } = require('./find');
const { create } = require('./create');
const { update} = require('./update');
const { remove } = require('./remove');
const fileModifier = require('./fileModifier');

// GET /api/projects
router.get('/', find);
// GET /api/projects/:name
router.get('/:name', find);
// POST /api/projects
router.post('/', requireToken, create);
// PUT /api/projects/:name
router.patch('/:name', requireToken, update);
// DELETE /api/projects/:name
router.delete('/:name', requireToken, remove);

// POST /api/estates/:estate/img/:size
router.post('/:name/thumb/:size', requireToken, uploadFolder.single('thumb'), fileModifier.upload);
// DELETE /api/estates/:estate/img/:size | BODY index
router.delete('/:name/thumb/:size', requireToken, fileModifier.remove);
module.exports = router;
