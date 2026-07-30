const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

module.exports = {
    "CatalogHero": {
        "_ord_scrollGroup": {
            "height": 600,
            "translation": [0, 0],
            "width": viewport.width
        }
    }
};
