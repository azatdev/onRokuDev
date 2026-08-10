const mixins = require("../mixins");
const assets = mixins["Assets"]
const dimensions = mixins["Dimensions"]
const palette = mixins["Palette"]
const viewport = dimensions["viewport"]
const gradients = mixins["Gradients"]

module.exports = {
    "Background": {
        "Div": {
            "&#catalogGradientContainer": {
                "Poster": {
                    "&#bottomGradient": {
                        "blendColor": palette.black,
                        "height": 561,
                        "translation": [0, viewport.height - 561],
                        "uri": assets.bottomGradient,
                        "width": viewport.width
                    },
                    "&#cornerGradient": {
                        "blendColor": palette.transparent,
                        "height": viewport.height,
                        "uri": assets.cornerGradient,
                        "opacity": 1,
                        "translation": [0, 0],
                        "width": 1161
                    }
                }
            },
            "&#contentGradientContainer": {
                "opacity": 0,
                "Poster": {
                    "&#bottomContentGradient": {
                        ...gradients.BottomGradient
                    },
                    "&#topContentGradient": {
                        ...gradients.TopGradient
                    },
                    "&#leftContentGradient": {
                        "blendColor": palette.black,
                        "height": viewport.height,
                        "uri": assets.contentLeftGradient,
                        "width": 1293
                    },
                }
            }
        }
    }
};
