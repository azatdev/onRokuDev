const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

module.exports = {
    "Background": {
        "Poster#backgroundImage": {
            "height": viewport.height,
            "uri": "pkg:/static/images/backgrounds/memento.webp",
            "width": viewport.width
        },
        "Poster#bottomGradient": {
            "blendColor": "#000000",
            "height": 561,
            "translation": [0, viewport.height - 561],
            "uri": "pkg:/static/images/gradients/bottom-gradient.webp",
            "width": viewport.width
        },
        "Poster#cornerGradient": {
            "blendColor": "#3c1744",
            "height": viewport.height,
            "uri": "pkg:/static/images/gradients/corner-gradient.webp",
            "opacity": 1,
            "translation": [0, 0],
            "width": 1161
        }
    }
};
