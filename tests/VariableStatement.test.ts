import { expect, test } from 'vitest';
import parser, { Location, LocationRange, SyntaxError, AutoIt3 } from "../dist/autoit3";

const isPeggySyntaxError = (error: unknown): error is SyntaxError => {
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

const assertParserError = (input: string, startOffset: number, endOffset: number|null = null) => {
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

test('VariableDeclaration', () => {

    assertParserError('Local Const Static $local_a = 1', 12);
    assertParserError('Local Static Const $local_b = 1', 13);
    assertParserError('Const Local Static $local_c = 1', 6);
    assertParserError('Const Static Local $local_d = 1', 6);
    assertParserError('Static Local Const $local_e = 1', 13);
    assertParserError('Static Const Local $local_f = 1', 7);

    assertParserError('Global Const Static $global_a = 1', 13);
    assertParserError('Global Static Const $global_b = 1', 14);
    assertParserError('Const Global Static $global_c = 1', 6);
    assertParserError('Const Static Global $global_d = 1', 6);
    assertParserError('Static Global Const $global_e = 1', 14);
    assertParserError('Static Const Global $global_f = 1', 7);

    assertParserError('Dim Const Static $dim_a = 1', 10);
    assertParserError('Dim Static Const $dim_b = 1', 4);
    assertParserError('Const Dim Static $dim_c = 1', 6);
    assertParserError('Const Static Dim $dim_d = 1', 6);
    assertParserError('Static Dim Const $dim_e = 1', 7);
    assertParserError('Static Const Dim $dim_f = 1', 7);

    expect(parser.parse('Local Const $local_g = 1', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'VariableDeclaration',
                scope: 'local',
                constant: true,
                static_: false,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'local_g',
                            location: {
                                start: {
                                    line: 1,
                                    column: 13,
                                    offset: 12,
                                },
                                end: {
                                    line: 1,
                                    column: 21,
                                    offset: 20,
                                },
                                source: "",
                            }
                        },
                        dimensions: [],
                        init: {
                            type: 'Literal',
                            value: 1,
                            location: {
                                start: {
                                    line: 1,
                                    column: 24,
                                    offset: 23,
                                },
                                end: {
                                    line: 1,
                                    column: 25,
                                    offset: 24,
                                },
                                source: "",
                            }
                        },
                        location: {
                            start: {
                                line: 1,
                                column: 13,
                                offset: 12,
                            },
                            end: {
                                line: 1,
                                column: 25,
                                offset: 24,
                            },
                            source: "",
                        }
                    }
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 25,
                        offset: 24,
                    },
                    source: "",
                }
            }
        ]
    } satisfies AutoIt3.Program);

    expect(parser.parse('Local Static $local_h', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'VariableDeclaration',
                scope: 'local',
                constant: false,
                static_: true,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'local_h',
                            location: {
                                start: {
                                    line: 1,
                                    column: 14,
                                    offset: 13,
                                },
                                end: {
                                    line: 1,
                                    column: 22,
                                    offset: 21,
                                },
                                source: "",
                            }
                        },
                        dimensions: [],
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 14,
                                offset: 13,
                            },
                            end: {
                                line: 1,
                                column: 22,
                                offset: 21,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 22,
                        offset: 21,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    assertParserError('Const Local $local_i = 1', 6);

    expect(parser.parse('Static Local $local_j', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'VariableDeclaration',
                scope: 'local',
                constant: false,
                static_: true,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'local_j',
                            location: {
                                start: {
                                    line: 1,
                                    column: 14,
                                    offset: 13,
                                },
                                end: {
                                    line: 1,
                                    column: 22,
                                    offset: 21,
                                },
                                source: "",
                            }
                        },
                        dimensions: [],
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 14,
                                offset: 13,
                            },
                            end: {
                                line: 1,
                                column: 22,
                                offset: 21,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 22,
                        offset: 21,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    expect(parser.parse('Local $local_k', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'VariableDeclaration',
                scope: 'local',
                constant: false,
                static_: false,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'local_k',
                            location: {
                                start: {
                                    line: 1,
                                    column: 7,
                                    offset: 6,
                                },
                                end: {
                                    line: 1,
                                    column: 15,
                                    offset: 14,
                                },
                                source: "",
                            }
                        },
                        dimensions: [],
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 7,
                                offset: 6,
                            },
                            end: {
                                line: 1,
                                column: 15,
                                offset: 14,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 15,
                        offset: 14,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    expect(parser.parse('Global Const $global_g = 1', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'VariableDeclaration',
                scope: 'global',
                constant: true,
                static_: false,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'global_g',
                            location: {
                                start: {
                                    line: 1,
                                    column: 14,
                                    offset: 13,
                                },
                                end: {
                                    line: 1,
                                    column: 23,
                                    offset: 22,
                                },
                                source: "",
                            }
                        },
                        init: {
                            type: 'Literal',
                            value: 1,
                            location: {
                                start: {
                                    line: 1,
                                    column: 26,
                                    offset: 25,
                                },
                                end: {
                                    line: 1,
                                    column: 27,
                                    offset: 26,
                                },
                                source: "",
                            }
                        },
                        dimensions: [],
                        location: {
                            start: {
                                line: 1,
                                column: 14,
                                offset: 13,
                            },
                            end: {
                                line: 1,
                                column: 27,
                                offset: 26,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 27,
                        offset: 26,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    expect(parser.parse('Global Static $global_h', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'VariableDeclaration',
                scope: 'global',
                constant: false,
                static_: true,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'global_h',
                            location: {
                                start: {
                                    line: 1,
                                    column: 15,
                                    offset: 14,
                                },
                                end: {
                                    line: 1,
                                    column: 24,
                                    offset: 23,
                                },
                                source: "",
                            }
                        },
                        dimensions: [],
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 15,
                                offset: 14,
                            },
                            end: {
                                line: 1,
                                column: 24,
                                offset: 23,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 24,
                        offset: 23,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    assertParserError('Const Global $global_i = 1', 6);

    expect(parser.parse('Static Global $global_j', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'VariableDeclaration',
                scope: 'global',
                constant: false,
                static_: true,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'global_j',
                            location: {
                                start: {
                                    line: 1,
                                    column: 15,
                                    offset: 14,
                                },
                                end: {
                                    line: 1,
                                    column: 24,
                                    offset: 23,
                                },
                                source: "",
                            }
                        },
                        dimensions: [],
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 15,
                                offset: 14,
                            },
                            end: {
                                line: 1,
                                column: 24,
                                offset: 23,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 24,
                        offset: 23,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    expect(parser.parse('Global $global_k', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'VariableDeclaration',
                scope: 'global',
                constant: false,
                static_: false,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'global_k',
                            location: {
                                start: {
                                    line: 1,
                                    column: 8,
                                    offset: 7,
                                },
                                end: {
                                    line: 1,
                                    column: 17,
                                    offset: 16,
                                },
                                source: "",
                            }
                        },
                        dimensions: [],
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 8,
                                offset: 7,
                            },
                            end: {
                                line: 1,
                                column: 17,
                                offset: 16,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 17,
                        offset: 16,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    expect(parser.parse('Dim Const $dim_g = 1', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'VariableDeclaration',
                scope: 'dim',
                constant: true,
                static_: false,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'dim_g',
                            location: {
                                start: {
                                    line: 1,
                                    column: 11,
                                    offset: 10,
                                },
                                end: {
                                    line: 1,
                                    column: 17,
                                    offset: 16,
                                },
                                source: "",
                            }
                        },
                        dimensions: [],
                        init: {
                            type: 'Literal',
                            value: 1,
                            location: {
                                start: {
                                    line: 1,
                                    column: 20,
                                    offset: 19,
                                },
                                end: {
                                    line: 1,
                                    column: 21,
                                    offset: 20,
                                },
                                source: "",
                            },
                        },
                        location: {
                            start: {
                                line: 1,
                                column: 11,
                                offset: 10,
                            },
                            end: {
                                line: 1,
                                column: 21,
                                offset: 20,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 21,
                        offset: 20,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    assertParserError('Dim Static $dim_h', 4);
    assertParserError('Const Dim $dim_i = 1', 6);
    assertParserError('Static Dim $dim_j', 7);

    expect(parser.parse('Dim $dim_k', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'VariableDeclaration',
                scope: 'dim',
                constant: false,
                static_: false,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'dim_k',
                            location: {
                                start: {
                                    line: 1,
                                    column: 5,
                                    offset: 4,
                                },
                                end: {
                                    line: 1,
                                    column: 11,
                                    offset: 10,
                                },
                                source: "",
                            }
                        },
                        dimensions: [],
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 5,
                                offset: 4,
                            },
                            end: {
                                line: 1,
                                column: 11,
                                offset: 10,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 11,
                        offset: 10,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    assertParserError('Const Static $l = 1', 6);
    assertParserError('Static Const $m = 1', 7);

    expect(parser.parse('Const $n = 1', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'VariableDeclaration',
                scope: null,
                constant: true,
                static_: false,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'n',
                            location: {
                                start: {
                                    line: 1,
                                    column: 7,
                                    offset: 6,
                                },
                                end: {
                                    line: 1,
                                    column: 9,
                                    offset: 8,
                                },
                                source: "",
                            }
                        },
                        dimensions: [],
                        init: {
                            type: 'Literal',
                            value: 1,
                            location: {
                                start: {
                                    line: 1,
                                    column: 12,
                                    offset: 11,
                                },
                                end: {
                                    line: 1,
                                    column: 13,
                                    offset: 12,
                                },
                                source: "",
                            },
                        },
                        location: {
                            start: {
                                line: 1,
                                column: 7,
                                offset: 6,
                            },
                            end: {
                                line: 1,
                                column: 13,
                                offset: 12,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 13,
                        offset: 12,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    expect(parser.parse('Static $o', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'VariableDeclaration',
                scope: null,
                constant: false,
                static_: true,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'o',
                            location: {
                                start: {
                                    line: 1,
                                    column: 8,
                                    offset: 7,
                                },
                                end: {
                                    line: 1,
                                    column: 10,
                                    offset: 9,
                                },
                                source: "",
                            }
                        },
                        dimensions: [],
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 8,
                                offset: 7,
                            },
                            end: {
                                line: 1,
                                column: 10,
                                offset: 9,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 10,
                        offset: 9,
                    },
                    source: "",
                },
            }
        ]
    } as AutoIt3.Program);

    expect(parser.parse('$p = 1', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'VariableDeclaration',
                scope: null,
                constant: false,
                static_: false,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'p',
                            location: {
                                start: {
                                    line: 1,
                                    column: 1,
                                    offset: 0,
                                },
                                end: {
                                    line: 1,
                                    column: 3,
                                    offset: 2,
                                },
                                source: "",
                            }
                        },
                        dimensions: [],
                        init: {
                            type: 'Literal',
                            value: 1,
                            location: {
                                start: {
                                    line: 1,
                                    column: 6,
                                    offset: 5,
                                },
                                end: {
                                    line: 1,
                                    column: 7,
                                    offset: 6,
                                },
                                source: "",
                            },
                        },
                        location: {
                            start: {
                                line: 1,
                                column: 1,
                                offset: 0,
                            },
                            end: {
                                line: 1,
                                column: 7,
                                offset: 6,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 7,
                        offset: 6,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    expect(parser.parse('Enum $q', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'EnumDeclaration',
                scope: null,
                constant: false,
                static: false,
                stepoperator: '+',
                stepval: 1,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'q',
                            location: {
                                start: {
                                    line: 1,
                                    column: 6,
                                    offset: 5,
                                },
                                end: {
                                    line: 1,
                                    column: 8,
                                    offset: 7,
                                },
                                source: "",
                            }
                        },
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 6,
                                offset: 5,
                            },
                            end: {
                                line: 1,
                                column: 8,
                                offset: 7,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 8,
                        offset: 7,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    expect(parser.parse('Local Enum $local_r', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'EnumDeclaration',
                scope: 'local',
                constant: false,
                static: false,
                stepoperator: '+',
                stepval: 1,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'local_r',
                            location: {
                                start: {
                                    line: 1,
                                    column: 12,
                                    offset: 11,
                                },
                                end: {
                                    line: 1,
                                    column: 20,
                                    offset: 19,
                                },
                                source: "",
                            }
                        },
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 12,
                                offset: 11,
                            },
                            end: {
                                line: 1,
                                column: 20,
                                offset: 19,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 20,
                        offset: 19,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    assertParserError('Enum Local $local_s', 5);

    expect(parser.parse('Global Enum $global_r', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'EnumDeclaration',
                scope: 'global',
                constant: false,
                static: false,
                stepoperator: '+',
                stepval: 1,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'global_r',
                            location: {
                                start: {
                                    line: 1,
                                    column: 13,
                                    offset: 12,
                                },
                                end: {
                                    line: 1,
                                    column: 22,
                                    offset: 21,
                                },
                                source: "",
                            }
                        },
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 13,
                                offset: 12,
                            },
                            end: {
                                line: 1,
                                column: 22,
                                offset: 21,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 22,
                        offset: 21,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    assertParserError('Enum Global $global_s', 5);

    expect(parser.parse('Dim Enum $dim_r', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'EnumDeclaration',
                scope: 'dim',
                constant: false,
                static: false,
                stepoperator: '+',
                stepval: 1,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'dim_r',
                            location: {
                                start: {
                                    line: 1,
                                    column: 10,
                                    offset: 9,
                                },
                                end: {
                                    line: 1,
                                    column: 16,
                                    offset: 15,
                                },
                                source: "",
                            }
                        },
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 10,
                                offset: 9,
                            },
                            end: {
                                line: 1,
                                column: 16,
                                offset: 15,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 16,
                        offset: 15,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    assertParserError('Enum Dim $dim_s', 5);
    assertParserError('Static Enum $static_r', 7);
    assertParserError('Enum Static $static_s', 5);

    expect(parser.parse('Const Enum $const_r', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'EnumDeclaration',
                scope: null,
                constant: true,
                static: false,
                stepoperator: '+',
                stepval: 1,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'const_r',
                            location: {
                                start: {
                                    line: 1,
                                    column: 12,
                                    offset: 11,
                                },
                                end: {
                                    line: 1,
                                    column: 20,
                                    offset: 19,
                                },
                                source: "",
                            }
                        },
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 12,
                                offset: 11,
                            },
                            end: {
                                line: 1,
                                column: 20,
                                offset: 19,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 20,
                        offset: 19,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    assertParserError('Enum Const $const_s', 5);

    expect(parser.parse('Local Const Enum $local_const_r', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'EnumDeclaration',
                scope: 'local',
                constant: true,
                static: false,
                stepoperator: '+',
                stepval: 1,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'local_const_r',
                            location: {
                                start: {
                                    line: 1,
                                    column: 18,
                                    offset: 17,
                                },
                                end: {
                                    line: 1,
                                    column: 32,
                                    offset: 31,
                                },
                                source: "",
                            }
                        },
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 18,
                                offset: 17,
                            },
                            end: {
                                line: 1,
                                column: 32,
                                offset: 31,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 32,
                        offset: 31,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    assertParserError('Local Enum Const $local_const_s', 11);
    assertParserError('Const Local Enum $const_local_t', 6);
    assertParserError('Const Enum Local $const_local_u', 11);
    assertParserError('Enum Local Const $const_local_v', 5);
    assertParserError('Enum Const Local $enum_local_w', 5);

    expect(parser.parse('Global Const Enum $global_const_r', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'EnumDeclaration',
                scope: 'global',
                constant: true,
                static: false,
                stepoperator: '+',
                stepval: 1,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'global_const_r',
                            location: {
                                start: {
                                    line: 1,
                                    column: 19,
                                    offset: 18,
                                },
                                end: {
                                    line: 1,
                                    column: 34,
                                    offset: 33,
                                },
                                source: "",
                            }
                        },
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 19,
                                offset: 18,
                            },
                            end: {
                                line: 1,
                                column: 34,
                                offset: 33,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 34,
                        offset: 33,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    assertParserError('Global Enum Const $global_const_s', 12);
    assertParserError('Const Global Enum $const_global_t', 6);
    assertParserError('Const Enum Global $const_global_u', 11);
    assertParserError('Enum Global Const $const_global_v', 5);
    assertParserError('Enum Const Global $enum_global_w', 5);

    expect(parser.parse('Dim Const Enum $dim_const_r', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'EnumDeclaration',
                scope: 'dim',
                constant: true,
                static: false,
                stepoperator: '+',
                stepval: 1,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'dim_const_r',
                            location: {
                                start: {
                                    line: 1,
                                    column: 16,
                                    offset: 15,
                                },
                                end: {
                                    line: 1,
                                    column: 28,
                                    offset: 27,
                                },
                                source: "",
                            }
                        },
                        init: null,
                        location: {
                            start: {
                                line: 1,
                                column: 16,
                                offset: 15,
                            },
                            end: {
                                line: 1,
                                column: 28,
                                offset: 27,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 28,
                        offset: 27,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);

    assertParserError('Dim Enum Const $dim_const_s', 9);
    assertParserError('Const Dim Enum $const_dim_t', 6);
    assertParserError('Const Enum Dim $const_dim_u', 11);
    assertParserError('Enum Dim Const $const_dim_v', 5);
    assertParserError('Enum Const Dim $enum_dim_w', 5);
});

test('Constant array declaration with dimensions specified', () => {
    expect(parser.parse('Const $const_array[3] = [1, 2, 3]', {grammarSource: ""})).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'VariableDeclaration',
                scope: null,
                constant: true,
                static_: false,
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: {
                            type: 'VariableIdentifier',
                            name: 'const_array',
                            location: {
                                start: {
                                    line: 1,
                                    column: 7,
                                    offset: 6,
                                },
                                end: {
                                    line: 1,
                                    column: 19,
                                    offset: 18,
                                },
                                source: "",
                            }
                        },
                        dimensions: [
                            {
                                type: 'Literal',
                                value: 3,
                                location: {
                                    start: {
                                        line: 1,
                                        column: 20,
                                        offset: 19,
                                    },
                                    end: {
                                        line: 1,
                                        column: 21,
                                        offset: 20,
                                    },
                                    source: "",
                                }
                            }
                        ],
                        init: {
                            type: 'ArrayDeclaration',
                            elements: [
                                {
                                    type: 'Literal',
                                    value: 1,
                                    location: {
                                        start: {
                                            line: 1,
                                            column: 26,
                                            offset: 25,
                                        },
                                        end: {
                                            line: 1,
                                            column: 27,
                                            offset: 26,
                                        },
                                        source: "",
                                    }
                                },
                                {
                                    type: 'Literal',
                                    value: 2,
                                    location: {
                                        start: {
                                            line: 1,
                                            column: 29,
                                            offset: 28,
                                        },
                                        end: {
                                            line: 1,
                                            column: 30,
                                            offset: 29,
                                        },
                                        source: "",
                                    }
                                },
                                {
                                    type: 'Literal',
                                    value: 3,
                                    location: {
                                        start: {
                                            line: 1,
                                            column: 32,
                                            offset: 31,
                                        },
                                        end: {
                                            line: 1,
                                            column: 33,
                                            offset: 32,
                                        },
                                        source: "",
                                    }
                                },
                            ],
                            location: {
                                start: {
                                    line: 1,
                                    column: 25,
                                    offset: 24,
                                },
                                end: {
                                    line: 1,
                                    column: 34,
                                    offset: 33,
                                },
                                source: "",
                            },
                        },
                        location: {
                            start: {
                                line: 1,
                                column: 7,
                                offset: 6,
                            },
                            end: {
                                line: 1,
                                column: 34,
                                offset: 33,
                            },
                            source: "",
                        },
                    },
                ],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 1,
                        column: 34,
                        offset: 33,
                    },
                    source: "",
                },
            }
        ]
    } satisfies AutoIt3.Program);
});
