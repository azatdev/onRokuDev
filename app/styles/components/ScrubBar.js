const mixins = require("../mixins");
const palette = mixins["Palette"]
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

const sideMargin = 84
const scrubBarHeight = 15
const scrubBarWidth = viewport.width - (sideMargin * 2)

module.exports = {
    "ScrubBar": {
        color: "#4b4d44",
        height: scrubBarHeight,
        clippingRect: [0, 0, scrubBarWidth, scrubBarHeight],
        width: scrubBarWidth,
        "Rectangle": {
            "&#scrubTrack": {
                "Rectangle": {
                    "&#progressBar": {
                        color: "#352357",
                        height: scrubBarHeight
                    },
                    "&#scrubber": {
                        color: "#8f9483",
                        height: scrubBarHeight,
                        width: 6
                    }
                }
            }
        }
    }
};
