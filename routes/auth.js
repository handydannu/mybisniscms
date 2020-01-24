const bcrypt = require('bcrypt');
const crypto = require('./../libs/crypto');
const express = require('express');
const router = express.Router();
const userModel = require('../model/user');

const config = require('./../libs/Config')();
const salt = config.salt;

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    userModel.getUserByEmail(email).then(resultUser => {

        if (resultUser.length < 1 || resultUser[0].type === 'client') {
            const dataResult = {
                type: 'info',
                message: 'Email not exists.',
            };
            return res.render('auth/login', {warning: dataResult});
        }

        const passwordUser = resultUser[0].password;

        if (bcrypt.compareSync(password, passwordUser)) {
            // Passwords match

            const dataUser = {
                "id": resultUser[0].id,
                "email": resultUser[0].email,
                "name": resultUser[0].name,
                "type": resultUser[0].type
            };

            const userEncrypted = crypto.encrypt(JSON.stringify(dataUser), "sessionLogin");

            res.cookie('authToken', userEncrypted);

            return res.redirect('/');

        } else {
            // Passwords don't match

            const dataResult = {
                type: 'info',
                message: 'Passwords don\'t match!'
            };
            return res.render('auth/login', {info: dataResult});
        }


    });

});

// router.get('/register', (req, res) => {
//     res.render('auth/register');
// });

router.post('/register', (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const retypePassword = req.body.retype_password;
    const type = 'client';

    if (password !== retypePassword) {

        const dataResult = {
            type: 'info',
            message: 'Password not same !'
        };

        return res.render('auth/register', {warning: dataResult});

    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const user = {
        name: name,
        email: email,
        password: passwordHash,
        type: type,
        agencyId: 1
    };

    userModel.getUserByEmail(email).then(resultUser => {

        if (resultUser.length > 0) {
            const dataResult = {
                type: 'info',
                message: 'Email already exists.',
            };
            return res.render('auth/register', {warning: dataResult});
        }

        userModel.saveUser(user).then((result) => {

            const dataResult = {
                type: 'success',
                message: 'Registration success.',
            };
            return res.render('auth/register', {success: dataResult});

        }).catch((reason) => {

            const dataResult = {
                type: 'danger',
                message: reason,
            };
            return res.render('auth/register', {success: dataResult});

        });


    }).catch(reason => {

        const dataResult = {
            type: 'danger',
            message: reason,
        };
        return res.render('auth/register', {success: dataResult});

    });


});

router.post('/logout', (req, res) => {

    res.clearCookie('authToken');
    res.redirect('/');

});

router.get('/reset_password', (req, res) => {

    const auth = req.query.q;
    res.render('auth/reset-password', {auth: auth});

});

router.post('/reset_password', (req, res) => {

    console.error(req.body)
    const auth = crypto.decrypt(req.body.auth, salt);
    const password = req.body.password;
    const retypePassword = req.body.retype_password;
    const backURL = req.header('Referer') || '/';

    console.error(retypePassword)
    console.error(password)

    if (password !== retypePassword) {

        const messageResult = {
            statusCode: 500,
            message: 'Password not same.' ,
            data: ''
        };
        console.info(JSON.stringify(messageResult, null, 4));
        return res.redirect(backURL);
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const user = {
        id: auth.id,
        password: passwordHash
    };

    userModel.changePassword(user).then(() => {

        const messageResult = {
            statusCode: 200,
            message: 'Success change password.',
            data: ""
        };

        console.info(JSON.stringify(messageResult, null, 4));

        return res.redirect(backURL);

    }).catch((reason) => {

        const messageResult = {
            statusCode: 500,
            message: 'Failed change password.\r\n' + reason,
            data: ''
        };
        console.info(JSON.stringify(messageResult, null, 4));

        return res.redirect(backURL);

    });

});

module.exports = router;
