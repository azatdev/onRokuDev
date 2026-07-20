const mixins = require("../mixins");
const palette = mixins["Palette"]
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]
const player = dimensions["player"]


const scrubBarWidth = viewport.width - (player.sideMargin * 2)

module.exports = {
    "Trickplay": {
        height: 195,
        opacity: 0,
        width: scrubBarWidth,
        "Poster": {
            "&#frame": {
                blendColor: "#8f9483",
                height: 180,
                uri: "pkg:/static/images/white-block.webp",
                translation: [0, 0],
                width: 312,
                "Poster": {
                    height: 156,
                    loadDisplayMode: "scaleToZoom",
                    translation: [12, 12],
                    width: 288
                }
            },
            "&#tip": {
                blendColor: "#8f9483",
                height: 18,
                translation: [0, 0],
                uri: "pkg:/static/images/playhead.webp",
                width: 24
            }
        }
    }
};
