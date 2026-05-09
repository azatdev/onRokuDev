const mixins = require("../mixins");
const palette = mixins["Palette"]

module.exports = {
    "DynamicItem": {
        "Poster#container": {
            blendColor: "#333333",
            "uri": "pkg:/static/images/9patches/fill-18px.9.png",
            "Quantico#label": {
                color: palette.primaryColor,
                height: 81,
                margin: [48, 0],
                size: 33,
                vertAlign: "center"
            }
        }
    }
};
