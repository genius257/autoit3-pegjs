//@ts-check

import {TypeExtractor} from "peggy-to-ts";
import {readFileSync, writeFileSync} from "fs";
import {Project} from "ts-morph";

const source = readFileSync("./src/autoit3.pegjs").toString();
const typeExtractor = new TypeExtractor(source, {camelCaseTypeNames: true, removeReadonlyKeyword: true});
typeExtractor.getTypes().then((types) => {
    writeFileSync('./dist/autoit3.d.ts', "\nexport namespace AutoIt3 {\n"+types+"\n}\n", {flag: 'a+'});

    const project = new Project();
    const file = project.addSourceFileAtPath('./dist/autoit3.d.ts');

    const namespace = file.getModule("AutoIt3");
    if (namespace === undefined) {
        throw new Error('namespace "AutoIt3" not found');
    }

    const memberExpressionAlias = namespace.getTypeAlias("MemberExpression");
    if (memberExpressionAlias === undefined) {
        throw new Error('type "MemberExpression" not found in "AutoIt3" namespace');
    }

    memberExpressionAlias.setType(`PrimaryExpression | ({type: "MemberExpression", object: MemberExpression|PrimaryExpression, location: LocationRange } & ({property: Expression, computed: true} | {property:IdentifierName, computed: false}))`);

    const memberExpressionInWithAlias = namespace.getTypeAlias("MemberExpressionInWith");
    if (memberExpressionInWithAlias === undefined) {
        throw new Error('type "MemberExpression" not found in "AutoIt3" namespace');
    }

    memberExpressionInWithAlias.setType(`PrimaryExpression | ({type: "MemberExpression", object: MemberExpression|PrimaryExpression, location: LocationRange } & ({property: Expression, computed: true} | {property:IdentifierName, computed: false}))`);

    const callExpressionAlias = namespace.getTypeAlias("CallExpression");
    if (callExpressionAlias === undefined) {
        throw new Error('type "CallExpression" not found in "AutoIt3" namespace');
    }

    callExpressionAlias.setType(`{type: "CallExpression", callee: MemberExpression | CallExpression, arguments: Arguments, location: LocationRange } | {type: "MemberExpression", object: MemberExpression | CallExpression, property: Expression | IdentifierName, computed: boolean, location: LocationRange }`);

    const callExpressionInWithAlias = namespace.getTypeAlias("CallExpressionInWith");
    if (callExpressionInWithAlias === undefined) {
        throw new Error('type "CallExpression" not found in "AutoIt3" namespace');
    }

    callExpressionInWithAlias.setType(`{type: "CallExpression", callee: MemberExpression | CallExpression, arguments: Arguments, location: LocationRange } | {type: "MemberExpression", object: MemberExpression | CallExpression | null, property: Expression | IdentifierName, computed: boolean, location: LocationRange }`);

    const includeStatementAlias = namespace.getTypeAlias("IncludeStatement");
    if (includeStatementAlias === undefined) {
        throw new Error('type "IncludeStatement" not found in "AutoIt3" namespace');
    }
    includeStatementAlias.setType(`{type: "IncludeStatement", library: boolean, file: string, location: LocationRange}`);

    file.saveSync();
});
