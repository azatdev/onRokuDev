const mixins = require("../../styles/mixins");
const assets = mixins["Assets"]
const palette = mixins["Palette"]

module.exports = {
    "DetailsScrollGroup": {
        animationType: "scroll",
        autoFocus: true,
        direction: "vertical",
        flushEnd: true,
        scrollBar: {
            show: true,
            track: {
                blendColor: "#FFFFFF80",
                uri: assets.whiteBlock,
                width: 15
            },
            thumb: {
                blendColor: palette.barColor,
                margin: 0,
                translation: [0, 0],
                width: 15,
                uri: assets.whiteBlock
            }
        },
        maxSize: 786
    }
};
