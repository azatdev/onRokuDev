const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const palette = mixins["Palette"]
const viewport = dimensions["viewport"]

const gradientStyles = {
    "blendColor": palette.black,
    "height": viewport.height,
    "opacity": 0.7,
    "uri": "pkg:/static/images/gradients/sidebar-gradient.webp",
    "width": 111
}

module.exports = {
    "Sidebar": {
        "color": "#5d24691a",
        "openColor": "#251a38",
        "height": viewport.height,
        "ord_flexList":{
            "translation": [0, 162]
        },
        "Poster": {
            ...gradientStyles
        }
    },
    "Topbar": {
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
            "maskuri": "pkg:/static/images/gradients/topbar-mask-white.webp",
            "ord_flexList": {
                "translation": [-999, 0]
            },
            "Poster": {
                ...gradientStyles,
                "height": 1170,
                "rotation": -1.5708
            }
        }
    }
};
