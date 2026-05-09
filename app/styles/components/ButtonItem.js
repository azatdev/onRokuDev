const mixins = require("../mixins");
const palette = mixins["Palette"]

module.exports = {
    "ButtonItem": {
        "Rectangle#textContainer": {
            color: "#33333300",
            "uri": "pkg:/static/images/9patches/fill-18px.9.png",
            "Icon": {
                color: palette.primaryColor,
                height: 75,
                margin: [0, 39, 0, 39],
                size: 30,
                vertAlign: "center"
            },
            "QuanticoBold#label": {
                color: palette.primaryColor,
                height: 75,
                margin: [0, 39, 0, -12],
                size: 24,
                vertAlign: "center"
            }
        },
        // "color": "#FFFFFF00",
        // "translation": [200, 200],
        // "Rectangle#textContainer": {
        //     color: "#FFFFFF00",

        // },
        "Poster#background": {
            blendColor: "#4b6100",
            "uri": "pkg:/static/images/9patches/fill-18px.9.png",
        },
        "Poster#highlightBottom": {
            "blendColor": `${palette.primaryColor}14`,
            "uri": "pkg:/static/images/9patches/highlight-bottom-18px.9.png"
        },
        "Poster#highlightTop": {
            blendColor: `${palette.primaryColor}14`,
            "uri": "pkg:/static/images/9patches/highlight-top-18px.9.png"
        },
    }
};
