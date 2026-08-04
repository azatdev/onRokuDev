const mixins = require("../../styles/mixins");
const assets = mixins["Assets"];
const palette = mixins["Palette"];

module.exports = {
    "ord_scrollGroup": {
        "color": palette.transparent,
        "Poster": {
            "&#scrollTrack": {
                "blendColor": "#FFFFFF80",
                "uri": assets.whiteBlock,
                "visible": false,
                "width": 42,
                "Poster": {
                    "blendColor": "#d2f3df",
                    "height": 72,
                    "margin": 3,
                    "translation": [3, 3],
                    "width": 36,
                    "uri": assets.fill9
                }
            }
        },
        "Rectangle": {
            "color": palette.transparent
        }
    }
};
