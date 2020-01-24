const config = require('./../../libs/Config')();
const crypto = require('./../../libs/crypto');
const authorization = require('./../../middleware/authorization');
const express = require('express');
const router = express.Router();
const productModel = require('./../../model/product');
const orderModel = require('./../../model/order');
const underscore = require('underscore');

const salt = config.salt;

router.get('/my_order', authorization.verifyToken, (req, res) => {

    const auth = req.auth;

    orderModel.showOrderByUser(auth.id).then((resultOrder) => {

        const messageResult = {
            statusCode: 200,
            message: 'Success get order product.',
            data: underscore.map(resultOrder, (item) => {
                delete item.ordered_at;
                return item
            })
        };

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    }).catch((reason) => {

        const messageResult = {
            statusCode: 501,
            message: 'Failed get order product. \r\n' + reason ,
        };

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    })

});

// get product
router.get('/:id', (req, res) => {

    const id = req.params.id;

    productModel.getProduct(id).then((product) => {

        const messageResult = {
            statusCode: 200,
            message: 'Success get data product.',
            data: product[0].description
        };

        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    }).catch((reason) => {

        const messageResult = {
            statusCode: 200,
            message: 'Failed get data product. ' +reason,
        };

        console.error(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    })


});

router.get('/video/:id', (req, res) => {

    const id = req.params.id;

    productModel.getProduct(id).then((product) => {

        const messageResult = {
            statusCode: 200,
            message: 'Success get data product.',
            data: JSON.parse(product[0].description)
        };

        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    }).catch((reason) => {

        const messageResult = {
            statusCode: 200,
            message: 'Failed get data product. ' +reason,
        };

        console.error(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    })


});

router.post('/:id/order', authorization.verifyToken, (req, res) => {

    const productId = req.params.id;
    const auth = req.auth;
    const data = crypto.decrypt(req.body.data, salt);

    const order = {
        productId: productId,
        userId: auth.id,
        description : data.description
    };

    orderModel.saveOrder(order).then(() => {

        const messageResult = {
            statusCode: 200,
            message: 'Success order product.',
        };

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    }).catch((reason) => {

        const messageResult = {
            statusCode: 501,
            message: 'Failed order product. \r\n' + reason ,
        };

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    })

});

router.post('/ordered/delete', authorization.verifyToken, (req, res) => {

    const data = crypto.decrypt(req.body.data, salt);

    const ordered = {
        id : data.order_id
    };

    orderModel.deleteOrdered(ordered).then(() => {

        const messageResult = {
            statusCode: 200,
            message: 'Success delete order.',
            data: ""
        };

        console.info(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    }).catch((reason) => {

        const messageResult = {
            statusCode: 500,
            message: 'Failed delete ordered. ' +reason,
        };

        console.error(JSON.stringify(messageResult, null, 4));

        const messageEncrypted = crypto.encrypt(JSON.stringify(messageResult), salt);

        return res.send(messageEncrypted);

    })

});

module.exports = router;
