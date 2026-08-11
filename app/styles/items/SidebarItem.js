const mixins = require("../mixins");
const assets = mixins["Assets"]
const palette = mixins["Palette"];

module.exports = {
    "SidebarItem": {
        "Rectangle": {
            "&#background": {
                "color": palette.highlightColor,
                "height": 75,
                "opacity": 0
            },
            "&#highlight": {
                "color": `${palette.lowlightColor}14`,
                "height": 75,
                "opacity": 0,
                "width": 800
            },
            "&#textContainer": {
                "color": palette.transparent,
                "uri": assets.rounded18,
                "Icon": {
                    "color": palette.primaryColor,
                    "height": 75,
                    "margin": [0, 39, 0, 36],
                    "size": 33,
                    "width": 33,
                    "vertAlign": "center"
                },
                "QuanticoBold": {
                    "color": palette.primaryColor,
                    "height": 75,
                    "margin": [0, 39, 0, -12],
                    "size": 24,
                    "vertAlign": "center"
                }
            }
        }
    }
};
