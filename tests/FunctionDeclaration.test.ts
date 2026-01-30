import { expect, test } from 'vitest';
import fs from 'fs';
import parser, { AutoIt3 } from "../dist/autoit3";

test('FunctionDeclaration', () => {
    expect(
        parser.parse(
            `Func MyFunction()
            EndFunc`,
            {grammarSource: ""}
        )
    ).toMatchSnapshot();

    expect(
        parser.parse(
            `Func MyFunction($a, Byref Const $b = 1)
            EndFunc`,
            {grammarSource: ""}
        )
    ).toMatchSnapshot();
});