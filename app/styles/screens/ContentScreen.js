const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

module.exports = {
    "ContentScreen": {
        "Div": {
            "&#screenContainer": {
                "ContentHero": {
                    "height": 804,
                    "width": viewport.width
                },
                "Div": {
                    "&#bottomContainer": {
                        "ord_flexList": {
                            "height": 51,
                            "margin": [0, 0, 39, 0],
                            "translation": [174, 0]
                        },
                        "ord_scrollGroup":{
                            "height": 480,
                            "width": viewport.width
                        }
                    }
                }
            }
        }
    }
};
