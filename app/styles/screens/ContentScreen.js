const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const palette = mixins["Palette"]
const viewport = dimensions["viewport"]

module.exports = {
    "ContentScreen": {
        "Div": {
            "&#screenContainer": {
                "ContentHero": {
                    "height": 780,
                    "width": viewport.width
                },
                "Div": {
                    "&#bottomContainer": {
                        "margin": [24, 0, 0, 0],
                        "_ord_flexList": {
                            "height": 51,
                            "margin": [0, 0, 39, 0],
                            "translation": [174, 0]
                        },
                        "_ord_scrollGroup":{
                            "height": 480,
                            "width": viewport.width
                        }
                    }
                }
            }
        }
    }
};
