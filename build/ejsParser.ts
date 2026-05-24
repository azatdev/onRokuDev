import fs from "fs-extra";
import path from "path";
import ejs from "ejs";
import type { Plugin, ProgramBuilder, SourceObj } from "brighterscript";
import ejsHelpers from "./ejsHelpers";

type Config = {
    configsPath?: string;
    cwd?: string;
    project?: string;
    queryPath?: string;
    stylesPath?: string;
};

type PageData = {
    [key: string]: any;
};

ejs.openDelimiter = "\"<";
ejs.closeDelimiter = ">\"";

function getConfigDir(config: Config) {
    const cwd = config.cwd ?? process.cwd();
    return config.project ? path.dirname(path.resolve(cwd, config.project)) : cwd;
}

function resolveConfigPath(configDir: string, filePath?: string) {
    return filePath ? path.resolve(configDir, filePath) : undefined;
}

function readJson(filePath?: string) {
    return filePath ? JSON.parse(fs.readFileSync(filePath, "utf8")) : {};
}

function getFileSignature(filePath?: string) {
    if (!filePath) {
        return "missing";
    }

    try {
        const stats = fs.statSync(filePath);
        return `${filePath}:${stats.mtimeMs}:${stats.size}`;
    } catch {
        return `${filePath}:missing`;
    }
}

export default function ejsParserPlugin(): Plugin {
    let configData: Config = {};
    let data: PageData = { ...ejsHelpers };
    let lastSignature = "";

    const refreshData = () => {
        const configDir = getConfigDir(configData);
        const stylesPath = resolveConfigPath(configDir, configData.stylesPath);
        const configsPath = resolveConfigPath(configDir, configData.configsPath);
        const queryPath = resolveConfigPath(configDir, configData.queryPath);
        const nextSignature = [
            getFileSignature(stylesPath),
            getFileSignature(configsPath),
            getFileSignature(queryPath)
        ].join("|");

        if (nextSignature === lastSignature) {
            return;
        }

        lastSignature = nextSignature;

        data = {
            ...readJson(stylesPath),
            ...readJson(configsPath),
            ...readJson(queryPath),
            ...ejsHelpers
        };
    };

    return {
        name: "parseEJS",
        beforeProgramCreate: (builder: ProgramBuilder) => {
            const options = builder.options as typeof builder.options & Config;
            configData = {
                configsPath: options.configsPath,
                cwd: options.cwd,
                project: options.project,
                queryPath: options.queryPath,
                stylesPath: options.stylesPath
            };
            refreshData();
        },
        beforeFileParse: (sourceObj: SourceObj) => {
            if (!/\.(bs|brs|xml)$/i.test(sourceObj.srcPath)) {
                return;
            }

            refreshData();

            try {
                sourceObj.source = ejs.render(sourceObj.source, data, {
                    filename: sourceObj.srcPath
                });
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                throw new Error(`EJS preprocessing failed for ${sourceObj.srcPath}: ${message}`);
            }
        }
    };
}
