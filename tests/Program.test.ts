import { expect, it } from "vitest";
import parser from "../dist/autoit3";

it('whitespace between SourceElements', () => {
    expect(
        parser.parse(
            `;\n ;\n\t;\n`,
            {grammarSource: ""}
        )
    ).toMatchSnapshot();
});
