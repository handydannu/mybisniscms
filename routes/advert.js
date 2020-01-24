const multer = require('multer');
const express = require('express');
const router = express.Router();
const authorization = require('./../middleware/authorization');
const advertModel = require('./../model/advert');
const underscore = require('underscore');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + '.jpeg');
    }
});

const upload = multer({ storage: storage }).array('advert',10);

router.get('/', authorization.checkLogin, (req, res) => {
    const auth = req.auth;

    const fullUrl = req.protocol + '://mybisnisapps.com';

    advertModel.getAll().then((adverts) => {

        adverts = underscore.map(adverts, (advert) => {

            return {
                id: advert.id,
                type: advert.type,
                imageUrl : [fullUrl, 'images', advert.advert_image].join('/')
            }

        });

        return res.render('advert/index', {
            title: "Add Advert",
            auth: auth,
            adverts: adverts
        });

    }).catch(() => {

    });

});

router.get('/add', authorization.checkLogin, (req, res) => {
    const auth = req.auth;

    return res.render('advert/add', {
        title: "Add Advert",
        auth: auth
    });

});

router.post('/add', authorization.checkLogin, (req, res) => {

    upload(req,res,function(err) {
        if(err) {
            console.error(JSON.stringify(err, null, 4));
            return res.end("Error uploading file.\n\r" +err);
        }

        req.files.forEach((values, key) => {

            console.error("key :", key, "values: ", values)
            values.type = 'slide';
            values.advertImage = values.filename;
            values.createdBy = req.auth.id;
            advertModel.saveAdvert(values).then(() => {

                res.redirect('/advert');

            }).catch((reason) => {

                res.redirect('/advert')

            })

        });
    });

});

router.post('/:id/delete', authorization.checkLogin, (req, res) => {

    const id = req.params.id;

    advertModel.deleteAdvert(id).then(() => {
        const dataResult = {
            type: 'success',
            message: 'Delete User success.',
        };
        console.info("dataResult ===>", dataResult);
        return res.redirect('/advert');
    }).catch(reason => {

        const dataResult = {
            type: 'danger',
            message: reason,
        };
        console.error(JSON.stringify(dataResult, null, 4));
        return res.redirect('/advert');

    });

});

module.exports = router;