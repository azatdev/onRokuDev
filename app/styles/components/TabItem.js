const mixins = require("../mixins");
const palette = mixins["Palette"]

module.exports = {
    "TabItem": {
        "Rectangle": {
            "&#textContainer": {
                color: "#33333300",
                // "uri": "pkg:/static/images/9patches/fill-18px.9.png",
                "QuanticoBold": {
                    "&#label": {
                        color: palette.primaryColor,
                        height: 51,
                        margin: [24, 42, 0, 42],
                        size: 24,
                        vertAlign: "bottom"
                    }
                }
            }
        },
        "Poster": {
            "&#tabTop": {
                "blendColor": `${palette.highlightColor}80`,
                "uri": "pkg:/static/images/9patches/tab-top-18px.9.png"
            },
            "&#tabBottom": {
                blendColor: `${palette.highlightColor}80`,
                "uri": "pkg:/static/images/9patches/tab-bottom-18px.9.png"
            },
        }
    }
};
