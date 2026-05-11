const mixins = require("../mixins");
const palette = mixins["Palette"]

module.exports = {
    "SidebarItem": {
        "Rectangle#textContainer": {
            color: "#b8bca414",
            "uri": "pkg:/static/images/9patches/fill-18px.9.png",
            "Icon": {
                color: palette.primaryColor,
                height: 75,
                margin: [0, 39, 0, 36],
                size: 33,
                width: 33,
                vertAlign: "center"
            },
            "QuanticoBold#label": {
                color: palette.primaryColor,
                height: 75,
                margin: [0, 39, 0, -12],
                size: 24,
                vertAlign: "center"
            }
        }
    }
};
