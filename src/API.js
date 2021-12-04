const axios = require("axios").default;

const validateConfig = (config) => {

    if (!config.hasOwnProperty('host')) {
        throw new Error("Missing host in config");
    }


    return config;
}


const API = class {

    constructor(config) {
        this.config = validateConfig(config);
        this.instance = axios.create({
            baseURL: this.config.host
        })

    }

    request(url, options = {}) {
        return new Promise(resolve => {
            return this.instance(
                url,
                {
                    ...options
                }
            ).then(response => {
                response.isError = false;
                return resolve(response)
            }).catch(error => {
                error.isError = true;
                error.data = error.response.data || null;
                error.status = error.response.status || null;
                return resolve(error);
            })
        })
    }

    get(url, options = {}) {
        return new Promise(async resolve => {
            options.method = "GET";
            resolve(await this.request(url, options));
        });
    }
    post(url, options = {}) {
        return new Promise(async resolve => {
            options.method = "POST";
            resolve(await this.request(url, options));
        });
    }


}

module.exports = API;