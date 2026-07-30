const mixins = require("../mixins");
const assets = mixins["Assets"]
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

module.exports = {
    "DetailsModal": {
        "Div": {
            "&#screenContainer": {
                "color": "#00000080",
                "height": viewport.height,
                "width": viewport.width,
                "Poster": {
                    "&#modalContainer": {
                        "blendColor": "#18161d",
                        "uri": assets.rounded18,
                        "width": "1110px",
                        "_ord_scrollGroup":{
                            "height": 786,
                            "margin": [81, 0, 81, 0],
                            "translation": [81, 81],
                            "width": 990
                        }
                    }
                }
            }
        }
    }
};
