const gradients = {
    "bottomGradient": "pkg:/assets/images/gradients/bottom-gradient.webp",
    "contentLeftGradient": "pkg:/assets/images/gradients/content-left-gradient.webp",
    "contentTopGradient": "pkg:/assets/images/gradients/content-top-gradient.webp",
    "cornerGradient": "pkg:/assets/images/gradients/corner-gradient.webp",
    "headerBottom":"pkg:/assets/images/gradients/header-image-bottom-gradient.webp",
    "headerLeft": "pkg:/assets/images/gradients/header-image-left-gradient.webp",
    "headerTop": "pkg:/assets/images/gradients/header-image-top-gradient.webp",
    "headerMask": "pkg:/assets/images/gradients/header-image-mask.webp",
    "sidebarGradient": "pkg:/assets/images/gradients/sidebar-gradient.webp",
    "topbarMask": "pkg:/assets/images/gradients/topbar-mask-white.webp"
}

const ninePatches = {
    "highlightBottom18": "pkg:/assets/images/$$RES$$/9patches/highlight-bottom-18px.9.png",
    "highlightTop18": "pkg:/assets/images/$$RES$$/9patches/highlight-top-18px.9.png",
    "fill9": "pkg:/assets/images/$$RES$$/9patches/fill-9px.9.png",
    "outline918": "pkg:/assets/images/$$RES$$/9patches/9px-outline-18px.9.png",
    "rounded6": "pkg:/assets/images/$$RES$$/9patches/fill-6px.9.png",
    "rounded18": "pkg:/assets/images/$$RES$$/9patches/fill-18px.9.png",
    "tabBottom18": "pkg:/assets/images/$$RES$$/9patches/tab-bottom-18px.9.png",
    "tabTop18": "pkg:/assets/images/$$RES$$/9patches/tab-top-18px.9.png"
}

const ord = {
    "clippingRect": "pkg:/assets/images/thinner_rect.9.png",
    "whiteBlock": "pkg:/assets/images/white-block.webp"
}

const player = {
    "playHead": "pkg:/assets/images/playhead.webp"
}

module.exports = {
    "Assets": {
        "fonts": {
            "icons": "pkg:/assets/fonts/azatroku-icons.ttf",
            "quanticoBold": "pkg:/assets/fonts/Quantico-Bold.ttf",
            "quanticoBoldItalic": "pkg:/assets/fonts/Quantico-BoldItalic.ttf",
            "quanticoRegular": "pkg:/assets/fonts/Quantico-Regular.ttf"
        },
        ...gradients,
        ...ninePatches,
        ...ord,
        ...player
    }
};
