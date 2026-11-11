import { expect, test } from "vitest";
import parser, { AutoIt3, LocationRange } from "../dist/autoit3";

test("CallExpressionTest", () => {
    expect(parser.parse(`InetGet('url')()`, { grammarSource: "" })).toMatchSnapshot();
});

test("nested CallExpression locations (issue #43)", () => {
    const ast = parser.parse(`InetGet('http://www.google.com/')()`, { grammarSource: "" });
    const statement = ast.body[0] as AutoIt3.ExpressionStatement;
    const outer = statement.expression as AutoIt3.CallExpression;
    const inner = outer.callee as AutoIt3.CallExpression;
    const identifier = inner.callee as AutoIt3.Identifier;
    const literal = inner.arguments[0] as AutoIt3.Literal;

    expect(outer.type).toBe("CallExpression");
    expect(inner.type).toBe("CallExpression");

    // The wrapping CallExpression used to only span the trailing parentheses.
    expect(span(outer.location)).toStrictEqual([0, 35]);
    // The wrapped CallExpression keeps its own, smaller span.
    expect(span(inner.location)).toStrictEqual([0, 33]);
    expect(span(identifier.location)).toStrictEqual([0, 7]);
    expect(span(literal.location)).toStrictEqual([8, 32]);
    expect(span(statement.location)).toStrictEqual([0, 35]);
});

test("repeated wrapping locations", () => {
    // Each successive wrap must span from the very start of the expression to
    // its own end.
    const ast = parser.parse(`a()()()`, { grammarSource: "" });
    const outer = (ast.body[0] as AutoIt3.ExpressionStatement).expression as AutoIt3.CallExpression;
    const middle = outer.callee as AutoIt3.CallExpression;
    const inner = middle.callee as AutoIt3.CallExpression;

    expect(span(outer.location)).toStrictEqual([0, 7]);
    expect(span(middle.location)).toStrictEqual([0, 5]);
    expect(span(inner.location)).toStrictEqual([0, 3]);
});

test("call and member chain locations", () => {
    const ast = parser.parse(`$a.b().c[0]()`, { grammarSource: "" });
    const outer = (ast.body[0] as AutoIt3.ExpressionStatement).expression as AutoIt3.CallExpression;
    const indexChain = outer.callee as AutoIt3.MemberExpression;
    const dotChain = indexChain.object as AutoIt3.MemberExpression;
    const call = dotChain.object as AutoIt3.CallExpression;
    const memberDot = call.callee as AutoIt3.MemberExpression;

    expect(span(outer.location)).toStrictEqual([0, 13]);
    expect(span(indexChain.location)).toStrictEqual([0, 11]);
    expect(span(dotChain.location)).toStrictEqual([0, 8]);
    expect(span(call.location)).toStrictEqual([0, 6]);
    expect(span(memberDot.location)).toStrictEqual([0, 4]);
    expect(indexChain.computed).toBe(true);
    expect(dotChain.computed).toBe(false);
    expect(memberDot.computed).toBe(false);
});

test("whitespace between wraps is included in the span", () => {
    const ast = parser.parse(`$a .b ()`, { grammarSource: "" });
    const outer = (ast.body[0] as AutoIt3.ExpressionStatement).expression as AutoIt3.CallExpression;
    const member = outer.callee as AutoIt3.MemberExpression;

    expect(span(outer.location)).toStrictEqual([0, 8]);
    expect(span(member.location)).toStrictEqual([0, 5]);
});

function span(location: LocationRange): [number, number] {
    return [location.start.offset, location.end.offset];
}
