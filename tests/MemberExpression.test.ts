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
