const mixins = require("../mixins");
const palette = mixins["Palette"];
const dimensions = mixins["Dimensions"];
const viewport = dimensions["viewport"];

const sideMargin = 84
const controlsHeight = 204
const controlsWidth = viewport.width - (sideMargin * 2)

module.exports = {
    "VideoControls": {
        height: controlsHeight,
        translation: [sideMargin, viewport.height - controlsHeight],
        width: controlsWidth,
        "Div": {
            "&#gradients": {
                "&#bottomGradient": {
                    ...gradients.BottomGradient
                },
                "&#topGradient": {
                    ...gradients.TopGradient
                }
            },
            "&#info": {
                height: 123,
                "Quantico": {
                    size: 30,
                    width: 300,
                    wrap: false,
                    "&#durationLabel": {
                        horizAlign: "right",
                        translation: [controlsWidth - 300, 0]
                    }
                }
            }
        }
    }
};
