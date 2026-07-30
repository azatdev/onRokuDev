const mixins = require("../mixins");
const palette = mixins["Palette"]

module.exports = {
    "TabItem": {
        "Rectangle": {
            "&#textContainer": {
                "color": "#33333300",
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
                "&#tabTop": {
                    "blendColor": `${palette.highlightColor}`,
                    "uri": "pkg:/static/images/9patches/tab-top-18px.9.png"
                },
                "&#tabBottom": {
                    "blendColor": `${palette.highlightColor}`,
                    "uri": "pkg:/static/images/9patches/tab-bottom-18px.9.png"
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
