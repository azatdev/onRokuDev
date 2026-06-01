const mixins = require("../mixins");
const palette = mixins["Palette"]
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

module.exports = {
    "Hero": {
        height: 441,
        translation: [0, 0],
        width: viewport.width,
        "Div": {
            translation: [189, 150],
            "Poster": {
                height: 111,
                width: 507
            },
            "Div": {
                height: 48,
                width: 642
            },
            "Quantico": {
                lineSpacing: 0,
                numLines: 2,
                size: 24,
                height: 90,
                margin: [0, 12],
                width: 687,
                wrap: true
            },
            "CTAs": {
                height: 75,
                margin: [0, 0, 0, -16],
                width: 544
            }
        }
        // "LoadingDiv": {
        //     "Div": {

        //     }
        // }
    }
};
