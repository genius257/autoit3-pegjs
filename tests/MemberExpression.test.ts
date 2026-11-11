import { expect, it } from "vitest";
import parser from "../dist/autoit3";
import { assertParserError } from "./helpers";

it('dot notation whitespaces', () => {
    expect(parser.parse(`$o.a`, {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse(`With $o\n.a\nEndWith`, {grammarSource: ""})).toMatchSnapshot();
    
    expect(parser.parse(`$o.a.b`, {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse(`With $o\n.a.b\nEndWith`, {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse(`$o .a`, {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse(`$o .a .b`, {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse(`With $o\n.a .b\nEndWith`, {grammarSource: ""})).toMatchSnapshot();

    expect(assertParserError(`$o. a`, 3)).toMatchSnapshot();

    expect(assertParserError(`With $o\n. a\nEndWith`, 9)).toMatchSnapshot();

    expect(assertParserError(`$o.a. b`, 5)).toMatchSnapshot();

    expect(assertParserError(`With $o\n.a. b\nEndWith`, 11)).toMatchSnapshot();

    expect(parser.parse(`f().a`, {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse(`f().a.b`, {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse(`f() .a`, {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse(`f() .a .b`, {grammarSource: ""})).toMatchSnapshot();

    expect(assertParserError(`f(). a`, 4)).toMatchSnapshot();

    expect(assertParserError(`f().a. b`, 6)).toMatchSnapshot();
});

it('member chain locations', () => {
    // Each wrapped node must span from the start of the expression to its own
    // end. The reduce used to call location() after the whole rule matched, so
    // every wrapped node claimed the span of the entire chain.
    const collectSpans = (input: string): Array<[number, number]> => {
        const collected: Array<[number, number]> = [];
        const walk = (node: any): void => {
            if (Array.isArray(node)) {
                node.forEach(walk);
            } else if (node && typeof node === 'object') {
                if (node.type === 'MemberExpression') {
                    collected.push([node.location.start.offset, node.location.end.offset]);
                }
                Object.values(node).forEach(walk);
            }
        };
        walk(parser.parse(input, { grammarSource: '' }));
        return collected;
    };

    // Collected outermost first.
    expect(collectSpans(`$a.b.c.d`)).toStrictEqual([[0, 8], [0, 6], [0, 4]]);

    // Two properties -> two wrapped nodes.
    expect(collectSpans(`$o .a .b`)).toStrictEqual([[0, 8], [0, 5]]);

    expect(collectSpans(`f().a.b`)).toStrictEqual([[0, 7], [0, 5]]);

    expect(collectSpans(`$arr[1][2][3]`)).toStrictEqual([[0, 13], [0, 10], [0, 7]]);
});
