const mixins = require("../mixins");
const palette = mixins["Palette"]
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]
const player = dimensions["player"]


const scrubBarWidth = viewport.width - (player.sideMargin * 2)

module.exports = {
    "Trickplay": {
    }
};
