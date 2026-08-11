const mixins = require("../mixins");
const assets = mixins["Assets"];
const palette = mixins["Palette"];

module.exports = {
    "TabItem": {
        "Rectangle": {
            "&#textContainer": {
                "color": palette.transparent,
                "Icon": {
                    "color": palette.primaryColor,
                    "height": 0,
                    "margin": [0, 27, 0, 36],
                    "size": 33,
                    "vertAlign": "center",
                    "visible": false
                },
                "QuanticoBold": {
                    "&#label": {
                        "color": palette.primaryColor,
                        "height": 54,
                        "margin": [0, 42, 0, 42],
                        "size": 24,
                        "vertAlign": "bottom"
                    }
                }
            }
        },
        "Group": {
            "opacity": 0,
            "Poster": {
                "&#tabBottom": {
                    "blendColor": palette.lowlightColor,
                    "uri": assets.tabBottom18
                },
                "&#tabTop": {
                    "blendColor": palette.lowlightColor,
                    "uri": assets.tabTop18
                }
            },
        },
        "&.active": {
            "Group": {
                "opacity": 0.5
            }
        }
    }
};
