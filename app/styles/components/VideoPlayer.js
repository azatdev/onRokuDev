const mixins = require("../mixins");
const palette = mixins["Palette"]
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

module.exports = {
    "VideoPlayer": {
        "color": palette.black,
        "height": viewport.height,
        "width": viewport.width,
        "Video": {
            "height": viewport.height,
            "width": viewport.width
        }
    }
};
