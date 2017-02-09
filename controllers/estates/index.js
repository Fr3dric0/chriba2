const express = require('express');
const router = express.Router();
const multer = require('multer');
let uploadFolder = multer({ dest: 'resources/uploads' }); // Video resources should be placed in it's own folder

const { requireToken } = require('../../middleware/auth');
const { create } = require('./create');
const { update } = require('./update');
const { remove } = require('./remove');
const { find } = require('./find');
const upload = require('./fileModifier');

// GET /api/estates
router.get('/', find);
// GET /api/estates/:estate
router.get('/:estate', find);
// POST /api/estates
router.post('/', requireToken, create);
// PUT /api/estates/:estate
router.put('/:estate', requireToken, update);
// POST /api/estates/:estate/img/:size
router.post('/:estate/img/:size', requireToken, uploadFolder.single('thumb'), upload.upload);
// DELETE /api/estates/:estate/img/:size | BODY index
router.delete('/:estate/img/:size', requireToken, upload.remove);
// DELETE /api/estates/:estate
router.delete('/:estate', requireToken, remove);

module.exports = router;
