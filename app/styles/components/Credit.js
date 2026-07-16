const mixins = require("../mixins");
const palette = mixins["Palette"]
const dimensions = mixins["Dimensions"]

module.exports = {
    "Credit": {
        margin: [0, 0, 30, 0],
        "QuanticoBold": {
            color: palette.primaryColor,
            height: 72,
            size: 30,
            vertAlign: "center",
            width: 876
        },
        "Quantico": {
            color: palette.primaryColor,
            lineSpacing: 3,
            size: 24,
            width: 876,
            wrap: true
        }
    }
};
