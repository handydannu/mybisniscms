const dataStore = require('../libs/dataStore');

function getAllProduct() {

    return new Promise((resolve, reject) => {

        const querySelect = 'SELECT * FROM product_view';
        dataStore.query(querySelect).then((resultProduct) => {
            resolve(resultProduct)
        }).catch((reason) => {

            reject('Cant get all product', reason);

        });

    })

}

function getProduct(id) {

    return new Promise((resolve, reject) => {

        const querySelect = 'SELECT * FROM product_view WHERE id = ?';
        dataStore.query(querySelect, [id]).then((resultProduct) => {
            resolve(resultProduct)
        }).catch((reason) => {

            reject('Cant get all product', reason);

        });

    })

}

function getOrderedProduct() {

    return new Promise((resolve, reject) => {

        const querySelect = 'SELECT * FROM ordered';
        dataStore.query(querySelect).then((resultOrdered) => {
            resolve(resultOrdered)
        }).catch((reason) => {

            reject('Cant get all product', reason);

        });

    })

}

function saveOrder(order) {

    return new Promise((resolve, reject) => {

        const productId = order.productId;
        const userId = order.userId;
        const description = order.description;

        const queryInsert = 'INSERT INTO product_order (product_id, user_id, description) VALUE (?, ?, ?)';

        dataStore.query(queryInsert, [productId, userId, description]).then(() => {

            resolve()

        }).catch((reason) => {

            reject(reason)

        });

    });

}

function showOrderByUser(userId) {

    return new Promise((resolve, reject) => {

        const queryInsert = 'SELECT * FROM ordered WHERE user_id = ?';

        dataStore.query(queryInsert, userId).then((selectedOrder) => {

            resolve(selectedOrder)

        }).catch((reason) => {

            reject(reason)

        });

    });

}

function getProductById() {



}

function deleteOrdered(order) {

    return new Promise((resolve, reject) => {

        const query = 'DELETE FROM product_order WHERE id = ?';

        dataStore.query(query, order.id).then(() => {

            resolve()

        }).catch((reason) => {

            reject(reason)

        });

    });

}

Module = {
    saveOrder: saveOrder,
    deleteOrdered: deleteOrdered,
    getOrderedProduct: getOrderedProduct,
    showOrderByUser: showOrderByUser
};

module.exports = Module;