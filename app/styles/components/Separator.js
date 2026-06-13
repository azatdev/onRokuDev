const mixins = require("../mixins");
const palette = mixins["Palette"]
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]
const player = dimensions["player"]

module.exports = {
    "Separator": {
        opacity: 0.6,
        translation: [0, viewport.height - 75],
        width: viewport.width,
        "Rectangle": {
            color: "#5d5e55",
            height: 3,
            translation: [0, 72],
            "&#leftLine": {
                width: 1500
            },
            "&#rightLine": {
                width: player.sideMargin
            },
        },

    }
};
