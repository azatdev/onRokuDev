const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(process.cwd(), ".env");

function getEnvConfig() {
    if (!fs.existsSync(envPath)) {
        return {};
    }

    const envFile = fs.readFileSync(envPath, "utf8");
    const parsedEnv = dotenv.parse(envFile);
    const envConfig = {};

    for (const envKey of Object.keys(parsedEnv)) {
        envConfig[envKey] = process.env[envKey] ?? parsedEnv[envKey];
    }

    return envConfig;
}

module.exports = {
    "ENV": getEnvConfig()
};
