const mixins = require("../mixins");
const dimensions = mixins["Dimensions"]
const gradients = mixins["Gradients"]
const viewport = dimensions["viewport"]

module.exports = {
    "Sidebar": {
        "opacity": 0,
        "color": "#5d24691a",
        "openColor": "#251a38",
        "height": viewport.height,
        "ord_flexList":{
            "translation": [0, 162]
        },
        "Poster": {
            ...gradients.NavigationGradient
        }
    }
};
