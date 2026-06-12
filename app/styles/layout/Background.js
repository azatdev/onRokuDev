const mixins = require("../mixins");
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
                        "blendColor": "#000000",
                        "height": 561,
                        "translation": [0, viewport.height - 561],
                        "uri": "pkg:/static/images/gradients/bottom-gradient.webp",
                        "width": viewport.width
                    },
                    "&#cornerGradient": {
                        "blendColor": palette.defaultCornerColor,
                        "height": viewport.height,
                        "uri": "pkg:/static/images/gradients/corner-gradient.webp",
                        "opacity": 1,
                        "translation": [0, 0],
                        "width": 1161
                    }
                }
            },
            "&#detailsGradientContainer": {
                opacity: 0,
                "Poster": {
                    "&#bottomDetailsGradient": {
                        ...gradients.BottomGradient
                    },
                    "&#topDetailsGradient": {
                        ...gradients.TopGradient
                    },
                    "&#leftDetailsGradient": {
                        "blendColor": "#000000",
                        "height": viewport.height,
                        "uri": "pkg:/static/images/gradients/details-left-gradient.webp",
                        "width": 1293
                    },
                }
            }
        }
    }
};
