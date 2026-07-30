const { "Assets": assets } = require("./Assets");
const { "Dimensions": dimensions } = require("./Dimensions");
const { "Palette": palette } = require("./Palette");
const viewport = dimensions["viewport"];

module.exports = {
    "Gradients": {
        "BottomGradient": {
            "blendColor": palette.black,
            "height": 561,
            "translation": [0, viewport.height - 561],
            "uri": assets.bottomGradient,
            "width": viewport.width
        },
        "TopGradient": {
            "blendColor": palette.black,
            "height": 330,
            "uri": "pkg:/static/images/gradients/content-top-gradient.webp",
            "width": viewport.width
        }
    }
};
