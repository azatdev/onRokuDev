const testItem = require("./TestItem");
const dynamicItem = require("./DynamicItem");


module.exports = {
    ...testItem,
    ...dynamicItem
};
