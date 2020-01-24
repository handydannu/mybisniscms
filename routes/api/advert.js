const advertModel = require('./../../model/advert');
const underscore = require('underscore');
const express = require('express');
const router = express.Router();
const config = require('./../../libs/Config')();
const crypto = require('./../../libs/crypto');
const salt = config.salt;

router.get('/', (req, res) => {

    advertModel.getAll().then((advert) => {

        const fullUrl = req.protocol + '://mybisnisapps.com';

        advert = underscore.reduce(advert, (memo, item) => {

            memo.push([fullUrl, 'images', item.advert_image].join('/'));
            return memo
        }, []);

        const messageResult = {
            statusCode: 200,
            message: 'Success get advert.',
            data: advert
        };

        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    }).catch((reason) => {
        const messageResult = {
            statusCode: 500,
            message: 'Failed get data advert. ' + reason,
            data: ''
        };
        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);
    })

});

module.exports = router;