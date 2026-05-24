const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

module.exports = {
    "Carousel": {
        height: 100,
        width: viewport.width,
        "Div": {
            margin: [0, 0, 18, 0],
            "QuanticoBoldItalic": {
                height: 33,
                size: 27,
                translation: [186, 0],
                vertAlign: "center"
            }
        },
        "_ord_flexList": {
            translation: [156, 0]
        }
    }
};
