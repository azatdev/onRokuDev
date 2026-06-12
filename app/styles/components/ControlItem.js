const mixins = require("../mixins");
const palette = mixins["Palette"]
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]


module.exports = {
    "ControlItem": {
        height: 45,
        "Div": {
            "&#iconsContainer": {
                "Icon": {
                    color: palette.primaryColor,
                    height: 45,
                    size: 33,
                    width: 33,
                    vertAlign: "center"
                }
            }
        },
        "QuanticoBold": {
            color: palette.primaryColor,
            height: 45,
            margin: [0, 0, 0, 12],
            size: 24,
            vertAlign: "center"
        }
    }
};
