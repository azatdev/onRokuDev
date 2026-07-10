

const iconConfig = require("../layout/icons");
const Icons = iconConfig["Icons"]

module.exports = {
    "DetailsCTAs": [
        {
            id: "CWITEM",
            iconText: Icons.play,
            title: "Play Now"
        },
        {
            id: "WATCHLIST",
            dynamicWidth: true,
            iconText: Icons.watchlist,
            title: "Add to watchlist"
        },
        {
            id: "FAVORITE",
            dynamicWidth: true,
            iconText: Icons.favorites,
            title: "Add to favorites"
        },
        {
            id: "DETAILS",
            dynamicWidth: true,
            iconText: Icons.ellipsisH,
            title: "Details"
        }
    ]
};
