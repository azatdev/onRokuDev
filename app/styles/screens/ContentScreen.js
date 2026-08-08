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
                            "translation": [174, 0]
                        },
                        "ord_scrollGroup":{
                            "height": 480,
                            "margin": [27, 0, 0, 0],
                            "width": viewport.width
                        }
                    }
                }
            }
        }
    }
};
