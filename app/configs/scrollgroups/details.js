const mixins = require("../../styles/mixins");
const palette = mixins["Palette"]

module.exports = {
    "DetailsScrollGroup": {
        animationType: "scroll",
        autoFocus: true,
        direction: "vertical",
        flushEnd: true,
        showScrollbar: true,
        scrollBar: {
            show: true,
            track: {
                blendColor: "#FFFFFF80",
                uri: "pkg:/static/images/white-block.webp",
                width: 15
            },
            thumb: {
                blendColor: palette.barColor,
                margin: 0,
                translation: [0, 0],
                width: 15,
                uri: "pkg:/static/images/white-block.webp"
            }
        },
        maxSize: 786
    }
};
