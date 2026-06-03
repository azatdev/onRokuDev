const mixins = require("../mixins");
const palette = mixins["Palette"]

module.exports = {
    "CarouselItem": {
        "Div": {
            "&#container": {
                color: "#84bef300",
                opacity: 1,
                "Poster": {
                    "&#thumbnail": {
                        "translation": [6, 6]
                    },
                    "&#outline": {
                        "blendColor": "#b8bca4",
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
