const mixins = require("../mixins");
const palette = mixins["Palette"]
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

module.exports = {
    "VideoPlayer": {
        "Video": {
            height: viewport.height,
            width: viewport.width
        }
    }
};
