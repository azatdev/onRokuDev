import fs from "fs-extra";
import ejs from "ejs";
import { parse, resolve } from "path";
import { Plugin, SourceObj } from 'brighterscript';

type Config = {
    configsPath: string;
    stylesPath: string;
}

type PageData = {
    [key: string]: any
}


ejs.openDelimiter = "\"<";
ejs.closeDelimiter = ">\"";

import ejsHelpers from "./ejsHelpers";


// function hydrateFile(fileData:string, additionalData:object = {}) {
//     const parsedFileData = JSON.parse(fileData)
//     const parsedData = Object.assign(parsedFileData, additionalData)

//     let done = false;
//     let compiled = ""

//     while(!done) {
//         compiled = ejs.render(fileData, {
//             ...parsedData,
//             ...ejsHelpers
//         });

//         const found = compiled.match(/(?<=\"<)(.*)(?=>\")/g);

//         if (!found) done = true;
//         fileData = compiled
//     }

//     return JSON.parse(compiled)
// }

export function ejsParser(config: Config) {

    const styleData = JSON.parse(fs.readFileSync(config.stylesPath).toString("utf8"));
    const configData = JSON.parse(fs.readFileSync(config.configsPath).toString("utf8"));

    const data = {
        ...styleData,
        ...configData,
        ...ejsHelpers
    };

    console.log("data", data)

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
