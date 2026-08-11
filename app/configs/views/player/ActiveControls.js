const iconConfig = require("../layout/icons");
const Icons = iconConfig["Icons"]

module.exports = {
    "ActiveControls": {
        "playControl": {
            id: "playControl",
            icons: [Icons.playSquare],
            opacity: 1,
            title: "TKEY_PLAY"
        },
        "seekControl": {
            id: "seekControl",
            icons: [Icons.seekRW, Icons.seekFF],
            opacity: 1,
            title: "TKEY_SEEKING"
        },
        "scrubControl": {
            id: "scrubControl",
            icons: [Icons.seekRW, Icons.seekFF],
            opacity: 1,
            title: "TKEY_SCRUBBING"
        },
        "restartControl": {
            id: "restartControl",
            icons: [Icons.replay],
            opacity: 1,
            title: "TKEY_RESTART"
        },
        "ccControl": {
            id: "ccControl",
            icons: [Icons.cc],
            opacity: 1,
            title: "TKEY_CCOPTIONS"
        }
    }
};
