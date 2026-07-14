const mixins = require("../mixins");
const palette = mixins["Palette"]
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

module.exports = {
    "ContentHero": {
        height: 441,
        translation: [0, 0],
        width: viewport.width,
        "Div": {
            translation: [180, 150],
            "Poster": {
                height: 111,
                width: 507
            },
            "Metadata": {
                height: 48,
                margin: [30, 0, 0, 0],
                width: 642
            },
            "Quantico": {
                lineSpacing: 0,
                maxLines: 7,
                size: 24,
                margin: [0, 12],
                width: 687,
                wrap: true
            },
            "CTAs": {
                height: 75,
                margin: [36, 0, 0, -16],
                width: 544
            }
        }
    }
};
