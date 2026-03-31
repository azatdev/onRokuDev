const colors = {
    DarkGray: { css: "DarkGray", rgb: [169, 169, 169] },
    DarkRed: { css: "DarkRed", rgb: [139, 0, 0] },
    DarkGreen: { css: "DarkGreen", rgb: [0, 100, 0] }
};

function rgba(rgb, alpha) {
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

function theme(name = "DarkGray") {
    const color = colors[name];

    if (!color) {
        throw new Error(`Unknown theme color: ${name}`);
    }

    return {
        background: color.css,
        "box-shadow": `0 0 1px ${rgba(color.rgb, 0.25)}`,
        color: "#f0f0f0"
    };
}

module.exports = {
    theme
};
