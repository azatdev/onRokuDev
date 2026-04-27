const mixins = require("../mixins");
const palette = mixins["Palette"]

module.exports = {
    "TestItem": {
        "Rectangle#container": {
            color: "#9455adff",
            "Label#label": {
                color: palette.primaryColor,
                translation: [33, 33]
            }
        }
    }
};
