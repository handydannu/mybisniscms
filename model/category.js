const dataStore = require('../libs/dataStore');

function getAll() {
    
    return new Promise((resolve, reject) => {

        const selectCategory = 'SELECT * FROM category WHERE email = ?';

        dataStore.query(selectCategory).then((selectedCategory) => {

            resolve(selectedCategory)

        }).catch((reason) => {

            reject('Cant get user by email', reason);

        });
        
    });
    
}




