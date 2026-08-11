const mixins = require("../mixins");
const assets = mixins["Assets"]
const palette = mixins["Palette"]

module.exports = {
    "Delimiter": {
        "height": 36,
        "width": 36,
        "Poster": {
            "blendColor": palette.primaryColor,
            "height": 12,
            "translation": [12, 12],
            "width": 12,
            "uri": assets.rounded6,
        }
    }
};
