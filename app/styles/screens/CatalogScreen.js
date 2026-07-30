const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

const heroHeight = 600;
const heightDelta = 150;
const scrollGroupHeight = 480;

module.exports = {
    "CatalogScreen": {
        "Div": {
            "&#screenContainer": {
                "CatalogHero": {
                    "height": heroHeight,
                    "width": viewport.width
                },
                "Header": {
                    "visible": false,
                    "width": viewport.width
                },
                "ord_scrollGroup":{
                    "height": scrollGroupHeight,
                    "width": viewport.width
                }
            },
            "&.noHero": {
                "CatalogHero": {
                    "visible": false,
                },
                "Header": {
                    "height": scrollGroupHeight - heightDelta,
                    "visible": true
                },
                "ord_scrollGroup":{
                    "height": scrollGroupHeight + heightDelta,
                    "margin": [0, 120]
                }
            }
        }
    }
};
