const fs = require("fs");
const net = require("net");
const path = require("path");

const styles = require(path.resolve(__dirname, "../app/styles/styles.js"));
const outputPath = path.resolve(__dirname, "styles.json");
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
                type: "styles-update-request",
                message: "build/styles.json"
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
    fs.writeFileSync(outputPath, `${JSON.stringify(styles)}\n`);

    console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
    await notifySocketServer();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
