const iconConfig = require("../layout/icons");
const Icons = iconConfig["Icons"]

module.exports = {
    "DefaultControls": [
        {
            id: "playControl",
            icons: [Icons.playSquare],
            opacity: 0.6,
            title: "TKEY_PLAY"
        },
        {
            id: "seekControl",
            icons: [Icons.seekRW, Icons.seekFF],
            opacity: 0.6,
            title: "TKEY_SEEK15S"
        },
        {
            id: "scrubControl",
            icons: [Icons.caretLeft, Icons.caretRight],
            opacity: 0.6,
            title: "TKEY_SCRUB"
        },
        {
            id: "ccControl",
            icons: [Icons.cc],
            opacity: 0.6,
            title: "TKEY_CCOPTIONS"
        },
        {
            id: "restartControl",
            icons: [Icons.replay],
            opacity: 0.6,
            title: "TKEY_RESTART"
        }
    ]
};
