const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

const gradientStyles = {
    "blendColor": "#000000",
    "height": viewport.height,
    "opacity": 0.5,
    "uri": "pkg:/static/images/gradients/sidebar-gradient.webp",
    "width": 111
}

module.exports = {
    "Sidebar": {
        "visible": true,
        "Poster#gradient": {
            ...gradientStyles
        }
    },
    "Topbar": {
        "translation": [1170, 0],
        "MaskGroup": {
            "maskOffset": [0, 216],
            "maskuri": "pkg:/static/images/gradients/topbar-mask-white.webp",
            "Poster#gradient": {
                ...gradientStyles,
                "height": 1170,
                "rotation": -1.5708
            }
        }
    }
};
