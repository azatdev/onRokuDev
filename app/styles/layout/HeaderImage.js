const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const palette = mixins["Palette"]
const viewport = dimensions["viewport"]

module.exports = {
    "HeaderImage": {
        height: 561,
        opacity: 0,
        translation: [921, 60],
        width: 999,
        "MaskGroup": {
            "maskuri": "pkg:/static/images/gradients/header-image-mask.webp"
        },
        "Div": {
            "&#headerImageGradients": {
                visible: false,
                "Poster": {
                    "&#leftGradient": {
                        "blendColor": "#000000",
                        "height": 561,
                        "translation": [0, 0],
                        "uri": "pkg:/static/images/gradients/header-image-left-gradient.webp",
                        "width": 179
                    },
                    "&#topGradient": {
                        "blendColor": "#000000",
                        "height": 171,
                        "translation": [0, 0],
                        "uri": "pkg:/static/images/gradients/header-image-top-gradient.webp",
                        "width": 999
                    },
                    "&#bottomGradient": {
                        "blendColor": "#000000",
                        "height": 294,
                        "translation": [0, 561 - 294],
                        "uri": "pkg:/static/images/gradients/header-image-bottom-gradient.webp",
                        "width": 999
                    },
                }
            }
        }
    }
};
