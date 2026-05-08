const _ord_flexList = require("./_ord_flexList");
const testItem = require("./TestItem");
const carouselItem = require("./CarouselItem");

const dynamicItem = require("./DynamicItem");


module.exports = {
    ..._ord_flexList,
    ...testItem,
    ...carouselItem,
    ...dynamicItem
};
