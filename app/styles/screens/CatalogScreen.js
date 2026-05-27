const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const palette = mixins["Palette"]
const viewport = dimensions["viewport"]

module.exports = {
    "CatalogScreen": {
        "Div": {
            "&#screenContainer": {
                "Div": {
                    height: 531,
                    width: viewport.width
                },
                "_ord_scrollGroup":{
                    height: 549,
                    width: viewport.width
                }
            }
        }
    }
};
