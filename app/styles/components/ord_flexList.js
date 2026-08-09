const mixins = require("../../styles/mixins");
const assets = mixins["Assets"];

module.exports = {
    "ord_flexList": {
        "Div": {
            "QuanticoBold": {
                "horizAlign": "center",
                "size": 30,
                "vertAlign": "center",
            }
        },
        "Poster": {
            "&#clippingRectOutline": {
                "height": 0,
                "uri": assets.clippingRect,
                "visible": false,
                "width": 0
            }
        }
    }
};
