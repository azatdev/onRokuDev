

const iconConfig = require("../layout/icons");
const Icons = iconConfig["Icons"]

module.exports = {
    "ContentCTAs": [
        {
            iconText: Icons.play,
            title: "TK_PLAY_NOW"
        },
        {
            dynamicWidth: true,
            iconText: Icons.watchlist,
            title: "TK_ADD_WATCHLIST"
        },
        {
            dynamicWidth: true,
            iconText: Icons.favorites,
            title: "TK_ADD_FAVORITES"
        },
        {
            dynamicWidth: true,
            iconText: Icons.ellipsisH,
            title: "TK_DETAILS"
        }
    ]
};
