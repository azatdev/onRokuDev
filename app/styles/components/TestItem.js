const mixins = require("../mixins");
const palette = mixins["Palette"]

module.exports = {
    "TestItem": {
        "Rectangle#container": {
            color: "#84bef3ff",
        },
        "Label#label": {
            color: palette.primaryColor,
            translation: [33, 33]
        }
    }
};
