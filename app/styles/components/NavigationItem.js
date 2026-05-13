const mixins = require("../mixins");
const palette = mixins["Palette"]

module.exports = {
    "NavigationItem": {
        "&.topbar": {
            "Rectangle": {
                "&#background": {
                    height: 108
                },
                "&#highlight": {
                    height: 108
                },
                "&#textContainer": {
                    "Icon": {
                        height: 108
                    },
                    "QuanticoBold": {
                        height: 108
                    }
                }
            }
        },
        "Rectangle": {
            "&#background": {
                color: "#4b6100FF",
                height: 75,
                opacity: 0
            },
            "&#highlight": {
                color: "#b8bca414",
                height: 75,
                opacity: 0,
                width: 800
            },
            "&#textContainer": {
                color: "#b8bca400",
                "uri": "pkg:/static/images/9patches/fill-18px.9.png",
                "Icon": {
                    color: palette.primaryColor,
                    height: 75,
                    margin: [0, 39, 0, 36],
                    size: 33,
                    width: 33,
                    vertAlign: "center"
                },
                "QuanticoBold": {
                    color: palette.primaryColor,
                    height: 75,
                    margin: [0, 39, 0, -12],
                    size: 24,
                    vertAlign: "center"
                }
            }
        }
    }
};
