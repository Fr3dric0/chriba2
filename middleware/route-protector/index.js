const jwt = require('jsonwebtoken');
const path = require('path');

const BannedRoute = require('../../models/bannedRoute');
const Blacklisted = require('../../models/blacklisted');

let allowToken = false;
let deniedFile;

function setup(options) {

    allowToken = options.allowTokenBearer;
    deniedFile = options.deniedFile;

    return protect;
}

const protect = [
    checkAuthToken,
    blockBanned,
    checkPath,
    blacklist
];

function checkAuthToken (req, res, next) {
    // Reset state
    req.blacklist = {
        allowed: false,
        banned: false,
        search: undefined,
        client: undefined
    };

    if (!allowToken) {
        return next();
    }

    checkToken(req, req.config['token-secret'])
        .then((result) => {
            req.blacklist.allowed = true;
            next();
        })
        .catch( err => {
            req.blacklist.allowed = false;
            next();
        }) // Jump to next frame
}

function blockBanned (req, res, next) {
    if (req.blacklist.allowed) { // Allowed can proceed
        return next();
    }

    Blacklisted.isBanned(req.ip)
        .then(({banned, client}) => {
            if (banned) {
                return sendBlock(res);
            }
            req.blacklist.client = client;
            next();
        })
        .catch(err => {
            next(err)
        });
}

/**
 * Checks if the path is an illeagal path,
 * if not. The route is cleared.
 * Else, we proceed through the chain
 *
 * */
function checkPath (req, res, next) {
    if (req.blacklist.allowed) {
        return next();
    }

    const url = cleanUrl(req.originalUrl);

    BannedRoute.search(url)
        .then((result) => {
            // If the route is not blacklisted,
            // the request can safely continue
            if (!result) {
                req.blacklist.allowed = true;
            }
            req.blacklist.search = result;
            next();
        })
        .catch(err => next(err));
}

/**
 * If we have reached this function, it means the client is not banned,
 * but have tries to reach a blacklisted page
 *
 * */
function blacklist (req, res, next) {
    const { allowed, search, client} = req.blacklist;

    if (allowed || !search) {
        return next();
    }

    if (client) {
        // If the client already exists we increment that
        Blacklisted.addAttempt(client._id, client)
            .then((result) => {
                if (result.banned) {
                    return sendBlock(res);
                }

                req.blacklist.client = result.client;
                next();
            })
            .catch(err => next(err));
    } else {
        Blacklisted.create({
            ip: req.ip,
            banned: false,
            route: search._id
        })
            .then((client) => {
                req.blacklist.client = client;
                next();
            })
            .catch(err => next(err));
    }
}



/**
 * Checks if the request has provided a valid
 * 'Authorization' token. We let him through
 * */
function checkToken (req, secret) {
    return new Promise((rsv, rr) => {
        if (!secret) {
            return rr(new Error('Missing token-secret'));
        }

        const token = req.body.token ||
            req.query.token ||
            req.headers['x-access-token'] ||
            req.headers['authorization'];

        // If the client has no token
        // we won't allow it to skip past the protect function
        if (!token) {
            return rr(new Error('No token to verify'));
        }

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return rr(err);
            }

            console.log('decoded: ' + decoded);
            rsv(true);
        });
    });
}

/**
 * @param   {string}    url
 * Remove unecessary parts such as the query parameters
 *
 * @return  {string}    cleaned url
 * */
function cleanUrl (url) {

    // Remove query params
    return url.split('?')[0];
}

function sendBlock (res) {
    res.status(418);

    if (deniedFile) {
        res.sendFile(deniedFile);
    } else {
        res.send();
    }

}

module.exports = setup;