const mixins = require("../mixins");
const palette = mixins["Palette"]
const assets = mixins["Assets"]

module.exports = {
    "CarouselItem": {
        "Div": {
            "&#container": {
                "Poster": {
                    "&#thumbnail": {
                        "loadDisplayMode": "scaleToZoom",
                        "loadSync": true,
                        "translation": [6, 6]
                    },
                    "&#outline": {
                        "blendColor": palette.lowlightColor,
                        "loadSync": true,
                        "uri": assets.outline918,
                        "opacity": 0
                    }
                }
            }
        },
        "Label": {
            "&#label": {
                "color": palette.primaryColor,
                "translation": [33, 33]
            }
        }
    }
};
