const mixins = require("../mixins");
const assets = mixins["Assets"]
const palette = mixins["Palette"]

module.exports = {
    "ButtonItem": {
        "Rectangle": {
            "&#textContainer": {
                "color": palette.transparent,
                "uri": assets.rounded18,
                "Icon": {
                    "color": palette.primaryColor,
                    "height": 75,
                    "margin": [0, 39, 0, 39],
                    "size": 33,
                    "vertAlign": "center",
                    "&.active": {
                        "color": palette.highlightText,
                    }
                },
                "QuanticoBold": {
                    "&#label": {
                        "color": palette.primaryColor,
                        "height": 75,
                        "margin": [0, 39, 0, -12],
                        "size": 24,
                        "vertAlign": "center"
                    }
                }
            }
        },
        "ColorFieldInterpolator": {
            "&#focusColorInterpolator": {
                "fieldToInterp": "background.blendColor",
                "key": [0.0, 0.25, 0.5, 1.0],
                "keyValue": [palette.inactiveColor, "#53582E", "#4F5C17", palette.highlightColor]
            }
        },
        "Poster": {
            "&#background": {
                "blendColor": palette.inactiveColor,
                "uri": assets.rounded18,
            },
            "&#highlightBottom": {
                "blendColor": `${palette.primaryColor}14`,
                "uri": "pkg:/static/images/9patches/highlight-bottom-18px.9.png"
            },
            "&#highlightTop": {
                "blendColor": `${palette.primaryColor}14`,
                "uri": "pkg:/static/images/9patches/highlight-top-18px.9.png"
            },
        }
    }
};
