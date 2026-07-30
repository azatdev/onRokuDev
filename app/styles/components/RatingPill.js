const mixins = require("../mixins");
const assets = mixins["Assets"]
const palette = mixins["Palette"]

module.exports = {
    "RatingPill": {
        "margin": [0, 0, 0, 12],
        "Poster": {
            "blendColor": palette.lowlightColor,
            "uri": assets.rounded6,
            "QuanticoBold": {
                "color": "#392734",
                "height": 36,
                "margin": [12, 0],
                "size": 21,
                "vertAlign": "center"
            }
        }
    }
};
