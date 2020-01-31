const dataStore = require('../libs/dataStore');

const typeUser = {
    admin : 1,
    client: 2,
    marketing: 3
}

function getUserByEmail(email) {

    return new Promise((resolve, reject) => {

        const selectUser = 'SELECT * FROM users WHERE email = ?';

        dataStore.query(selectUser, [email]).then((selectedUser) => {

            resolve(selectedUser)

        }).catch((reason) => {

            reject('Cant get user by email', reason);

        });
    })

}

function getUserById(id) {

    return new Promise((resolve, reject) => {

        const selectUser = 'SELECT * FROM users WHERE id = ?';

        dataStore.query(selectUser, [id]).then((selectedUser) => {

            resolve(selectedUser)

        }).catch((reason) => {

            reject('Cant get user by email', reason);

        });
    })

}

function getAllUser() {

    return new Promise((resolve, reject) => {

        const selectUser = 'SELECT * FROM users';

        dataStore.query(selectUser).then((selectedUser) => {

            resolve(selectedUser)

        }).catch((reason) => {

            reject('Cant get all user', reason);

        });
    })

}

function getAllAgency() {

    return new Promise((resolve, reject) => {

        const selectUser = 'SELECT * FROM agency';

        dataStore.query(selectUser).then((selectedUser) => {

            resolve(selectedUser)

        }).catch((reason) => {

            reject('Cant get all user', reason);

        });
    })

}

function getUserByName(name) {

    return new Promise((resolve, reject) => {

        const selectUser = 'SELECT * FROM users WHERE name like ?';

        name = '%' + name + '%';

        dataStore.query(selectUser, [name]).then((selectedUser) => {

            resolve(selectedUser)

        }).catch((reason) => {

            reject('Cant get user by email', reason);

        });
    })
}

function saveUser(user) {

    return new Promise((resolve, reject) => {

        const name = user.name || null;
        const email = user.email;
        const password = user.password || null;
        const type = user.type;
        const phone = user.phone || null;
        const address = user.address || null;
        const agencyId = user.agencyId || null;
        const company = user.company || null;
        const picture = user.picture || null;

        const queryInsert = 'INSERT INTO users (name, email, type, password, phone, address, agency_id, company, picture) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?)';

        dataStore.query(queryInsert, [name, email, type, password, phone, address, agencyId, company, picture]).then((resultInsert) => {

            resolve(resultInsert)

        }).catch((reason) => {

            reject(reason)

        });

    });

}

function updateUser(user) {

    return new Promise(((resolve, reject) => {

        const id = user.id;

        getUserById(id).then((resultUser) => {

            const name = user.name;
            const email = user.email;
            const phone = user.phone || resultUser.phone;
            const address = user.address || resultUser.address;
            const company = user.company || resultUser.company ;
            const agencyId = user.agencyId || resultUser.agency_id ;
            const website = user.website || resultUser.website;
            const picture = user.picture || resultUser.picture;

            const queryInsert = 'UPDATE users SET name = ?, email = ?, phone = ?, address = ?, company = ?, website = ?, agency_id = ?, picture = ? WHERE id = ?';

            dataStore.query(queryInsert, [name, email, phone, address, company, website, agencyId, picture, id]).then(() => {

                resolve()

            }).catch((reason) => {

                reject(reason)

            });

        });

    }));

}

function updatePicture(user) {
    return new Promise(((resolve, reject) => {

        const id = user.id;
        const picture = user.picture;

        const queryInsert = 'UPDATE users SET picture = ? WHERE id = ?';

        dataStore.query(queryInsert, [picture, id]).then(() => {

            resolve()

        }).catch((reason) => {

            reject(reason)

        });
    }));
}

function disableUser(id) {

    return new Promise(((resolve, reject) => {

        const queryInsert = 'UPDATE users SET active = false WHERE id = ?';

        dataStore.query(queryInsert, [id]).then(() => {

            resolve()

        }).catch((reason) => {

            reject(reason)

        });

    }));

}

function deleteUser(id) {

    return new Promise(((resolve, reject) => {

        const queryInsert = 'DELETE FROM users WHERE id = ?';

        dataStore.query(queryInsert, [id]).then(() => {

            resolve()

        }).catch((reason) => {

            reject(reason)

        });

    }));

}

function getRoleUser(id) {

    return new Promise((resolve, reject) => {

        const selectRole = 'SELECT * FROM role_user_view WHERE user_id = ?';

        dataStore.query(selectRole, [id]).then((selectedRole) => {

            resolve(selectedRole)

        }).catch((reason) => {

            reject('Cant get user', reason);

        });
    })

}

function changePassword(user) {

    const id = user.id;
    const password = user.password;

    return new Promise(((resolve, reject) => {

        const queryInsert = 'UPDATE users SET password = ? WHERE id = ?';

        dataStore.query(queryInsert, [password, id]).then(() => {

            getUserById(id).then((userSelected) => {

                resolve(userSelected)

            }).catch((reason) => {

                resolve()

            })

        }).catch((reason) => {

            reject(reason)

        });

    }));


}

function getAgency() {
    return new Promise((resolve, reject) => {

        dataStore.query('SELECT * FROM agency').then((selectedAgency) => {

            resolve(selectedAgency)

        }).catch((reason) => {

            reject('Cant get all user', reason);

        });
    })
}

function getUserByOrder(orderId) {
    return new Promise((resolve, reject) => {

        dataStore.query('select * from users where id = (select user_id from product_order where id = ?)', [orderId]).then((selectedUser) => {

            resolve(selectedUser)

        }).catch((reason) => {

            reject('Cant get user by order ', reason);

        });
    })
}

function updateToken(user) {

    return new Promise(((resolve, reject) => {

        const id = user.id;
        const token = user.token;

        const queryInsert = 'UPDATE users SET device_token = ? WHERE id = ?';

        dataStore.query(queryInsert, [token, id]).then(() => {

            resolve()

        }).catch((reason) => {

            console.error('failed save token');
            reject(reason)

        });
    }));

}

Module = {
    getAgency: getAgency,
    disableUser: disableUser,
    updateUser: updateUser,
    getAllAgency: getAllAgency,
    getUserByName: getUserByName,
    changePassword: changePassword,
    updatePicture: updatePicture,
    getRoleUser: getRoleUser,
    getUserById: getUserById,
    getUserByEmail: getUserByEmail,
    deleteUser: deleteUser,
    getAllUser: getAllUser,
    saveUser: saveUser,
    getUserByOrder: getUserByOrder,
    updateToken: updateToken
};

module.exports = Module;