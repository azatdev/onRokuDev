const path = require("path");
const { spawn } = require("child_process");
const chokidar = require("chokidar");

const stylesDir = path.resolve(__dirname, "../app/styles");
const buildStylesCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const buildStylesArgs = ["run", "build:styles"];
const watchInterval = Number(process.env.STYLES_WATCH_INTERVAL || 250);

let isRunning = false;
let hasPendingRun = false;
let debounceTimer = null;

function scheduleStyleBuild(reason) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        runStyleBuild(reason);
    }, 150);
}

function runStyleBuild(reason) {
    if (isRunning) {
        hasPendingRun = true;
        return;
    }

    isRunning = true;
    hasPendingRun = false;

    console.log(`Styles changed (${reason}). Running npm run build:styles...`);

    const child = spawn(buildStylesCommand, buildStylesArgs, {
        cwd: path.resolve(__dirname, ".."),
        stdio: "inherit"
    });

    child.on("exit", (code) => {
        isRunning = false;

        if (code === 0) {
            console.log("Style build finished.");
        } else {
            console.error(`Style build failed with exit code ${code}.`);
        }

        if (hasPendingRun) {
            runStyleBuild("queued change");
        }
    });
}

const watcher = chokidar.watch(stylesDir, {
    ignoreInitial: true,
    usePolling: true,
    interval: watchInterval,
    awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100
    }
});

watcher
    .on("add", (filePath) => scheduleStyleBuild(`add ${path.relative(stylesDir, filePath)}`))
    .on("change", (filePath) => scheduleStyleBuild(`change ${path.relative(stylesDir, filePath)}`))
    .on("unlink", (filePath) => scheduleStyleBuild(`unlink ${path.relative(stylesDir, filePath)}`))
    .on("error", (error) => {
        console.error(`Style watcher error: ${error.message}`);
    })
    .on("ready", () => {
        console.log(`Watching ${stylesDir} for changes with polling every ${watchInterval}ms...`);
    });
