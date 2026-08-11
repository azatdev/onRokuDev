const path = require("path");
const { spawn } = require("child_process");
const chokidar = require("chokidar");

const configsDir = path.resolve(__dirname, "../app/configs");
const buildConfigsCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const buildConfigsArgs = ["run", "build:configs"];
const watchInterval = Number(process.env.CONFIGS_WATCH_INTERVAL || 250);

let isRunning = false;
let hasPendingRun = false;
let debounceTimer = null;

function scheduleConfigBuild(reason) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        runConfigBuild(reason);
    }, 150);
}

function runConfigBuild(reason) {
    if (isRunning) {
        hasPendingRun = true;
        return;
    }

    isRunning = true;
    hasPendingRun = false;

    console.log(`Configs changed (${reason}). Running npm run build:configs...`);

    const child = spawn(buildConfigsCommand, buildConfigsArgs, {
        cwd: path.resolve(__dirname, ".."),
        stdio: "inherit"
    });

    child.on("exit", (code) => {
        isRunning = false;

        if (code === 0) {
            console.log("Config build finished.");
        } else {
            console.error(`Config build failed with exit code ${code}.`);
        }

        if (hasPendingRun) {
            runConfigBuild("queued change");
        }
    });
}

const watcher = chokidar.watch(configsDir, {
    ignoreInitial: true,
    usePolling: true,
    interval: watchInterval,
    awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100
    }
});

watcher
    .on("add", (filePath) => scheduleConfigBuild(`add ${path.relative(configsDir, filePath)}`))
    .on("change", (filePath) => scheduleConfigBuild(`change ${path.relative(configsDir, filePath)}`))
    .on("unlink", (filePath) => scheduleConfigBuild(`unlink ${path.relative(configsDir, filePath)}`))
    .on("error", (error) => {
        console.error(`Config watcher error: ${error.message}`);
    })
    .on("ready", () => {
        console.log(`Watching ${configsDir} for changes with polling every ${watchInterval}ms...`);
    });
