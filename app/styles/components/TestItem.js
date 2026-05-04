const mixins = require("../mixins");
const palette = mixins["Palette"]

module.exports = {
    "TestItem": {
        "Rectangle#container": {
            color: "#84bef380",
        },
        "Label#label": {
            color: palette.primaryColor,
            translation: [33, 33]
        }
    }
};
