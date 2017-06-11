const { BadRequestError, NotFoundError } = require('restful-node').errors;
const { rm } = require('restful-node').files;

/**
 * Helper function, which removes the thumbnail-reference
 * from the specified model, and from the server
 * @param   req
 * @param   res
 * @param   next
 * @param   {Mongoose}  model
 * @return  {Promise}
 * */
module.exports = async function destroyThumbnail(req, res, next, model) {
    const size = req.query.size || (req.body.size || 'large');
    const path = req.query.path || req.body.path;
    const { name } = req.params;
    
    if (!path) {
        return next(new BadRequestError('Missing required thumbnail-path in url or body'));
    }
    
    let resource;
    try {
        resource = await model.findOne({ name });
    } catch(e) {
        return next(e);
    }
    
    if (!resource || !resource.thumbnails[size]) {
        return next(!resource ?
            new NotFoundError(`Cannot find resource ${name}`) :
            new BadRequestError(`Unknown thumbnails-size: ${size}`)
        );
    }
    
    const idx = resource.thumbnails[size].indexOf(path); // Location of the thumbnail
    
    // Remove the thumbnail from the current document
    if (idx > -1) {
        resource.thumbnails[size].splice(idx, 1);
        
        try {
            await resource.save();
        } catch(e) {
            return next(e);
        }
    }
    
    // The actual file should be removed from the storage
    // independently of it's existence in the document.
    //
    // NOTE - This could result in a file belonging to a different
    //        document being removed.
    //        However, it also prevents unlinked files to
    //        take up space on the server.
    try {
        await rm(path.replace('/', '')); // The '/'-prefix screws with the root location
    } catch(e) {
        // File is not found in root
        if (e.message.includes('ENOENT')) {
            e = new NotFoundError(`Cannot find thumbnail ${path}`);
        }
        
        return next(e);
    }
    
    res.status(200).json(resource); // Could use 204, but client is dependant on an updated
};