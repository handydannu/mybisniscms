const express = require('express');
const router = express.Router();
const authorization = require('./../middleware/authorization');
const orderModel = require('./../model/order');
const underscore = require('underscore');
const moment = require('moment');

/* GET home page. */
router.get('/', authorization.checkLogin, (req, res, next) => {


    if (!req.auth) return res.redirect('auth/login');
    const auth = req.auth;


    orderModel.getOrderedProduct().then((ordered) => {

        const productOrder = underscore.map(ordered, (item) => {

            item.follow_up = (item.follow_up) ? "Yes" : "No";
            item.marketing_name = (!item.marketing_name) ? "" : item.marketing_name;
            item.ordered_at = moment(item.ordered_at).add(7, 'hour').format('DD MMMM YYYY HH:mm:ss')

            return item
        });

        return res.render('index', {
            auth: auth,
            title: 'Home',
            ordered: productOrder
        });

    }).catch((reason) => {

        console.error(reason);
        return res.render('index', {
            auth: auth,
            title:'Home',
            ordered: []
        });

    });
});

// router.get('/', authorization.checkLogin, (req, res, next) => {
//
//     res.render('index', {title: 'Express'});
// });

// router.post('send/notification', (req, res, next) {
//     admin.messaging().sendToDevice(registrationToken, payload, options)
//       .then(function(response) {
//           console.log("Successfully sent message:", response);
//       })
//       .catch(function(error) {
//           console.log("Error sending message:", error);
//       });
// })

module.exports = router;
