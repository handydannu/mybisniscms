const dataStore = require('../libs/dataStore');

function saveAdvert(advert) {

    return new Promise((resolve, reject) => {

        const advertImage = advert.advertImage;
        const type = advert.type;
        const createdBy = advert.createdBy;

        const queryInsert = 'INSERT INTO advert (advert_image, type, created_by) VALUE (?, ?, ?)';

        dataStore.query(queryInsert, [advertImage, type, createdBy]).then((resultInsert) => {

            resolve(resultInsert)

        }).catch((reason) => {

            reject(reason)

        });

    });

}

function deleteAdvert(id) {

    return new Promise((resolve, reject) => {


        const queryInsert = 'DELETE FROM advert WHERE id = ?';

        dataStore.query(queryInsert, [id]).then((resultInsert) => {

            resolve(resultInsert)

        }).catch((reason) => {

            reject(reason)

        });

    });

}

function getAll() {

    return new Promise((resolve, reject) => {

        const query = 'SELECT * FROM advert';

        dataStore.query(query).then((result) => {

            resolve(result)

        }).catch((reason) => {

            reject(reason)

        });

    });

}

Module = {
    saveAdvert: saveAdvert,
    deleteAdvert: deleteAdvert,
    getAll: getAll
};

module.exports = Module;