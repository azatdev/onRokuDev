const mixins = require("./mixins/theme");
const viewStyles = require("./mixins/views");

module.exports = {
    info: {
        ...mixins.theme(),
        ...viewStyles.viewStyles(),
        color: "gray"
    },
    alert: {
        ...mixins.theme("DarkRed"),
        color: "1111",
        translate: false,
        border: "1px solid green"
    },
    success: mixins.theme("DarkGreen")
};
