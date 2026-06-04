const fs = require("fs");
const net = require("net");
const path = require("path");
const { isDeepStrictEqual } = require("util");

const styles = require(path.resolve(__dirname, "../app/styles/styles.js"));
const outputPath = path.resolve(__dirname, "styles.json");
const updateOutputPath = path.resolve(__dirname, "styles-update.json");
const notifyHost = process.env.STYLES_NOTIFY_HOST || "127.0.0.1";
const notifyPort = Number(process.env.SOCKET_SERVER_PORT || 54320);

function isPlainObject(value) {
    if (value === null || Array.isArray(value) || typeof value !== "object") {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
}

function readJsonFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return undefined;
    }

    const fileText = fs.readFileSync(filePath, "utf8").trim();
    if (fileText.length === 0) {
        return undefined;
    }

    return JSON.parse(fileText);
}

function writeJsonFile(filePath, payload) {
    fs.writeFileSync(filePath, `${JSON.stringify(payload)}\n`);
}

function createMergePatch(previousValue, nextValue) {
    if (typeof previousValue === "undefined") {
        return nextValue;
    }

    if (isDeepStrictEqual(previousValue, nextValue)) {
        return undefined;
    }

    if (!isPlainObject(previousValue) || !isPlainObject(nextValue)) {
        return nextValue;
    }

    const patch = {};
    const allKeys = new Set([
        ...Object.keys(previousValue),
        ...Object.keys(nextValue)
    ]);

    for (const key of allKeys) {
        if (!Object.prototype.hasOwnProperty.call(nextValue, key)) {
            patch[key] = null;
            continue;
        }

        const childPatch = createMergePatch(previousValue[key], nextValue[key]);
        if (typeof childPatch !== "undefined") {
            patch[key] = childPatch;
        }
    }

    return Object.keys(patch).length > 0 ? patch : undefined;
}

function notifySocketServer() {
    return new Promise((resolve) => {
        let isSettled = false;

        function finish(didNotify) {
            if (isSettled) {
                return;
            }

            isSettled = true;
            resolve(didNotify);
        }

        const socket = net.createConnection({
            host: notifyHost,
            port: notifyPort
        }, () => {
            socket.end(`${JSON.stringify({
                type: "styles-update-request",
                message: "build/styles-update.json"
            })}\n`);
        });

        socket.setTimeout(1000);

        socket.on("close", () => {
            finish(true);
        });

        socket.on("timeout", () => {
            console.log("Socket server timed out; skipped styles-update broadcast.");
            socket.destroy();
            finish(false);
        });

        socket.on("error", (error) => {
            if (["ECONNREFUSED", "EPERM", "EACCES"].includes(error.code)) {
                console.log("Socket server is unavailable; skipped styles-update broadcast.");
            } else {
                console.log(`Socket server notify failed: ${error.message}`);
            }

            finish(false);
        });
    });
}

async function main() {
    const previousStyles = readJsonFile(outputPath);
    const stylesUpdate = createMergePatch(previousStyles, styles) ?? {};
    const hasStyleChanges = Object.keys(stylesUpdate).length > 0;

    writeJsonFile(outputPath, styles);
    writeJsonFile(updateOutputPath, stylesUpdate);

    console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
    console.log(`Wrote ${path.relative(process.cwd(), updateOutputPath)}`);

    if (!hasStyleChanges) {
        console.log("No semantic style changes detected; skipped styles-update broadcast.");
        return;
    }

    await notifySocketServer();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
