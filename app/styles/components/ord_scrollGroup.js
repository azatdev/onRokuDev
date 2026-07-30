const mixins = require("../../styles/mixins");
const palette = mixins["Palette"]

module.exports = {
    "ord_scrollGroup": {
        "color": palette.transparent,
        "Poster": {
            "&#scrollTrack": {
                "blendColor": "#FFFFFF80",
                "uri": "pkg:/static/images/white-block.webp",
                "visible": false,
                "width": 42,
                "Poster": {
                    "blendColor": "#d2f3df",
                    "height": 72,
                    "margin": 3,
                    "translation": [3, 3],
                    "width": 36,
                    "uri": "pkg:/static/images/9patches/fill-9px.9.png"
                }
            }
        },
        "Rectangle": {
            "color": palette.transparent
        }
    }
};
