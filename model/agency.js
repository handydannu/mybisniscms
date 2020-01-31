const dataStore = require('../libs/dataStore');

function getAgency(id) {

    return new Promise((resolve, reject) => {

        const querySelect = 'SELECT * FROM agency WHERE agency.id = ?';
        dataStore.query(querySelect, [id]).then((resultProduct) => {
            resolve(resultProduct)
        }).catch((reason) => {

            reject('Cant get all product', reason);

        });

    })

}


Module = {
    getAgency: getAgency
};

module.exports = Module;