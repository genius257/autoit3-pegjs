//@ts-check

import {TypeExtractor} from "peggy-to-ts";
import {readFileSync, writeFileSync} from "fs";

const source = readFileSync("./src/autoit3.pegjs").toString();
const typeExtractor = new TypeExtractor(source, {camelCaseTypeNames: true, removeReadonlyKeyword: true});
typeExtractor.getTypes().then((types) => {
    writeFileSync('./out/autoit3.d.ts', "\nexport namespace AutoIt3 {\n"+types+"\n}\n", {flag: 'a+'});
});
