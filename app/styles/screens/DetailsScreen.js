const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const palette = mixins["Palette"]
const viewport = dimensions["viewport"]

module.exports = {
    "DetailsScreen": {
        "Div": {
            "&#screenContainer": {
                "DetailsHero": {
                    height: 600,
                    width: viewport.width
                },
                "Div": {
                    "&#bottomContainer": {
                        "_ord_scrollGroup":{
                            height: 480,
                            width: viewport.width
                        }
                    }
                }
            }
        }
    }
};
