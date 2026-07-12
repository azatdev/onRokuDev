const mixins = require("../mixins");
const palette = mixins["Palette"]

module.exports = {
    "ButtonItem": {
        "Rectangle": {
            "&#textContainer": {
                color: "#33333300",
                "uri": "pkg:/static/images/9patches/fill-18px.9.png",
                "Icon": {
                    color: palette.primaryColor,
                    height: 75,
                    margin: [0, 39, 0, 39],
                    size: 33,
                    vertAlign: "center",
                    "&.active": {
                        color: "#b9faa0",
                    }
                },
                "QuanticoBold": {
                    "&#label": {
                        color: palette.primaryColor,
                        height: 75,
                        margin: [0, 39, 0, -12],
                        size: 24,
                        vertAlign: "center"
                    }
                }
            }
        },
        "ColorFieldInterpolator": {
            "&#focusColorInterpolator": {
                fieldToInterp: "background.blendColor",
                key: [0.0, 0.25, 0.5, 1.0],
                keyValue: ["#575345", "#53582E", "#4F5C17", "#4b6100"]
            }
        },
        "Poster": {
            "&#background": {
                blendColor: "#575345",
                "uri": "pkg:/static/images/9patches/fill-18px.9.png",
            },
            "&#highlightBottom": {
                "blendColor": `${palette.primaryColor}14`,
                "uri": "pkg:/static/images/9patches/highlight-bottom-18px.9.png"
            },
            "&#highlightTop": {
                blendColor: `${palette.primaryColor}14`,
                "uri": "pkg:/static/images/9patches/highlight-top-18px.9.png"
            },
        }
    }
};
