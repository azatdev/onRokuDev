const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

module.exports = {
    "Header": {
        height: 0,
        visible: false,
        width: viewport.width,
        "Div": {
            translation: [180, 150],
            "Poster": {
                height: 111,
                margin: [0, 0, 30, 0],
                width: 507
            },
            "Metadata": {
                height: 48,
                width: 642
            },
            "QuanticoBold": {
                maxLines: 2,
                size: 48,
                height: 132,
                lineSpacing: -12,
                margin: [0, 0, 9, 0],
                vertAlign: "center",
                width: 900,
                wrap: true
            }
        }
    }
};
