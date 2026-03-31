const mixins = require("./mixins/theme");

module.exports = {
    info: {
        ...mixins.theme(),
        color: "gray"
    },
    alert: {
        ...mixins.theme("DarkRed"),
        color: "green",
        translate: false,
        border: "1px solid green"
    },
    success: mixins.theme("DarkGreen")
};
