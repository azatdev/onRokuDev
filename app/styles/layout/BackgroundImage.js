const mixins = require("../mixins");
const assets = mixins["Assets"]
const dimensions = mixins["Dimensions"]
const palette = mixins["Palette"]
const viewport = dimensions["viewport"]
const gradients = mixins["Gradients"]

module.exports = {
    "BackgroundImage": {
        "blendColor": palette.black,
        "height": viewport.height,
        "opacity": 0,
        "width": viewport.width,
        "uri": assets.whiteBlock
    }
};
