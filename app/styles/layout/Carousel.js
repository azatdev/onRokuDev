const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]

module.exports = {
    "Carousel": {
        height: 100,
        margin: [0, 0, 27, 0],
        width: viewport.width,
        "Div": {
            margin: [0, 0, 24, 0],
            "QuanticoBoldItalic": {
                height: 33,
                size: 27,
                translation: [186, 0],
                vertAlign: "center"
            }
        },
        "_ord_flexList": {
            translation: [156, 0]
        },
        "&.portrait": {
            "Div": {
                margin: [0, 0, 9, 0],
            },
            "_ord_flexList": {
                translation: [156, 0]
            },
        },
        "&.noTitle": {
            "Div": {
                visible: false
            }
        }

    }
};
