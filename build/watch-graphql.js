const path = require("path");
const { spawn } = require("child_process");
const chokidar = require("chokidar");

const graphqlDir = path.resolve(__dirname, "../app/graphql");
const buildGraphqlCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const buildGraphqlArgs = ["run", "build:graphql"];
const watchInterval = Number(process.env.GRAPHQL_WATCH_INTERVAL || 250);

let isRunning = false;
let hasPendingRun = false;
let debounceTimer = null;

function scheduleGraphqlBuild(reason) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        runGraphqlBuild(reason);
    }, 150);
}

function runGraphqlBuild(reason) {
    if (isRunning) {
        hasPendingRun = true;
        return;
    }

    isRunning = true;
    hasPendingRun = false;

    console.log(`GraphQL changed (${reason}). Running npm run build:graphql...`);

    const child = spawn(buildGraphqlCommand, buildGraphqlArgs, {
        cwd: path.resolve(__dirname, ".."),
        stdio: "inherit"
    });

    child.on("exit", (code) => {
        isRunning = false;

        if (code === 0) {
            console.log("GraphQL build finished.");
        } else {
            console.error(`GraphQL build failed with exit code ${code}.`);
        }

        if (hasPendingRun) {
            runGraphqlBuild("queued change");
        }
    });
}

const watcher = chokidar.watch(graphqlDir, {
    ignoreInitial: true,
    usePolling: true,
    interval: watchInterval,
    awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100
    }
});

watcher
    .on("add", (filePath) => scheduleGraphqlBuild(`add ${path.relative(graphqlDir, filePath)}`))
    .on("change", (filePath) => scheduleGraphqlBuild(`change ${path.relative(graphqlDir, filePath)}`))
    .on("unlink", (filePath) => scheduleGraphqlBuild(`unlink ${path.relative(graphqlDir, filePath)}`))
    .on("error", (error) => {
        console.error(`GraphQL watcher error: ${error.message}`);
    })
    .on("ready", () => {
        console.log(`Watching ${graphqlDir} for changes with polling every ${watchInterval}ms...`);
    });
