const mixins = require("../mixins");
const assets = mixins["Assets"]
const palette = mixins["Palette"];

const colorMorph = {
    "key": [0.0, 1.0],
    "keyValue": [palette.primaryColor, palette.highlightText]
}

module.exports = {
    "TopbarItem": {
        "Rectangle": {
            "&#background": {
                "color": palette.userCarouselBackground,
                "height": 108,
                "opacity": 0
            },
            "&#highlight": {
                "color": `${palette.lowlightColor}14`,
                "height": 108,
                "opacity": 0,
                "width": 800
            },
            "&#textContainer": {
                "color": palette.transparent,
                "uri": assets.rounded18,
                "Icon": {
                    "color": palette.primaryColor,
                    "height": 108,
                    "margin": [0, 39, 0, 36],
                    "size": 33,
                    "width": 33,
                    "vertAlign": "center"
                },
                "QuanticoBold": {
                    "color": palette.primaryColor,
                    "height": 108,
                    "margin": [0, 39, 0, -12],
                    "size": 24,
                    "vertAlign": "center"
                }
            }
        },
        "ColorFieldInterpolator": {
            "&#labelColorInterpolator": {
                "fieldToInterp": "label.color",
                ...colorMorph
            },
            "&#iconColorInterpolator": {
                "fieldToInterp": "icon.color",
                ...colorMorph
            }
        }
    }
};
