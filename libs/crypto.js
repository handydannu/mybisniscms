const config = require('./Config')();
const initVector = config.initVector;

const cryptoLib = require('@skavinvarnan/cryptlib');

function encrypt(plainText, key) {

    return cryptoLib.encryptPlainTextWithRandomIV(plainText, key);

}

function decrypt(encryptedString, key) {

    const decryptResult = cryptoLib.decryptCipherTextWithRandomIV(encryptedString.replace(/ /g, '+'), key);
    if ((typeof decryptResult) === "object") {
        return decryptResult;
    } else {
        return JSON.parse(decryptResult);
    }

}

Module = {
    encrypt: encrypt,
    decrypt: decrypt
};
module.exports = Module;