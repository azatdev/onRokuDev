const mixins = require("./index");
const dimensions = mixins["Dimensions"];
const viewport = dimensions["viewport"];

require("./Dimensions")

module.exports = {
    "Gradients": {
        "BottomGradient": {
            "blendColor": "#000000",
            "height": 561,
            "translation": [0, viewport.height - 561],
            "uri": "pkg:/static/images/gradients/details-bottom-gradient.webp",
            "width": viewport.width
        },
        "TopGradient": {
            "blendColor": "#000000",
            "height": 330,
            "uri": "pkg:/static/images/gradients/details-top-gradient.webp",
            "width": viewport.width
        }
    }
};
