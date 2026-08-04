const mixins = require("../mixins");
const assets = mixins["Assets"];
const palette = mixins["Palette"];

module.exports = {
    "HeaderImage": {
        "height": 561,
        "translation": [921, 60],
        "width": 999,
        "MaskGroup": {
            "maskuri": assets.headerMask
        },
        "Div": {
            "&#headerImageGradients": {
                "visible": false,
                "Poster": {
                    "&#leftGradient": {
                        "blendColor": palette.black,
                        "height": 561,
                        "translation": [0, 0],
                        "uri": assets.headerLeft,
                        "width": 179
                    },
                    "&#topGradient": {
                        "blendColor": palette.black,
                        "height": 171,
                        "translation": [0, 0],
                        "uri": assets.headerTop,
                        "width": 999
                    },
                    "&#bottomGradient": {
                        "blendColor": palette.black,
                        "height": 294,
                        "translation": [0, 561 - 294],
                        "uri": assets.headerBottom,
                        "width": 999
                    },
                }
            }
        }
    }
};
