

const iconConfig = require("../layout/icons");
const Icons = iconConfig["Icons"]

module.exports = {
    "DetailsCTAs": [
        {
            id: "play",
            iconText: Icons.play,
            title: "Play Now"
        },
        {
            id: "addWatchlist",
            dynamicWidth: true,
            iconText: Icons.watchlist,
            title: "Add to watchlist"
        },
        {
            id: "addFavorites",
            dynamicWidth: true,
            iconText: Icons.favorites,
            title: "Add to favorites"
        },
        {
            id: "details",
            dynamicWidth: true,
            iconText: Icons.ellipsisH,
            title: "Details"
        }
    ]
};
