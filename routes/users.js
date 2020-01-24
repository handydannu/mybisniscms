const express = require('express');
const router = express.Router();
const userModel = require('./../model/user');
const authorization = require('./../middleware/authorization');
const bcrypt = require('bcrypt');

router.get('/', authorization.checkLogin, authorization.roleAdmin, (req, res, next) => {

    userModel.getAllUser().then((users) => {

        const auth = req.auth;

        res.render('user/index', {
            auth: auth,
            users: users,
            title: 'Users'
        })

    });

});

router.get('/add', authorization.checkLogin, authorization.roleAdmin, (req, res, next) => {

    userModel.getAllUser().then((users) => {

        const auth = req.auth;

        userModel.getAgency().then((agencies) => {

            return res.render('user/add', {
                auth: auth,
                users: users,
                agencies: agencies,
                title: 'Users'
            })

        }).catch((reason) => {

            console.error(reason);
            return res.redirect('/user');

        });

    }).catch((reason) => {

        console.error(reason);
        return res.redirect('user');

    });

});

router.post('/', authorization.checkLogin, authorization.roleAdmin, (req, res, next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const retypePassword = req.body.retype_password;
    const phone = req.body.phone;
    const agencyId = req.body.agency_id;
    const type = req.body.type;

    req.flash('success', 'This is a flash message using the express-flash module.');
    req.session.sessionFlash = {
        type: 'success',
        message: 'This is a flash message using custom middleware and express-session.'
    };

    if (password !== retypePassword) {

        const dataResult = {
            type: 'info',
            message: 'Password not same !'
        };

        console.error("dataResult ===>",dataResult)

        return res.redirect('/user');

    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const user = {
        name: name,
        email: email,
        type: type,
        agencyId: agencyId,
        password: passwordHash,
        phone: phone
    };

    userModel.getUserByEmail(email).then(resultUser => {

        if (resultUser.length > 0) {
            const dataResult = {
                type: 'info',
                message: 'Email already exists.',
            };

            console.error(dataResult)

            return res.redirect('/user');
        }

        console.error("user ===>", user)

        userModel.saveUser(user).then(() => {

            const dataResult = {
                type: 'success',
                message: 'success add user.',
            };
            console.error(dataResult);
            return res.redirect('/user');

        }).catch((reason) => {

            const dataResult = {
                type: 'danger',
                message: reason,
            };
            console.error(dataResult)
            return res.redirect('/user');

        });


    }).catch(reason => {

        const dataResult = {
            type: 'danger',
            message: reason,
        };
        console.error(dataResult)
        return res.redirect('/user');

    });

});

router.get('/:id/edit', authorization.checkLogin, authorization.roleAdmin, (req, res, next) => {

    const id = req.params.id;

    userModel.getUserById(id).then((userResult) => {

        const auth = req.auth;
        const user = JSON.parse(JSON.stringify(userResult[0]));

        userModel.getAllUser().then((users) => {

            res.render('user/edit', {
                auth: auth,
                user: user,
                users: users,
                title: 'Update Users'
            })

        })

    })

});

router.put('/:id', authorization.checkLogin, (req, res, next) => {

    const id = req.params.id;
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;

    const user = {
        id: id,
        name: name,
        email: email,
        phone: phone
    };

    userModel.updateUser(user).then(() => {

        const dataResult = {
            type: 'success',
            message: 'Registration success.',
        };
        console.error("dataResult ===>", dataResult)
        return res.redirect('/user');

    }).catch(reason => {

        const dataResult = {
            type: 'danger',
            message: reason,
        };
        return res.redirect('/user');

    });

});

router.post('/:id/delete', authorization.checkLogin, (req, res) => {


    const id = req.params.id;

    userModel.deleteUser(id).then(() => {
        const dataResult = {
            type: 'success',
            message: 'Delete User success.',
        };
        console.info("dataResult ===>", dataResult);
        return res.redirect('/user');
    }).catch(reason => {

        const dataResult = {
            type: 'danger',
            message: reason,
        };
        console.error(JSON.stringify(dataResult, null, 4));
        return res.redirect('/user');

    });

});

router.put('/:id/password', authorization.checkLogin, (req, res, next) => {

    const id = req.params.id;
    const password = req.body.password;
    const retypePassword = req.body.retypePassword;


    if (password !== retypePassword) return res.send('password not same')

    const passwordHash = bcrypt.hashSync(password, 10);

    const user = {
        id: id,
        password: passwordHash
    };

    userModel.changePassword(user).then(() => {

        const dataResult = {
            type: 'success',
            message: 'Registration success.',
        };
        return res.redirect('/user');

    }).catch(reason => {

        const dataResult = {
            type: 'danger',
            message: reason,
        };
        console.error("reason ====>", reason)
        return res.redirect('/user');

    });

});

module.exports = router;
