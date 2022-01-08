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

        if (typeof model.data != "object" || model.data === null) {
            return false;
        }

        model = model.data;
        this.model = model;

        for (let key in this.model) {
            const Data = this.model[key];

            let Instance = {};

            Instance = (data) => {
                if (Data.method.length == 1) {
                    return Instance[Data.method[0].toLowerCase()](data);
                }

                if (Data.method.length > 1) {
                    throw new Error("There are more then one HTTP Methods for this instance");
                }
            }

            Data.method.forEach(method => {
                method = method.toLowerCase();

                Instance.__proto__[method] = async (data) => {
                    const url = Data.url;

                    const response = await this.API[method](url, { data });

                    return {
                        status: response.status,
                        data: response.data
                    }
                }

            })


            this[key] = Instance;
        }

    }

    Call(name, data = {}, method = "GET") {
        const Instance = this[name][method.toLowerCase()];

        if (typeof Instance !== 'function') {
            return null;
        }

        return Instance(data);
    }

}



module.exports = Service;