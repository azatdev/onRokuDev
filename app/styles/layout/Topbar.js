const mixins = require("../mixins");
const assets = mixins["Assets"]
const dimensions = mixins["Dimensions"]
const gradients = mixins["Gradients"]
const palette = mixins["Palette"]
const viewport = dimensions["viewport"]

module.exports = {
    "Topbar": {
        "opacity": 0,
        "translation": [1170, 0],
        "Div": {
            "&#overlay": {
                "inheritParentTransform": false,
                "color": palette.black,
                "opacity": 0,
                "height": viewport.height,
                "width": viewport.width,
            },
            "&#userCarouselsContainer": {
                "color": palette.userCarouselBackground,
                "height": 207,
                "inheritParentTransform": false,
                "opacity": 0,
                "translation": [0, 111],
                "width": viewport.width,
                "ord_scrollGroup":{
                    "height": 189,
                    "translation": [0, 9],
                    "width": viewport.width
                }
            }
        },
        "MaskGroup": {
            "maskOffset": [0, 216],
            "maskuri": assets.topbarMask,
            "ord_flexList": {
                "translation": [-999, 0]
            },
            "Poster": {
                ...gradients.NavigationGradient,
                "height": 1170,
                "rotation": -1.5708
            }
        }
    }
};
