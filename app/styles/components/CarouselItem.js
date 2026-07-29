const mixins = require("../mixins");
const palette = mixins["Palette"]

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
                        "blendColor": palette.highlightColor,
                        "loadSync": true,
                        "uri": "pkg:/static/images/9patches/9px-outline-18px.9.png",
                    }
                }
            }
        },
        "Label": {
            "&#label": {
                color: palette.primaryColor,
                translation: [33, 33]
            }
        }
    }
};
