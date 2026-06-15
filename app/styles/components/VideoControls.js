const mixins = require("../mixins");
const palette = mixins["Palette"];
const dimensions = mixins["Dimensions"];
const gradients = mixins["Gradients"];
const viewport = dimensions["viewport"];
const player = dimensions["player"];

const controlsWidth = viewport.width - (player.sideMargin * 2)

module.exports = {
    "VideoControls": {
        
        "Div": {
            "&#contentContainer": {
                translation: [player.sideMargin, 66],
                "PlayerHeader": {
                    margin: [24, 0, 0, 0]
                }
            },
            "&#gradients": {
                "Poster": {
                    "&#bottomGradient": {
                        ...gradients.BottomGradient
                    },
                    "&#topGradient": {
                        ...gradients.TopGradient
                    }
                }
            },
            "&#container": {
                height: player.controlsHeight,
                translation: [player.sideMargin, viewport.height - player.controlsHeight],
                width: controlsWidth,
                "Div": {
                    "&#info": {
                        height: 114,
                        "Quantico": {
                            size: 30,
                            translation: [0, 9],
                            width: 300,
                            wrap: false,
                            "&#durationLabel": {
                                horizAlign: "right",
                                translation: [controlsWidth - 300, 9]
                            }
                        }
                    }
                }
            }
        }
    }
};
