import fs from "fs-extra";
import path from "path";
import { ProgramBuilder, DiagnosticSeverity} from "brighterscript";

const root = path.resolve('./');
const configPath = path.join(root + "/bsconfig.json");

export async function runBuilder() {
    return new Promise((resolve, reject) => {

        const bsConfig = JSON.parse(fs.readFileSync(configPath).toString());

        [bsConfig.stagingDir, bsConfig.outputDir].forEach(
            (dir) => fs.rmSync(dir, { recursive: true, force: true })
        );

        const programBuilder = new ProgramBuilder();

        return programBuilder.run({
            project: configPath,
            // This script already runs through ts-node, so avoid registering it a second time.
            require: [],
            sourceMap: true
        }).then(() => {
            const buildErrors = programBuilder.getDiagnostics().filter((x) => x.severity === DiagnosticSeverity.Error)

            if (buildErrors.length > 0) {
                let errorString = '\n+-+-+-+-+-+-+-+-+-+-+-+-+-+\n'

                buildErrors.forEach(error => errorString += `${error.message} on line ${(error.range.start.line) + 1} in "${error.file.pkgPath}" \n`)

                errorString += '+-+-+-+-+-+-+-+-+-+-+-+-+-+\n'
                throw new Error(errorString);
            }

            resolve(true);
        }).catch(e => {
            console.error(e);
            reject(e)
            process.exit(1);
        });
    });
}

runBuilder()
