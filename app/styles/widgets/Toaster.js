const mixins = require("../mixins");
const assets = mixins["Assets"]
const dimensions = mixins["Dimensions"]
const palette = mixins["Palette"]

module.exports = {
    "Toaster": {
        "width": dimensions.toaster.width,
        "height": dimensions.viewport.height,
        "translation": [dimensions.viewport.width - dimensions.toaster.width - dimensions.toaster.margin[1], 0],
        "ord_flexList": {
            "width": dimensions.toaster.width,
            "height": dimensions.viewport.height
        }
    }
};
