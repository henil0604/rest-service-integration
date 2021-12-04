const API = require("./API")

const validateConfig = (config) => {

    if (!config.hasOwnProperty('host')) {
        throw new Error("Missing host in config");
    }


    return config;
}


const Service = class {

    constructor(config) {
        this.config = validateConfig(config);
        this.API = new API({
            host: this.config.host
        });

    }

    async load() {
        let model = await this.API.post("/rest-service-integration-model");

        if (typeof model.data != "object") {
            return false;
        }

        model = model.data;

        for (let key in model) {
            const element = model[key];
            let ElementInstance = {};

            if (element.method.length == 1) {

                ElementInstance = async (data) => {
                    const response = this.API.request(element.path, {
                        method: element.method[0],
                        data
                    });

                    return response;
                }
                ElementInstance.__proto__.method = element.method[0];

                this[key] = ElementInstance;

            } else {
                ElementInstance = {};

                element.method.forEach(method => {

                    ElementInstance[method.toLowerCase()] = async (data) => {
                        const response = this.API.request(element.path, {
                            method: method,
                            data
                        });

                        return response;
                    }

                });
                this[key] = ElementInstance;

            }
        }

    }


}



module.exports = Service;