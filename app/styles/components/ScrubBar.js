const mixins = require("../mixins");
const palette = mixins["Palette"]
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]
const player = dimensions["player"]


const scrubBarWidth = viewport.width - (player.sideMargin * 2)

module.exports = {
    "ScrubBar": {
        color: "#4b4d44",
        height: player.seekbarHeight,
        clippingRect: [0, 0, scrubBarWidth, player.seekbarHeight],
        width: scrubBarWidth,
        "Rectangle": {
            "&#scrubTrack": {
                "Rectangle": {
                    "&#progressBar": {
                        color: "#352357",
                        height: player.seekbarHeight
                    },
                    "&#scrubber": {
                        color: "#8f9483",
                        height: player.seekbarHeight,
                        translation: [-6, 0],
                        width: 6
                    }
                }
            }
        }
    }
};
