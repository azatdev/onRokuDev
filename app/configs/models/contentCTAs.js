const iconConfig = require("../views/layout/icons");
const Icons = iconConfig["Icons"]

module.exports = {
    "ContentCTAs": [
        {
            id: "CWITEM",
            iconText: Icons.play,
            title: "TKEY_PLAY_NOW",
            activeTitle: "TKEY_CONTINUE_WATCHING"
        },
        {
            id: "FAVORITE",
            dynamicWidth: true,
            iconText: Icons.favorites,
            title: "TKEY_ADD_FAVORITES",
            activeTitle: "TKEY_REMOVE_FAVORITES"
        },
        {
            id: "WATCHLIST",
            dynamicWidth: true,
            iconText: Icons.watchlist,
            title: "TKEY_ADD_WATCHLIST",
            activeTitle: "TKEY_REMOVE_WATCHLIST"
        },
        {
            id: "DETAILS",
            dynamicWidth: true,
            iconText: Icons.ellipsisH,
            title: "TKEY_DETAILS"
        }
    ]
};
