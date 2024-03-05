import { expect, test } from 'vitest';
import fs from 'fs';
import parser, { Program } from "../index";

test('FunctionDeclaration', () => {
    expect(
        parser.parse(
            `Func MyFunction()
            EndFunc`
        )
    ).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'FunctionDeclaration',
                id: {
                    type: 'Identifier',
                    name: 'MyFunction',
                    location: {
                        start: {
                            line: 1,
                            column: 6,
                            offset: 5,
                        },
                        end: {
                            line: 1,
                            column: 16,
                            offset: 15,
                        },
                        source: undefined,
                    }
                },
                params: [],
                body: [],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 2,
                        column: 20,
                        offset: 37,
                    },
                    source: undefined,
                }
            }
        ]
    } satisfies Program);

    expect(
        parser.parse(
            `Func MyFunction($a, Byref Const $b = 1)
            EndFunc`
        )
    ).toStrictEqual({
        type: 'Program',
        body: [
            {
                type: 'FunctionDeclaration',
                id: {
                    type: 'Identifier',
                    name: 'MyFunction',
                    location: {
                        start: {
                            line: 1,
                            column: 6,
                            offset: 5,
                        },
                        end: {
                            line: 1,
                            column: 16,
                            offset: 15,
                        },
                        source: undefined,
                    }
                },
                params: [
                    {
                        type: 'Parameter',
                        "const": false,
                        byref: false,
                        init: null,
                        id: {
                            type: 'VariableIdentifier',
                            name: 'a',
                            location: {
                                start: {
                                    line: 1,
                                    column: 17,
                                    offset: 16,
                                },
                                end: {
                                    line: 1,
                                    column: 19,
                                    offset: 18,
                                },
                                source: undefined,
                            }
                        },
                        location: {
                            start: {
                                line: 1,
                                column: 17,
                                offset: 16,
                            },
                            end: {
                                line: 1,
                                column: 19,
                                offset: 18,
                            },
                            source: undefined,
                        }
                    },
                    {
                        type: 'Parameter',
                        "const": true,
                        byref: true,
                        init: {
                            type: 'Literal',
                            value: 1,
                            location: {
                                start: {
                                    line: 1,
                                    column: 38,
                                    offset: 37,
                                },
                                end: {
                                    line: 1,
                                    column: 39,
                                    offset: 38,
                                },
                                source: undefined,
                            }
                        },
                        id: {
                            type: 'VariableIdentifier',
                            name: 'b',
                            location: {
                                start: {
                                    line: 1,
                                    column: 33,
                                    offset: 32,
                                },
                                end: {
                                    line: 1,
                                    column: 35,
                                    offset: 34,
                                },
                                source: undefined,
                            },
                        },
                        location: {
                            start: {
                                line: 1,
                                column: 21,
                                offset: 20,
                            },
                            end: {
                                line: 1,
                                column: 39,
                                offset: 38,
                            },
                            source: undefined,
                        }
                    }
                ],
                body: [],
                location: {
                    start: {
                        line: 1,
                        column: 1,
                        offset: 0,
                    },
                    end: {
                        line: 2,
                        column: 20,
                        offset: 59,
                    },
                    source: undefined,
                }
            }
        ]
    } satisfies Program)
});