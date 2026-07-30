const mixins = require("../mixins");
const palette = mixins["Palette"]
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

module.exports = {
    "Delimiter": {
        "height": 36,
        "width": 36,
        "Poster": {
            "blendColor": palette.primaryColor,
            "height": 12,
            "translation": [12, 12],
            "width": 12,
            "uri": "pkg:/static/images/9patches/fill-6px.9.png",
        }
    }
};
