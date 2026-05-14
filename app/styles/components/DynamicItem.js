const mixins = require("../mixins");
const palette = mixins["Palette"]

module.exports = {
    "DynamicItem": {
        "Poster": {
            "&#container": {
                blendColor: "#333333",
                "uri": "pkg:/static/images/9patches/fill-27px.9.png",
                "QuanticoBold": {
                    "&#label": {
                        color: palette.primaryColor,
                        height: 66,
                        margin: [48, 0],
                        size: 30,
                        vertAlign: "center"
                    }
                }
            }
        },
        "ColorFieldInterpolator": {
            "&#focusColorInterpolator": {
                fieldToInterp: "container.blendColor",
                key: [0.0, 1.0],
                keyValue: ["#333333", "#555555"]
            }
        },
    }
};
