import { expect, test } from 'vitest';
import fs from 'fs';
import parser, { AutoIt3 } from "../dist/autoit3";
import { assertParserError } from './helpers';

test('FunctionDeclaration', () => {
    expect(
        parser.parse(
            `Func MyFunction()
            EndFunc`,
            {grammarSource: ""}
        )
    ).toMatchSnapshot();

    assertParserError(
        `Func MyFunction($a, Byref Const $b = 1)
        EndFunc`,
        35
    );

    expect(
        parser.parse(
            `Func MyFunction($a, Byref Const $b)
            EndFunc`,
            {grammarSource: ""}
        )
    ).toMatchSnapshot();
});