const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

const gradientStyles = {
    "blendColor": "#000000",
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
        "_ord_flexList":{
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
                "color": "#000000",
                "opacity": 0,
                "height": viewport.height,
                "width": viewport.width,
            },
            "&#userCarouselsContainer": {
                "color": "#5c5c4b23",
                "height": 207,
                "inheritParentTransform": false,
                "opacity": 0,
                "translation": [0, 111],
                "width": viewport.width,
                "_ord_scrollGroup":{
                    "height": 189,
                    "translation": [0, 9],
                    "width": viewport.width
                }
            }
        },
        "MaskGroup": {
            "maskOffset": [0, 216],
            "maskuri": "pkg:/static/images/gradients/topbar-mask-white.webp",
            "_ord_flexList": {
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
