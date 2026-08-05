const { "ENV": env } = require("../environment");

module.exports = {
    "Headers": {
        "Authorization": "bearer " + env.SERVER_API_TOKEN
    }
};
