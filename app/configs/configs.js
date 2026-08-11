module.exports = {
    "CONFIG": {
        ...require("./environment"),
        ...require("./models"),
        ...require("./tasks"),
        ...require("./views")
    }
};
