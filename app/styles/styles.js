// const mixins = require("./mixins/theme");
const viewStyles = require("./views");
const componentStyles = require("./components");

module.exports = {
    "STYLES": {
        ...viewStyles,
        ...componentStyles
    }
};
