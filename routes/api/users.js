const express = require('express');
const router = express.Router();
const userModel = require('./../../model/user');
const authorization = require('./../../middleware/authorization');
const crypto = require('./../../libs/crypto');
const bcrypt = require('bcrypt');
const config = require('./../../libs/Config')();
const salt = config.salt;
const Underscore = require('underscore');
const fs = require('fs');


router.get('/me', authorization.verifyToken, (req, res, next) => {

    const auth = req.auth;

    userModel.getUserById(auth.id).then((user) => {

        user = JSON.parse(JSON.stringify(user));

        const messageResult = {
            statusCode: 200,
            message: 'Success get data user.',
            data: {
                id: user[0].id,
                name: user[0].name,
                email: user[0].email,
                address: user[0].address,
                company: user[0].company,
                phone: user[0].phone,
                agency_id: user[0].agency_id,
                picture: user[0].picture,
                website: user[0].website
            }
        };

        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    }).catch((reason) => {
        const messageResult = {
            statusCode: 500,
            message: 'Failed get data user. ' + reason,
        };
        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);
    });

});

router.post('/update', authorization.verifyToken, (req, res, next) => {

    const auth = req.auth;

    const data = req.body.data;
    const dataDecrypt = crypto.decrypt(data, salt);

    const user = {
        id: auth.id,
        name: dataDecrypt.name,
        email: dataDecrypt.email,
        address: dataDecrypt.address,
        agencyId: dataDecrypt.agencyId,
        company: dataDecrypt.company,
        phone: dataDecrypt.phone,
        website: dataDecrypt.website
    };

    userModel.updateUser(user).then(() => {

        const messageResult = {
            statusCode: 200,
            message: 'Success update data user.',
            data: []
        };

        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    }).catch((reason) => {

        const messageResult = {
            statusCode: 500,
            message: 'Failed update data user. ' + reason,
            data: ''
        };

        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);
    });

});

router.post('/token', authorization.verifyToken, (req, res, next) => {

    const auth = req.auth;

    const data = req.body.data;
    const dataDecrypt = crypto.decrypt(data, salt);

    const user = {
        id: auth.id,
        token: dataDecrypt.token
    };

    userModel.updateToken(user).then(() => {

        const messageResult = {
            statusCode: 200,
            message: 'Success save device token.',
            data: []
        };

        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    }).catch((reason) => {

        const messageResult = {
            statusCode: 500,
            message: 'Failed save devica token. ' + reason,
            data: ''
        };

        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);
    });

});

router.get('/agency', (req, res) => {

    userModel.getAgency().then((agency) => {

        const newAgency = Underscore.map(agency, (item) => {

            return {
                id: item.id,
                name: item.name
            }
        });

        const messageResult = {
            statusCode: 200,
            message: 'Success get data user.',
            data: newAgency
        };

        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    }).catch((reason) => {
        const messageResult = {
            statusCode: 500,
            message: 'Failed get data agency. ' + reason,
            data: ''
        };
        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);
    })

});

router.post('/password', authorization.verifyToken, (req, res, next) => {

    const auth = req.auth;

    const data = crypto.decrypt(req.body.data, salt);
    const password = data.password;
    const retypePassword = data.retypePassword;


    if (password !== retypePassword) {
        const messageResult = {
            statusCode: 500,
            message: 'password not same',
            data: ''
        };
        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);
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

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    }).catch((reason) => {

        const messageResult = {
            statusCode: 500,
            message: 'Failed change password.\r\n' + reason,
            data: ''
        };
        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    });

});

router.post('/picture', authorization.verifyToken, (req, res) => {

    const auth = req.auth;
    const data = crypto.decrypt(req.body.data, salt);
    const picture = data.picture;
    const fullUrl = req.protocol + '://mybisnis.bisnishotel.com';

    const base64Data = picture.replace(/^data:image\/png;base64,/, "");
    const fileName = auth.email + "-" + new Date().getTime() +".jpg";
    fs.writeFileSync("./public/images/"+ fileName, base64Data, 'base64');

    const user = {
        id: auth.id,
        picture : [fullUrl, 'images', fileName].join('/')
    };

    userModel.updatePicture(user).then((userResult) => {

        const messageResult = {
            statusCode: 200,
            message: 'Success change profile picture.',
            data: userResult
        };

        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    }).catch((reason) => {

        const messageResult = {
            statusCode: 500,
            message: 'Failed change profile picture.\r\n' + reason,
            data: ''
        };
        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    })


});

module.exports = router;
