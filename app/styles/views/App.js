const mixins = require("../mixins");
const palette = mixins["Palette"]

module.exports = {
    "App": {
        "backgroundColor": "#000000ff",
        "backgroundUri": "",
        opacity: 1,
        "Background": {
        "visible": true
        },
        "Rectangle#rect1": {
            // clippingRect: [0, -100, 300, 230],
            color: "#c51010ff",
            opacity: .9,
            height: 213,
            width: 1129,
            translation: [157, 459.75],
        },
        "Rectangle#rect2": {
            color: "#FFFFFF",
            height: 861.75,
            opacity: 0.5,
            translation: [1487, 9.75],
            width: 273
        },
        "Group#container": {
            "_ord_flexList#first_list": {
                color: "#bad7fc00",
                translation: [153, 450],
                // width: 1008,
            },
            "_ord_flexList#second_list": {
                color: "#bad7fc00",
                // translation: [1450, 0]
                translation: [0, 780],
            },
            "_ord_flexList#ctas_list": {
                color: "#bad7fc00",
                // translation: [1450, 0]
                translation: [150, 150],
            },
            "_ord_flexList#third_list": {
                color: "#bad7fc00",
                translation: [120, 300],
                // translation: [1450, 40]
            }
        }
        // "Poster#mask": {
        //     "height": 600,
        //     "uri": "pkg:/static/images/grad_lin_l2r_hd.png",
        //     "width": 1000
        // },
        // "MaskGroup": {
        //     "masksize": [0, 0],
        //     "maskOffset": [0, 0],
        //     "maskuri": "pkg:/static/images/gradients/topbar-mask-white.webp",
        //     "translation": [0, 600],
        //     "Poster": {
        //         // "rotation": -1.5708
        //         "width": 1000,
        //         "height": 288,
        //         "blendColor": "#df0d0dff",
        //         "scaleRotateCenter": [0, 0],
        //         "uri": "pkg:/static/images/9patches/fill-18px.9.png",
        //         "rotation": 1.5708
        //     }
        // }
    }
};
