const express = require('express');
const router = express.Router();
const productModel = require('./../model/product');
const orderModel = require('./../model/order');
const userModel = require('./../model/user');
const authorization = require('./../middleware/authorization');
const bcrypt = require('bcrypt');
const request = require('./../libs/request');
const underscore = require('underscore');
const moment = require('moment');

const firebase = require('./../libs/firebase.js');

function getEmbedUrl(videoUrl) {

    return new Promise((resolve, reject) => {

        const uri = {
            url: 'https://www.youtube.com/oembed',
            qs: {url: videoUrl}
        };

        request(uri).then((result) => {
            resolve(result)
        }).catch((reason) => {
            reject(reason)
        })

    });

}

router.get('/', authorization.checkLogin, authorization.roleAdmin, (req, res, next) => {

    productModel.getAllProduct().then((products) => {

        const auth = req.auth;

        products = underscore.map(products, (item) => {

            item.created_at = moment(item.created_at).add(7, 'hour').format('DD MMMM YYYY HH:mm:ss')

            return item;

        });

        res.render('product/index', {
            auth: auth,
            products: products,
            title: 'Products'
        })

    });

});

router.get('/video/add', authorization.checkLogin, authorization.roleAdmin, (req, res, next) => {

    const auth = req.auth;

    res.render('product/addVideo', {
        auth: auth,
        title: 'Add Product'
    })

});

router.post('/video/add', authorization.checkLogin, authorization.roleAdmin, (req, res, next) => {

    const auth = req.auth;
    const productName = req.body.product_name;
    const productCategory = req.body.product_category;
    const ProductVideos = underscore.map(req.body.videos, video => {
        return getEmbedUrl(video).then((result) => {

            const data = JSON.parse(result.data);
            const html = data.html;
            return html.split(" ")[3].replace('src="', '').replace('"', '');
        })
    });

    Promise.all(ProductVideos).then((resultVideo) => {

        const product = {
            name: productName,
            category: productCategory,
            description: JSON.stringify(resultVideo),
            createdBy: auth.id
        };

        productModel.saveProduct(product).then(() => {

            const dataResult = {
                type: 'success',
                message: 'success save video',
            };

            console.error(dataResult);

            return res.redirect('/product');

        }).catch((reason) => {

            const dataResult = {
                type: 'danger',
                message: 'failed save video ' + reason,
            };

            console.error(dataResult);

            return res.redirect('/product');

        })

    })

});

router.get('/add', authorization.checkLogin, authorization.roleAdmin, (req, res, next) => {

    const auth = req.auth;

    res.render('product/add', {
        auth: auth,
        title: 'Add Product'
    })

});

router.post('/follow_up/:id', authorization.checkLogin, authorization.roleMarketing, (req, res) => {

    const id = req.params.id;
    const auth = req.auth;

    const order = {
      id: id,
      marketingId : auth.id
    };

    productModel.followUpOrder(order).then(() => {

        userModel.getUserByOrder(id).then(user => {
            const registrationToken = user[0].device_token;

            const payload = {
                notification: {
                    title: "Follow up MyBisnis",
                    body: "Marketing kami akan segera melakukan follow up atas produk pesanan anda."
                }
            };

            const options = {
                priority: "high",
                timeToLive: 60 * 60 *24
            };

            if (registrationToken) {

                firebase.admin.messaging().sendToDevice(registrationToken, payload, options)
                  .then(function(response) {
                      console.log("Successfully sent message: \r\n", JSON.stringify(response, null, 4));
                  })
                  .catch(function(error) {
                      console.error("Error sending message:", error);
                  });
            }

        }).catch(reason => {

            console.error('failed send notification.', reason)

        });

        return res.redirect('/')
    }).catch((reason) => {
        console.error(reason);
        return res.redirect('/')
    })

});


router.post('/order/:id/delete', (req, res) => {

    const id = req.params.id;
    const order = {
        id: id
    };

    orderModel.deleteOrdered(order).then(() => {
        return res.redirect('/')
    }).catch((reason) => {
        console.error(reason);
        return res.redirect('/')
    })

});

router.post('/add', authorization.checkLogin, authorization.roleAdmin, (req, res, next) => {


    const auth = req.auth;
    const name = req.body.product_name;
    const category = req.body.product_category;
    const description = req.body.product_description;

    const product = {
        name : name,
        category: category,
        description: description,
        createdBy: auth.id
    };

    productModel.saveProduct(product).then(() => {

        const messageResult = {
            type: 'success',
            message: 'Success add product'
        };
        console.info(JSON.stringify(messageResult, null, 4));
        res.redirect('/product')

    }).catch(reason => {

        const dataResult = {
            type: 'danger',
            message: reason,
        };
        console.error(dataResult);
        return res.redirect('/product');

    });

});

router.get('/:id/edit', authorization.checkLogin, authorization.roleAdmin, (req, res, next) => {

    const id = req.params.id;

    productModel.getProduct(id).then((productResult) => {

        const auth = req.auth;
        const product = JSON.parse(JSON.stringify(productResult[0]));

        return res.render('product/show', {
            auth: auth,
            product: product,
            title: 'Show Product'
        })

    })

});

router.post('/:id/edit', authorization.checkLogin, authorization.roleAdmin, (req, res, next) => {

    const id = req.params.id;
    const name = req.body.product_name;
    const category = req.body.product_category;
    const description = req.body.product_description;

    const product = {
        name: name,
        category: category,
        description: description
    };

    productModel.updateProduct(product, id).then(() => {

        const dataResult = {
            type: 'success',
            message: 'Update Product success.',
        };
        console.error("dataResult ===>", dataResult)
        return res.redirect('/product');

    }).catch(reason => {

        const dataResult = {
            type: 'danger',
            message: reason,
        };
        console.error("reason ====>", reason)
        return res.redirect('/product');

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
