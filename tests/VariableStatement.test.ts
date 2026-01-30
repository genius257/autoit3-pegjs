import { expect, test } from 'vitest';
import parser, { Location, LocationRange, SyntaxError, AutoIt3 } from "../dist/autoit3";
import { assertParserError } from './helpers';

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

    expect(parser.parse('Local Const $local_g = 1', {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse('Local Static $local_h', {grammarSource: ""})).toMatchSnapshot();

    assertParserError('Const Local $local_i = 1', 6);

    expect(parser.parse('Static Local $local_j', {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse('Local $local_k', {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse('Global Const $global_g = 1', {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse('Global Static $global_h', {grammarSource: ""})).toMatchSnapshot();

    assertParserError('Const Global $global_i = 1', 6);

    expect(parser.parse('Static Global $global_j', {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse('Global $global_k', {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse('Dim Const $dim_g = 1', {grammarSource: ""})).toMatchSnapshot();

    assertParserError('Dim Static $dim_h', 4);
    assertParserError('Const Dim $dim_i = 1', 6);
    assertParserError('Static Dim $dim_j', 7);

    expect(parser.parse('Dim $dim_k', {grammarSource: ""})).toMatchSnapshot();

    assertParserError('Const Static $l = 1', 6);
    assertParserError('Static Const $m = 1', 7);

    expect(parser.parse('Const $n = 1', {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse('Static $o', {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse('$p = 1', {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse('Enum $q', {grammarSource: ""})).toMatchSnapshot();

    expect(parser.parse('Local Enum $local_r', {grammarSource: ""})).toMatchSnapshot();

    assertParserError('Enum Local $local_s', 5);

    expect(parser.parse('Global Enum $global_r', {grammarSource: ""})).toMatchSnapshot();

    assertParserError('Enum Global $global_s', 5);

    expect(parser.parse('Dim Enum $dim_r', {grammarSource: ""})).toMatchSnapshot();

    assertParserError('Enum Dim $dim_s', 5);
    assertParserError('Static Enum $static_r', 7);
    assertParserError('Enum Static $static_s', 5);

    expect(parser.parse('Const Enum $const_r', {grammarSource: ""})).toMatchSnapshot();

    assertParserError('Enum Const $const_s', 5);

    expect(parser.parse('Local Const Enum $local_const_r', {grammarSource: ""})).toMatchSnapshot();

    assertParserError('Local Enum Const $local_const_s', 11);
    assertParserError('Const Local Enum $const_local_t', 6);
    assertParserError('Const Enum Local $const_local_u', 11);
    assertParserError('Enum Local Const $const_local_v', 5);
    assertParserError('Enum Const Local $enum_local_w', 5);

    expect(parser.parse('Global Const Enum $global_const_r', {grammarSource: ""})).toMatchSnapshot();

    assertParserError('Global Enum Const $global_const_s', 12);
    assertParserError('Const Global Enum $const_global_t', 6);
    assertParserError('Const Enum Global $const_global_u', 11);
    assertParserError('Enum Global Const $const_global_v', 5);
    assertParserError('Enum Const Global $enum_global_w', 5);

    expect(parser.parse('Dim Const Enum $dim_const_r', {grammarSource: ""})).toMatchSnapshot();

    assertParserError('Dim Enum Const $dim_const_s', 9);
    assertParserError('Const Dim Enum $const_dim_t', 6);
    assertParserError('Const Enum Dim $const_dim_u', 11);
    assertParserError('Enum Dim Const $const_dim_v', 5);
    assertParserError('Enum Const Dim $enum_dim_w', 5);
});

test('Constant array declaration with dimensions specified', () => {
    expect(parser.parse('Const $const_array[3] = [1, 2, 3]', {grammarSource: ""})).toMatchSnapshot();
});
