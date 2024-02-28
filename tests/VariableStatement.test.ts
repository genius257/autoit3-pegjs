import { expect, test } from 'vitest';
import parser, { Program } from "../index";

test('VariableDeclaration', () => {
    expect(() => parser.parse('Local Const Static $local_a = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Local Static Const $local_b = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Const Local Static $local_c = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Const Static Local $local_d = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Static Local Const $local_e = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Static Const Local $local_f = 1')).toThrowErrorMatchingSnapshot();

    expect(() => parser.parse('Global Const Static $global_a = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Global Static Const $global_b = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Const Global Static $global_c = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Const Static Global $global_d = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Static Global Const $global_e = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Static Const Global $global_f = 1')).toThrowErrorMatchingSnapshot();

    expect(() => parser.parse('Dim Const Static $dim_a = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Dim Static Const $dim_b = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Const Dim Static $dim_c = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Const Static Dim $dim_d = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Static Dim Const $dim_e = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Static Const Dim $dim_f = 1')).toThrowErrorMatchingSnapshot();

    expect(parser.parse('Local Const $local_g = 1')).toMatchSnapshot();
    expect(parser.parse('Local Static $local_h')).toMatchSnapshot();
    expect(() => parser.parse('Const Local $local_i = 1')).toThrowErrorMatchingSnapshot();
    expect(parser.parse('Static Local $local_j')).toMatchSnapshot();
    expect(parser.parse('Local $local_k')).toMatchSnapshot();

    expect(parser.parse('Global Const $global_g = 1')).toMatchSnapshot();
    expect(parser.parse('Global Static $global_h')).toMatchSnapshot();
    expect(() => parser.parse('Const Global $global_i = 1')).toThrowErrorMatchingSnapshot();
    expect(parser.parse('Static Global $global_j')).toMatchSnapshot();
    expect(parser.parse('Global $global_k')).toMatchSnapshot();

    expect(parser.parse('Dim Const $dim_g = 1')).toMatchSnapshot();
    expect(() => parser.parse('Dim Static $dim_h')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Const Dim $dim_i = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Static Dim $dim_j')).toThrowErrorMatchingSnapshot();
    expect(parser.parse('Dim $dim_k')).toMatchSnapshot();

    expect(() => parser.parse('Const Static $l = 1')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Static Const $m = 1')).toThrowErrorMatchingSnapshot();

    expect(parser.parse('Const $n = 1')).toMatchSnapshot();
    expect(parser.parse('Static $o')).toMatchSnapshot();

    expect(parser.parse('$p = 1')).toMatchSnapshot();

    expect(parser.parse('Enum $q')).toMatchSnapshot();

    expect(parser.parse('Local Enum $local_r')).toMatchSnapshot();
    expect(() => parser.parse('Enum Local $local_s')).toThrowErrorMatchingSnapshot();

    expect(parser.parse('Global Enum $global_r')).toMatchSnapshot();
    expect(() => parser.parse('Enum Global $global_s')).toThrowErrorMatchingSnapshot();

    expect(parser.parse('Dim Enum $dim_r')).toMatchSnapshot();
    expect(() => parser.parse('Enum Dim $dim_s')).toThrowErrorMatchingSnapshot();

    expect(() => parser.parse('Static Enum $static_r')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Enum Static $static_s')).toThrowErrorMatchingSnapshot();

    expect(parser.parse('Const Enum $const_r')).toMatchSnapshot();
    expect(() => parser.parse('Enum Const $const_s')).toThrowErrorMatchingSnapshot();

    expect(parser.parse('Local Const Enum $local_const_r')).toMatchSnapshot();
    expect(() => parser.parse('Local Enum Const $local_const_s')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Const Local Enum $const_local_t')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Const Enum Local $const_local_u')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Enum Local Const $const_local_v')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Enum Const Local $enum_local_w')).toThrowErrorMatchingSnapshot();

    expect(parser.parse('Global Const Enum $global_const_r')).toMatchSnapshot();
    expect(() => parser.parse('Global Enum Const $global_const_s')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Const Global Enum $const_global_t')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Const Enum Global $const_global_u')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Enum Global Const $const_global_v')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Enum Const Global $enum_global_w')).toThrowErrorMatchingSnapshot();

    expect(parser.parse('Dim Const Enum $dim_const_r')).toMatchSnapshot();
    expect(() => parser.parse('Dim Enum Const $dim_const_s')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Const Dim Enum $const_dim_t')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Const Enum Dim $const_dim_u')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Enum Dim Const $const_dim_v')).toThrowErrorMatchingSnapshot();
    expect(() => parser.parse('Enum Const Dim $enum_dim_w')).toThrowErrorMatchingSnapshot();
});
