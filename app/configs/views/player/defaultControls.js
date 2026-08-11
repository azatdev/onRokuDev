const iconConfig = require("../layout/icons");
const Icons = iconConfig["Icons"]

module.exports = {
    "DefaultControls": [
        {
            id: "playControl",
            icons: [Icons.pause],
            opacity: 0.6,
            title: "TKEY_PAUSE"
        },
        {
            id: "seekControl",
            icons: [Icons.seekRW, Icons.seekFF],
            opacity: 0.6,
            title: "TKEY_SEEK"
        },
        {
            id: "scrubControl",
            icons: [Icons.caretLeft, Icons.caretRight],
            opacity: 0.6,
            title: "TKEY_SCRUB"
        },
        {
            id: "restartControl",
            icons: [Icons.replay],
            opacity: 0.6,
            title: "TKEY_RESTART"
        },
        {
            id: "ccControl",
            icons: [Icons.cc],
            opacity: 0.6,
            title: "TKEY_CCOPTIONS"
        }
    ]
};
