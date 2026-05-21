const fs = require("fs");
const net = require("net");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });

const configs = require(path.resolve(__dirname, "../app/configs/configs.js"));
const outputPath = path.resolve(__dirname, "configs.json");
const notifyHost = process.env.STYLES_NOTIFY_HOST || "127.0.0.1";
const notifyPort = Number(process.env.SOCKET_SERVER_PORT || 54320);

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
                type: "configs-update-request",
                message: "build/configs.json"
            })}\n`);
        });

        socket.setTimeout(1000);

        socket.on("close", () => {
            finish(true);
        });

        socket.on("timeout", () => {
            console.log("Socket server timed out; skipped configs-update broadcast.");
            socket.destroy();
            finish(false);
        });

        socket.on("error", (error) => {
            if (["ECONNREFUSED", "EPERM", "EACCES"].includes(error.code)) {
                console.log("Socket server is unavailable; skipped configs-update broadcast.");
            } else {
                console.log(`Socket server notify failed: ${error.message}`);
            }

            finish(false);
        });
    });
}

async function main() {
    fs.writeFileSync(outputPath, `${JSON.stringify(configs)}\n`);

    console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
    await notifySocketServer();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
