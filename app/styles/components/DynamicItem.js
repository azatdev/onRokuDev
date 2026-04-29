const mixins = require("../mixins");
const palette = mixins["Palette"]

module.exports = {
    "DynamicItem": {
        "Rectangle#container": {
            color: "#b6f5c680",
            "Label#label": {
                color: palette.primaryColor,
                height: 99,
                margin: [48, 0],
                vertAlign: "center"
            }
        }
    }
};
