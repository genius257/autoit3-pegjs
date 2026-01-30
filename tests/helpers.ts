import { expect } from "vitest";
import parser, { SyntaxError } from "../dist/autoit3";

export const assertParserError = (input: string, startOffset: number, endOffset: number|null = null) => {
    let thrown: unknown = null;

    try {
        return parser.parse(input, {grammarSource: ""});
    } catch (error) {
        if (!isPeggySyntaxError(error)) {
            throw error;
        }

        thrown = error;
        expect(error.location.start.offset).toStrictEqual(startOffset);
        expect(error.location.end.offset).toStrictEqual(endOffset ?? (startOffset + 1));
    } finally {
        expect(thrown).not.toBe(null);
    }
}

export const isPeggySyntaxError = (error: unknown): error is SyntaxError => {
    if (!(error instanceof Error)) {
        return false;
    }

    if (!('location' in error)) {
        return false;
    }

    if (!('expected' in error)) {
        return false;
    }

    if (!('found' in error)) {
        return false;
    }

    return true;
}
