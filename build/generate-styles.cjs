const fs = require("fs");
const path = require("path");

const styles = require(path.resolve(__dirname, "../app/styles/styles.js"));
const outputPath = path.resolve(__dirname, "../app/source/styles.json");

fs.writeFileSync(outputPath, `${JSON.stringify(styles)}\n`);

console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
