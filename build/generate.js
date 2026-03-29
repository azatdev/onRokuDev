import fs from "fs-extra";
import path from "path";
import { ProgramBuilder, DiagnosticSeverity} from "brighterscript";

const root = path.resolve('./');
const configPath = path.join(root + "/bsconfig.json");

export async function runBuilder() {
    return new Promise((resolve, reject) => {
        const programBuilder = new ProgramBuilder();
        return programBuilder.run({
            project: configPath,
            sourceMap: true
        }).then(() => {
            const buildErrors = programBuilder.program.getDiagnostics().filter((x) => x.severity === DiagnosticSeverity.Error)

            if (buildErrors.length === 0) { resolve(true); }

            let errorString = '\n+-+-+-+-+-+-+-+-+-+-+-+-+-+\n'
            errors.forEach(error => errorString += `ERROR: ${error.message} on line ${(error.range.start.line) + 1} in "${error.file.pkgPath}" \n`)
            errorString += '+-+-+-+-+-+-+-+-+-+-+-+-+-+\n'
            throw new Error(errorString);
        }).catch(e => {
            console.error(e);
            reject(e)
            process.exit(1);
        });
    });
}
