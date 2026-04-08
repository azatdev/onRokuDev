import fs from "fs-extra";
import ejs from "ejs";
import { parse, resolve } from "path";
import { Plugin, TranspileObj, BscFile, BeforeFileTranspileEvent, SourceObj, isXmlFile, isBrsFile } from 'brighterscript';

type Config = {
    stylesPath: string;
}

type PageData = {
    [key: string]: any
}


ejs.openDelimiter = "\"{{";
ejs.closeDelimiter = "}}\"";

import ejsHelpers from "./ejsHelpers";


function hydrateFile(fileData:string, additionalData:object = {}) {
    const parsedFileData = JSON.parse(fileData)
    const parsedData = Object.assign(parsedFileData, additionalData)

    let done = false;
    let compiled = ""

    // Allowing for multiple passes to render 'partials'
    while(!done) {
        compiled = ejs.render(fileData, {
            ...parsedData,
            ...ejsHelpers
        });

        const found = compiled.match(/(?<=\"{{)(.*)(?=}}\")/g);

        if (!found) done = true;
        fileData = compiled
    }

    return JSON.parse(compiled)
}

export function ejsParser(config: Config) {
    let productData = hydrateFile(fs.readFileSync(config.stylesPath).toString("utf8"));

    const data = {
        ...productData,
        ...ejsHelpers
    };

    return {
        name: 'parseEJS',
        beforeFileParse: (sourceObj: SourceObj) => {
            try {
                if (!/\.(bs|brs|xml)$/i.test(sourceObj.srcPath)) {
                    return;
                }

                sourceObj.source = ejs.render(sourceObj.source, data);
            } catch (error) {
                console.log(sourceObj.srcPath, error);
                process.exit(1);
            }
        }
    } as Plugin;
};
