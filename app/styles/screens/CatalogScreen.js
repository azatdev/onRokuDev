const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const palette = mixins["Palette"]
const viewport = dimensions["viewport"]

module.exports = {
    "CatalogScreen": {
        "Div": {
            "&#screenContainer": {
                "Div": {
                    height: 501,
                    width: viewport.width
                },
                "_ord_scrollGroup":{
                    height: 1002,
                    width: viewport.width
                }
            }
        }
    }
};
