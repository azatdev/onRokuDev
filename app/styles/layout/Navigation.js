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
        "_ord_flexList":{
            "translation": [0, 162]
        },
        "Poster": {
            ...gradientStyles
        }
    },
    "Topbar": {
        "translation": [1170, 0],
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
