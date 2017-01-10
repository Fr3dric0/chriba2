

module.exports = {
    single: [
        verifyInput,
        generateFileName,
        moveFile,
        saveData
    ]
};

function verifyInput (req, res, next) {
    const { uploader, file } = req;
    const { size } = req.body;

    if (!uploader) {
        const err = new Error('Missing property "uploader" on request object');
        return next(err);
    }

    if (!file) {
        const err = new Error('Missing "file" object. Ensure file is uploaded');
        return next(err);
    }

    const { provider } = uploader;

    if (!provider) {
        const err = new Error('Missing property "provider" in uploader object');
        return next(err);
    }

    if (!size) {
        const err = new Error('Missing "size" property in req.body');
        err.status = 400;
        return next(err);
    }

    next();
}

function generateFileName (req, res, next) {

    next();
}

function moveFile (req, res, next) {

    next();
}

function saveData (req, res, next) {

    next();
}