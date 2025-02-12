//@ts-check

import {TypeExtractor} from "peggy-to-ts";
import {readFileSync, writeFileSync} from "fs";
import {Project} from "ts-morph";

const source = readFileSync("./src/autoit3.pegjs").toString();
const typeExtractor = new TypeExtractor(source, {camelCaseTypeNames: true, removeReadonlyKeyword: true});
typeExtractor.getTypes().then((types) => {
    writeFileSync('./out/autoit3.d.ts', "\nexport namespace AutoIt3 {\n"+types+"\n}\n", {flag: 'a+'});

    const project = new Project();
    const file = project.addSourceFileAtPath('./out/autoit3.d.ts');

    const namespace = file.getModule("AutoIt3");
    if (namespace === undefined) {
        throw new Error('namespace "AutoIt3" not found');
    }

    const alias = namespace.getTypeAlias("MemberExpression");
    if (alias === undefined) {
        throw new Error('type "MemberExpression" not found in "AutoIt3" namespace');
    }

    alias.setType(`PrimaryExpression | ({type: "MemberExpression", object: MemberExpression|PrimaryExpression, location: LocationRange } & ({property: Expression, computed: true} | {property:IdentifierName, computed: false}))`);

    const alias2 = namespace.getTypeAlias("CallExpression");
    if (alias2 === undefined) {
        throw new Error('type "CallExpression" not found in "AutoIt3" namespace');
    }

    alias2.setType(`{type: "CallExpression", callee: MemberExpression | CallExpression, arguments: Arguments, location: LocationRange } | {type: "MemberExpression", property: Expression | IdentifierName, computed: boolean, location: LocationRange }`);

    const alias3 = namespace.getTypeAlias("IncludeStatement");
    if (alias3 === undefined) {
        throw new Error('type "IncludeStatement" not found in "AutoIt3" namespace');
    }
    alias3.setType(`{type: "IncludeStatement", library: boolean, file: string, location: LocationRange}`);

    file.saveSync();
});
