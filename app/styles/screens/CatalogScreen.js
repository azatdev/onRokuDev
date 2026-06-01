const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const palette = mixins["Palette"]
const viewport = dimensions["viewport"]

module.exports = {
    "CatalogScreen": {
        "Div": {
            "&#screenContainer": {
                "CatalogHero": {
                    height: 600,
                    width: viewport.width
                },
                "_ord_scrollGroup":{
                    height: 480,
                    width: viewport.width
                }
            }
        }
    }
};
