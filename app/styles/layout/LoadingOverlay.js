const mixins = require("../mixins");
const assets = mixins["Assets"]
const dimensions = mixins["Dimensions"]
const palette = mixins["Palette"]

module.exports = {
    "LoadingOverlay": {
        "blendColor": "#00000080",
        "opacity": 0,
        "width": dimensions.viewport.width,
        "height": dimensions.viewport.height,
        "QuanticoBold": {
            "height": dimensions.viewport.height,
            "horizAlign": "center",
            "size": 39,
            "vertAlign": "center",
            "width": dimensions.viewport.width,
        }
    }
};
