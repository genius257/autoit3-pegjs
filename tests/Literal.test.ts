import { expect, it } from "vitest";
import parser from "../dist/autoit3";

it('parses string literals', () => {
    expect(parser.parse(`"Foo""Bar"`, {grammarSource: ""})).toMatchSnapshot();
});
