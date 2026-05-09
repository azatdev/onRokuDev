// const mixins = require("./mixins/theme");
const viewStyles = require("./views");
const componentStyles = require("./components");
const layoutStyles = require("./layout");

module.exports = {
    "STYLES": {
        ...viewStyles,
        ...componentStyles,
        ...layoutStyles
    }
};
