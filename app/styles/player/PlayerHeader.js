const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const viewport = dimensions["viewport"]
const player = dimensions["player"]

const scrubBarWidth = viewport.width - (player.sideMargin * 2)

module.exports = {
    "PlayerHeader": {
        "width": scrubBarWidth,
        "Div": {
            "Metadata": {
                "height": 48,
                "width": 642
            },
            "QuanticoBold": {
                "maxLines": 2,
                "size": 48,
                "height": 81,
                "margin": [0, 0, 9, 0],
                "vertAlign": "center",
                "width": 1600,
                "wrap": true
            }
        }
    }
};
