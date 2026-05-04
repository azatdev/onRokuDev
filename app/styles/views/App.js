module.exports = {
    "App": {
        opacity: 1,
        visible: true,
        "Group#container": {
            translation: [0, 0],
            "Label": {
                color: "#190c8bff",
                translation: [33, 33],
                width: 0
            },
            "Label#title": {
                color: "#f3efebff"
            }
        },
        "Rectangle#rect1": {
            // clippingRect: [0, -100, 300, 230],
            color: "#FF0000",
            opacity: 0.2,
            height: 321,
            width: 1800,
            translation: [120, 450],
            "Rectangle#rect2": {
                color: "#FFFFFF",
                height: 300,
                opacity: 0,
                translation: [-60, -100],
                width: 300
            },
        },
        "_ord_flexList#first_list": {
            color: "#bad7fc80",
            translation: [120, 99],
            // width: 1008
        },
        "_ord_flexList#second_list": {
            color: "#bad7fc00",
            translation: [1450, 45]
        },
        "_ord_flexList#third_list": {
            color: "#bad7fc80",
            translation: [120, 840]
        }
    }
};
