const { spawnSync } = require("child_process");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });

const { ROKU_IP, ROKU_PASS } = process.env;

if (!ROKU_IP || !ROKU_PASS) {
    console.error("Missing ROKU_IP or ROKU_PASS in .env");
    process.exit(1);
}

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(
    command,
    [
        "rooibos",
        "--project",
        "bsconfig.test.json",
        "--host",
        ROKU_IP,
        "--password",
        ROKU_PASS,
        ...process.argv.slice(2)
    ],
    { stdio: "inherit" }
);

if (result.error) {
    console.error(result.error.message);
    process.exit(1);
}

process.exit(result.status ?? 1);
