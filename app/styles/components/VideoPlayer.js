const mixins = require("../mixins");
const palette = mixins["Palette"]
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

module.exports = {
    "VideoPlayer": {
        color: "#000000",
        height: viewport.height,
        translation: [0, (viewport.height) * -1],
        width: viewport.width,
        "Video": {
            height: viewport.height,
            width: viewport.width
        }
    }
};
