const fs = require("fs");
const path = require("path");
const { loadDocumentsSync } = require("@graphql-tools/load");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const { Kind, print, stripIgnoredCharacters } = require("graphql");

const graphqlDir = path.resolve(__dirname, "../app/graphql");
const outputPath = path.resolve(__dirname, "query.json");

function getGraphqlFiles(dirPath) {
    if (!fs.existsSync(dirPath)) {
        return [];
    }

    const files = [];

    for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
        const entryPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            files.push(...getGraphqlFiles(entryPath));
            continue;
        }

        if (entry.isFile() && /\.(graphql|gql)$/i.test(entry.name)) {
            files.push(entryPath);
        }
    }

    return files.sort();
}

function collectFragmentSpreads(node, fragmentNames = []) {
    if (!node || !node.selectionSet || !Array.isArray(node.selectionSet.selections)) {
        return fragmentNames;
    }

    for (const selection of node.selectionSet.selections) {
        if (selection.kind === Kind.FRAGMENT_SPREAD) {
            fragmentNames.push(selection.name.value);
        }

        collectFragmentSpreads(selection, fragmentNames);
    }

    return fragmentNames;
}

function collectFragments(definition, fragmentMap, collected = new Map()) {
    const fragmentNames = collectFragmentSpreads(definition);

    for (const fragmentName of fragmentNames) {
        if (collected.has(fragmentName)) {
            continue;
        }

        const fragmentDefinition = fragmentMap.get(fragmentName);
        if (!fragmentDefinition) {
            throw new Error(`Missing fragment definition for "${fragmentName}".`);
        }

        collected.set(fragmentName, fragmentDefinition);
        collectFragments(fragmentDefinition, fragmentMap, collected);
    }

    return collected;
}

function buildQueryPayload(documentSources) {
    const fragmentMap = new Map();
    const operationDefinitions = [];

    for (const source of documentSources) {
        const definitions = source.document?.definitions ?? [];

        for (const definition of definitions) {
            if (definition.kind === Kind.FRAGMENT_DEFINITION) {
                const fragmentName = definition.name.value;

                if (fragmentMap.has(fragmentName)) {
                    throw new Error(`Duplicate fragment definition "${fragmentName}" in ${source.location}.`);
                }

                fragmentMap.set(fragmentName, definition);
            } else if (definition.kind === Kind.OPERATION_DEFINITION) {
                operationDefinitions.push({
                    definition,
                    location: source.location
                });
            }
        }
    }

    const queryMap = {};

    for (const operation of operationDefinitions) {
        const operationName = operation.definition.name?.value ?? "";
        if (!operationName) {
            throw new Error(`Operation in ${operation.location} must be named to be exported in QUERY.`);
        }

        if (Object.prototype.hasOwnProperty.call(queryMap, operationName)) {
            throw new Error(`Duplicate operation definition "${operationName}" found in ${operation.location}.`);
        }

        const fragments = collectFragments(operation.definition, fragmentMap);
        const document = {
            kind: Kind.DOCUMENT,
            definitions: [
                operation.definition,
                ...Array.from(fragments.values())
            ]
        };

        queryMap[operationName] = stripIgnoredCharacters(print(document).trim());
    }

    return {
        QUERY: queryMap
    };
}

function main() {
    const graphqlFiles = getGraphqlFiles(graphqlDir);
    const documentSources = graphqlFiles.length > 0
        ? loadDocumentsSync(graphqlFiles, {
            loaders: [new GraphQLFileLoader()]
        })
        : [];

    const queryPayload = buildQueryPayload(documentSources);
    fs.writeFileSync(outputPath, `${JSON.stringify(queryPayload)}\n`);

    console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
}

try {
    main();
} catch (error) {
    console.error(error);
    process.exit(1);
}
