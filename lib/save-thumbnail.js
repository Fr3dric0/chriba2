const { BadRequestError, NotFoundError } = require('restful-node').errors;
const { rm } = require('restful-node').files;

/**
 * Helper function. Adds the thumb the the root-folder,
 * and saves a url to the model.
 * @param   req
 * @param   res
 * @param   next
 * @param   model
 * @return {Promise}
 * */
module.exports = async function saveThumbnail (req, res, next, model) {
    if (!req.file) {
        return next(new BadRequestError('No file to upload'));
    }
    
    const size = req.query.size || (req.body.size || 'large');
    const { name } = req.params;
    
    let resource;
    try {
        resource = await model.findOne({ name });
    } catch(e) {
        return next(e);
    }
    
    if (!resource) {
        try {
            await rm(req.file.path);
        } catch(e) {
            return next(e);
        }
        
        return next(new NotFoundError(`Cannot upload to unknown resource ${name}`));
    }
    
    // Ensure thumbnails exists
    if (!resource.thumbnails) {
        resource.thumbnails = {large: [], small: []};
    }
    
    // Prevent duplicates
    if (resource.thumbnails[size].includes(`/${req.file.path}`)) {
        return next(new BadRequestError(`File ${req.file.path} already exists on estate ${resource.name}`));
    }
    
    // Place thumbnail in correct location
    resource.thumbnails[size].push(`/${req.file.path}`);
    
    resource.save()
        .then(e => res.status(200).json(e))
        .catch(err => next(err));
};