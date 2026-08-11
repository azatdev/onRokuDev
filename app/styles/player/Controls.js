const mixins = require("../mixins");
const palette = mixins["Palette"]
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

module.exports = {
    "Controls": {
        "height": 45,
        "ControlItem": {
            "margin": [0, 36, 0, 0]
        }
    }
};
