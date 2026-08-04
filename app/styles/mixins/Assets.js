const gradients = {
    "bottomGradient": "pkg:/static/images/gradients/bottom-gradient.webp",
    "contentLeftGradient": "pkg:/static/images/gradients/content-left-gradient.webp",
    "contentTopGradient": "pkg:/static/images/gradients/content-top-gradient.webp",
    "cornerGradient": "pkg:/static/images/gradients/corner-gradient.webp",
    "headerBottom":"pkg:/static/images/gradients/header-image-bottom-gradient.webp",
    "headerLeft": "pkg:/static/images/gradients/header-image-left-gradient.webp",
    "headerTop": "pkg:/static/images/gradients/header-image-top-gradient.webp",
    "headerMask": "pkg:/static/images/gradients/header-image-mask.webp",
    "sidebarGradient": "pkg:/static/images/gradients/sidebar-gradient.webp",
    "topbarMask": "pkg:/static/images/gradients/topbar-mask-white.webp"
}

const ninePatches = {
    "highlightBottom18": "pkg:/static/images/$$RES$$/9patches/highlight-bottom-18px.9.png",
    "highlightTop18": "pkg:/static/images/$$RES$$/9patches/highlight-top-18px.9.png",
    "fill9": "pkg:/static/images/$$RES$$/9patches/fill-9px.9.png",
    "outline918": "pkg:/static/images/$$RES$$/9patches/9px-outline-18px.9.png",
    "rounded6": "pkg:/static/images/$$RES$$/9patches/fill-6px.9.png",
    "rounded18": "pkg:/static/images/$$RES$$/9patches/fill-18px.9.png",
    "tabBottom18": "pkg:/static/images/$$RES$$/9patches/tab-bottom-18px.9.png",
    "tabTop18": "pkg:/static/images/$$RES$$/9patches/tab-top-18px.9.png"
}

const ord = {
    "clippingRect": "pkg:/static/images/thinner_rect.9.png",
    "whiteBlock": "pkg:/static/images/white-block.webp"
}

const player = {
    "playHead": "pkg:/static/images/playhead.webp"
}

module.exports = {
    "Assets": {
        "fonts": {
            "icons": "pkg:/static/fonts/azatroku-icons.ttf",
            "quanticoBold": "pkg:/static/fonts/Quantico-Bold.ttf",
            "quanticoBoldItalic": "pkg:/static/fonts/Quantico-BoldItalic.ttf",
            "quanticoRegular": "pkg:/static/fonts/Quantico-Regular.ttf"
        },
        ...gradients,
        ...ninePatches,
        ...ord,
        ...player
    }
};
