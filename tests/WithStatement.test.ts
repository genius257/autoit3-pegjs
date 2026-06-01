import { expect, test } from 'vitest';
import parser, { Location, LocationRange, SyntaxError, AutoIt3 } from "../dist/autoit3";
import { assertParserError } from './helpers';

test('WithStatementTest', () => {
    expect(parser.parse(`With $o\nIf .a = .b Then Return 1\nEndWith`, {grammarSource: ""})).toMatchSnapshot();
});
