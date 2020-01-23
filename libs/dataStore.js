const MySQL = require('mysql');
const Throttle = require('throttle-exec');

let isInit = false;
let Connection;
let connReady;

const throttleCount = process.env.MYSQL_THROTTLE || 25;
const mysqlHost = process.env.MYSQL_HOST || 'localhost';
const mysqlUser = process.env.MYSQL_USER || 'root';
const mysqlPassword = process.env.MYSQL_PASSWORD || 'B4ndung_ju4r4';
const mysqlDatabase = process.env.MYSQL_DATABASE || 'mybisnis';

const Engine = {};

function init() {
    Connection = MySQL.createConnection({
        host: mysqlHost,
        user: mysqlUser,
        password: mysqlPassword,
        database: mysqlDatabase
        // multipleStatements:Config.mysql.multiple_statement
    });
    connReady = new Promise((resolve, reject) => {
        Connection.connect((err) => {
            if (err) {
                reject(err)
            } else {
                resolve();
            }
        })
    })
}

function query(queryStr, params) {
    return new Promise((resolve, reject) => {
        connReady.then(() => {
            try {
                Connection.query(queryStr, params, (err, results) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(results)
                    }
                })
            } catch (e) {
                reject(e);
            }
        })
    })
}

const ThrottleInstance = new Throttle(throttleCount);
ThrottleInstance.registerFunction("query", query);

Engine.query = function (queryStr, params) {
    if (!isInit) {
        isInit = true;
        init();
    }
    return ThrottleInstance.registerAction("query", [queryStr, params])
};

module.exports = Engine;