const admin = require('firebase-admin');

const serviceAccount = require("./serviceAccountMyBisnis.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mybisnis-f515f.firebaseio.com"
});


Module = {
  admin: admin,
};

module.exports = Module;