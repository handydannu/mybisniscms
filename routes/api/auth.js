const bcrypt = require('bcrypt');
const config = require('./../../libs/Config')();
const crypto = require('./../../libs/crypto');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authorization = require('./../../middleware/authorization');
const userModel = require('./../../model/user');
const underscore = require('underscore');
const nodemailer = require('nodemailer');

const userEmail = 'mybisnisindonesia2018@gmail.com'; //bisnisjabar2011@gmail.com
const passwordEmail = '@dmin123'; //jeruknipis46b

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: userEmail,
        pass: passwordEmail
    }
});

const salt = config.salt;

router.post('/login', (req, res) => {

    const data = req.body.data;

    try {
        const auth = crypto.decrypt(data, salt);
        const email = auth.email;
        const password = auth.password;

        userModel.getUserByEmail(email).then(resultUser => {

            if (resultUser.length < 1) {

                const messageResult = {
                    statusCode: 502,
                    message: 'Email not exists.',
                    data: []
                };

                const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);
                return res.send(messageEncrypted);
            }

            const passwordUser = resultUser[0].password;

            if (bcrypt.compareSync(password, passwordUser)) {

                let dataUser = {
                    "id": resultUser[0].id,
                    "email": resultUser[0].email,
                    "name": resultUser[0].name
                };

                dataUser.token = jwt.sign(underscore.clone(dataUser), salt, {
                    expiresIn: 86400 * 30 // expires in 30 * 24 hours
                });

                const messageResult = {
                    statusCode: 200,
                    message: 'Success login.',
                    data: dataUser
                };

                const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

                return res.send(messageEncrypted);

            } else {

                const messageResult = {
                    statusCode: 502,
                    message: 'Passwords don\'t match!',
                    data: []
                };
                const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);
                return res.send(messageEncrypted);
            }

        }).catch((reason) => {

            const messageResult = {
                statusCode: 502,
                message: 'Email not exists ' + reason,
                data: []
            };

            const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);
            return res.send(messageEncrypted);

        });

    } catch (reason) {
        const messageResult = {
            statusCode: 502,
            message: 'Fail to decrypt ' + reason,
            data: []
        };

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);
        return res.send(messageEncrypted);

    }

});

router.post('/login_sosmed', (req, res) => {

    const data = crypto.decrypt(req.body.data, salt);
    const email = data.email;
    const name = data.name;
    const socialMedia = data.social_media;
    const picture = data.picture;

    userModel.getUserByEmail(email).then(resultUser => {

        if (resultUser.length < 1) {

            userModel.saveUser({

                name: name,
                email: email,
                picture: picture,
                type: 'client'

            }).then((result) => {

                let dataUser = {
                    "id": result.insertId,
                    "email": email,
                    "name": name
                };

                dataUser.token = jwt.sign(underscore.clone(dataUser), salt, {
                    expiresIn: 86400 * 30 // expires in 30 * 24 hours
                });

                const messageResult = {
                    statusCode: 200,
                    message: 'Success login.',
                    data: dataUser
                };

                const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

                return res.send(messageEncrypted);

            }).catch((reason) => {

                const messageResult = {
                    statusCode: 501,
                    message: reason,
                    data: ''
                };
                const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);
                return res.send(messageEncrypted);

            });

        } else if (resultUser.length === 1) {

            let dataUser = {
                "id": resultUser[0].id,
                "email": resultUser[0].email,
                "name": resultUser[0].name
            };

            dataUser.token = jwt.sign(underscore.clone(dataUser), salt, {
                expiresIn: 86400 * 30 // expires in 30 * 24 hours
            });

            const messageResult = {
                statusCode: 200,
                message: 'Success login.',
                data: dataUser
            };

            const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

            return res.send(messageEncrypted);

        } else {

            const messageResult = {
                statusCode: 502,
                message: 'Email not match ',
                data: ""
            };

            const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);
            return res.send(messageEncrypted);

        }

    }).catch((reason) => {

        const messageResult = {
            statusCode: 502,
            message: 'Email not exists ' + reason,
            data: ""
        };

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);
        return res.send(messageEncrypted);

    });

});

router.post('/register', (req, res) => {

    const data = req.body.data;
    const userRegis = crypto.decrypt(data, salt);
    const name = userRegis.name;
    const email = userRegis.email;
    const password = userRegis.password;
    const address = userRegis.address;
    const phone = userRegis.phone;
    const agencyId = userRegis.city;
    const company = userRegis.company;
    const type = 'client';

    const passwordHash = bcrypt.hashSync(password, 10);

    const user = {
        name: name,
        email: email,
        password: passwordHash,
        type: type,
        address: address,
        phone: phone,
        agencyId: agencyId,
        company: company
    };

    userModel.getUserByEmail(email).then(resultUser => {

        if (resultUser.length > 0) {
            const messageResult = {
                statusCode: 501,
                message: 'Email already exists.',
            };
            console.error(JSON.stringify(messageResult, null, 4));
            const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);
            return res.send(messageEncrypted);
        }

        userModel.saveUser(user).then((result) => {

            const messageResult = {
                statusCode: 200,
                message: 'Registration success.',
            };
            const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);
            console.error(JSON.stringify(messageResult, null, 4));
            return res.send(messageEncrypted);

        }).catch((reason) => {

            const messageResult = {
                statusCode: 501,
                message: reason,
            };
            console.error(JSON.stringify(messageResult, null, 4));
            const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);
            return res.send(messageEncrypted);

        });


    }).catch(reason => {

        const messageResult = {
            statusCode: 501,
            message: reason,
        };
        console.error(JSON.stringify(messageResult, null, 4));
        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);
        return res.send(messageEncrypted);

    });


});

router.get('/me', authorization.verifyToken, (req, res) => {

    const messageResult = {
        statusCode: 500,
        message: 'Failed to authenticate user.'
    };

    const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

    return res.send(messageEncrypted);

});

router.post('/logout', (req, res) => {

    res.clearCookie('authToken');
    res.redirect('/');

});

router.post('/forgot_password', (req, res) => {

    const data = crypto.decrypt(req.body.data, salt);
    const email = data.email;

    userModel.getUserByEmail(email).then(resultUser => {

        if (resultUser.length < 1) {

            const messageResult = {
                statusCode: 502,
                message: 'Email not exists.',
                data: ''
            };

            const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);
            return res.send(messageEncrypted);
        }

        const dataUser = {
            "id": resultUser[0].id,
            "email": resultUser[0].email,
            "name": resultUser[0].name
        };

        const dataEncrypted = crypto.encrypt(JSON.stringify(dataUser), salt);

        const fullUrl = req.protocol + '://mybisnis.bisnishotel.com';
        const mainUrl = [fullUrl, 'auth', 'reset_password'].join('/')

        const mailOptions = {
            from: userEmail, // sender address
            to: resultUser[0].email, // list of receivers
            subject: 'Reset Your Password.', // Subject line
            html: '<p>Klik url untuk reset password ' + mainUrl + '?q=' + dataEncrypted + '</p>'// plain text body
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.error(err);
                const messageResult = {
                    statusCode: 502,
                    message: 'Failed send email.',
                    data: ''
                };

                const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);
                return res.send(messageEncrypted);
            }
            else {
                console.log(info);
                const messageResult = {
                    statusCode: 200,
                    message: 'Success send email.',
                    data: dataUser
                };

                const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

                return res.send(messageEncrypted);
            }


        });

    }).catch((reason) => {

        const messageResult = {
            statusCode: 502,
            message: 'Email not exists ' + reason,
            data: []
        };

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);
        return res.send(messageEncrypted);

    });

});

module.exports = router;
