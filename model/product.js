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

function saveProduct(product) {

    return new Promise((resolve, reject) => {

        const name = product.name;
        const category = product.category;
        const description = product.description;
        const createdBy = product.createdBy;

        const queryInsert = 'INSERT INTO product (name, category, description, created_by) VALUE (?, ?, ?, ?)';

        dataStore.query(queryInsert, [name, category, description, createdBy]).then(() => {

            resolve()

        }).catch((reason) => {

            reject(reason)

        });

    });

}

function updateProduct(product, id) {

    return new Promise((resolve, reject) => {

        const name = product.name;
        const category = product.category;
        const description = product.description;

        const queryInsert = 'UPDATE product SET name = ?, category = ?, description = ? WHERE id = ?';

        dataStore.query(queryInsert, [name, category, description, id]).then(() => {

            resolve()

        }).catch((reason) => {

            reject(reason)

        });

    })

}

function followUpOrder(order) {

    return new Promise((resolve, reject) => {

        const id = order.id;
        const marketingId = order.marketingId;

        const queryInsert = 'UPDATE product_order SET marketing_id = ? WHERE id = ?';

        dataStore.query(queryInsert, [marketingId, id]).then(() => {

            resolve()

        }).catch((reason) => {

            reject(reason)

        });

    })

}

Module = {
    saveProduct: saveProduct,
    updateProduct: updateProduct,
    getProduct: getProduct,
    followUpOrder: followUpOrder,
    getAllProduct: getAllProduct
};

module.exports = Module;