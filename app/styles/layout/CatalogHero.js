const mixins = require("../mixins");
const palette = mixins["Palette"]
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

module.exports = {
    "CatalogHero": {
        "color": "#22222200",
        "_ord_scrollGroup": {
            "height": 600,
            "translation": [0, 0],
            "width": viewport.width
        }
    }
};
