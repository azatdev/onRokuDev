const mixins = require("../mixins");
const assets = mixins["Assets"]
const dimensions = mixins["Dimensions"]
const palette = mixins["Palette"]

module.exports = {
    "ToastItem": {
        "opacity": 1,
        "Poster": {
            "blendColor": palette.modalBackground,
            "uri": assets.rounded18,
            "&#toastItemContainer": {
                "QuanticoBold": {
                    "lineSpacing": 0,
                    "margin": dimensions.toaster.margin,
                    "width": dimensions.toaster.width - dimensions.toaster.margin[1] * 2,
                    "wrap": true,
                    "size": 24
                },
            },
            "&#progress": {
                "opacity": 0.1,
            },
            "&.info": {
                "blendColor": palette.primaryColor
            },
            "&.warning": {
                "blendColor": palette.warningColor
            },
            "&.error": {
                "blendColor": palette.errorColor
            }
        }
    }
};
