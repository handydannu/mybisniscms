const Request = require("request");
const ThrottleExec = require("throttle-exec");
const ThrottleInstance = new ThrottleExec(10);
const Module = ThrottleInstance.wrap(function(param){
    return new Promise(function(resolve, reject){

        if (param.cookie) {
            const j = Request.jar();
            const cookie = Request.cookie(param.cookie);
            j.setCookie(cookie, param.url);
            param.headers.Cookie = cookie;
            param.jar = j
        }

        Request(param,function(err, response, data) {
            if(err){
                reject(err)
            } else {
                const statusCode = response.statusCode;
                if(statusCode >= 400){
                    const err = new Error("HTTP Code Error");
                    err.response = response;
                    err.data = data;
                    reject(err)
                } else {
                    resolve({
                        response: response,
                        data: data
                    })
                }
            }
        })
    })
});

module.exports = Module;