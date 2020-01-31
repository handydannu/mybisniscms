const jwt = require('jsonwebtoken');
const underscore = require('underscore');
const config = require('./../config');
const crypto = require('./../libs/crypto');
const userModel = require('./../model/user');

const salt = config.salt;

function verifyToken(req, res, next) {

    const token = req.headers['x-access-token'];
    const email = req.headers['x-email'];

    if (!token) {

        const messageResult = {
            statusCode: 401,
            message: 'No token provided.',
            data: ''
        };

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    }

    jwt.verify(token, salt, (err, decoded) => {

        if (err) {

            const messageResult = {
                statusCode: 500,
                message: 'Failed to authenticate token.'
            };

            console.error(JSON.stringify(messageResult, null, 4));

            const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

            return res.send(messageEncrypted);
        }


        userModel.getUserById(decoded.id).then((selectedUser) => {

            if (email !== selectedUser[0].email) {

                const messageResult = {
                    statusCode: 500,
                    message: 'Failed to authenticate user.'
                };

                const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

                return res.send(messageEncrypted);

            }

            req.auth = decoded;

            next()

        }).catch((reason) => {

            const messageResult = {
                statusCode: 500,
                message: 'There was a problem finding the user ' + reason
            };

            const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

            return res.send(messageEncrypted);

        });

    });

}

function checkLogin(req, res, next) {
    const authToken = req.cookies.authToken;

    if (!authToken) {
        const dataResult = {
            type: 'info',
            message: 'Your session timeout.',
        };
        return res.render('auth/login', {warning: dataResult});
    }

    req.auth = crypto.decrypt(authToken, 'sessionLogin');

    next()

}

function roleAdmin(req, res, next) {

    const auth = req.auth;

    if (!auth.type === 'admin') return res.redirect('/');

    next()
}

function roleMarketing(req, res, next) {

    const auth = req.auth;

    if (!auth.type === 'marketing') return res.redirect('/');

    next()

}

Module = {
    verifyToken: verifyToken,
    checkLogin: checkLogin,
    roleMarketing: roleMarketing,
    roleAdmin: roleAdmin
};
module.exports = Module;