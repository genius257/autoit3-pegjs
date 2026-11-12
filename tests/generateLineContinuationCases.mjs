#!/usr/bin/env node
// Generates tests/LineContinuationCases.au3 and
// tests/LineContinuationNegativeCases.json
//
// The `__` rule sits between almost every pair of tokens, so a change to how it
// consumes whitespace is easy to get subtly wrong. This fixture enumerates the
// positions where a line continuation may legally appear and pairs each one with
// the whitespace variants that must all behave identically.
//
// Regenerate with:  node tests/generateLineContinuationCases.mjs

import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const NL = "\n";
const DIR = dirname(fileURLToPath(import.meta.url));
const OUT = join(DIR, "LineContinuationCases.au3");
const NEG_OUT = join(DIR, "LineContinuationNegativeCases.json");

// Whitespace variants. A continuation is [space|tab] UNDERSCORE [ws] [; comment]
// NEWLINE indent, exactly as the LineContinuation rule requires: it must be
// preceded by whitespace and followed by a newline.
const VARIANTS = {
    none:        (s) => s,
    spaces:      (s) => `  ${s}`,
    tab:         (s) => `\t${s}`,
    cont:        (s) => ` _${NL}\t${s}`,
    contSpaced:  (s) => ` _   ${NL}\t${s}`,
    contComment: (s) => ` _ ; trailing comment${NL}\t${s}`,
    contTab:     (s) => `\t_${NL}\t${s}`,
    cont2:       (s) => ` _${NL}\t _${NL}\t${s}`,
    cont2Mixed:  (s) => ` _${NL}_${NL}    ${s}`,
};

const out = [];
let counter = 0;

const emit = (name, body) => {
    counter++;
    out.push(`; === case ${counter}: ${name} ===`);
    out.push(body);
    out.push("");
};

// A case is wrapped in its own Func so the fixture is a valid program and every
// case is independently parseable. The continuation always goes in front of a
// real statement, never between `Func name()` and the first statement.
const func = (name, body) => {
    for (const [vname, v] of Object.entries(VARIANTS)) {
        emit(`${name} / ${vname}`, [
            `Func ${name}()`,
            v(body),
            "\tReturn 1",
            "EndFunc",
            "",
        ].join(NL));
    }
};

// ---- operators ------------------------------------------------------------
const OPS = ["+", "-", "*", "/", "^", "&", "<", ">", "<=", ">=", "==", "<>", "And", "Or",
             "+=", "-=", "*=", "/=", "&="];
for (const op of OPS) {
    func(`Expr_op_${op.replace(/[^A-Za-z0-9]/g, "_")}`, `\tLocal $result = 1 ${op} 2`);
}
func("Unary_Not",    "\tLocal $result = Not 1");
func("Unary_Minus",  "\tLocal $result = -1");
func("Ternary",      "\tLocal $result = 1 ? 2 : 3");
func("ParenExpr",    "\tLocal $result = (1 + 2) * 3");

// ---- lists and delimiters -------------------------------------------------
func("CallArgs_comma",     "\tLocal $result = MyFunc(1, 2, 3)");
func("ArrayLiteral",       "\tLocal $result = [1, 2, 3]");
func("VariableDecl_comma", "\tLocal $a = 1, $b = 2, $c = 3");
func("ConstDecl_comma",    "\tConst $a = 1, $b = 2");
func("MemberAccess_dot",   "\tLocal $result = $obj.property.another");
func("MemberAccess_index", "\tLocal $result = $arr[1]");
func("Literal_Hex",        "\tLocal $result = 0xFF");
func("Literal_String",     '\tLocal $result = "text"');
func("Macro",              "\tLocal $result = @ScriptDir");

// ---- control flow ---------------------------------------------------------
func("IfCondition",        "\tIf 1 < 2 Then\n\t\tLocal $x = 1\n\tEndIf");
func("ForRange",           "\tFor $i = 1 To 10\n\tNext");
func("ForStep",            "\tFor $i = 1 To 10 Step 2\n\tNext");
func("WhileCondition",     "\tWhile 1\n\tWEnd");
func("DoUntil",            "\tDo\n\t\tLocal $x = 1\n\tUntil 1");
func("SwitchDiscriminant", "\tSwitch 1\n\t\tCase 1\n\t\t\tLocal $x = 1\n\tEndSwitch");
func("CaseRangeTo",        "\tSwitch 1\n\t\tCase 1 To 2\n\t\t\tLocal $x = 1\n\tEndSwitch");

// ---- FormalParameter (uses `Whitespace`, singular) ------------------------
for (const [vname, v] of Object.entries(VARIANTS)) {
    counter++;
    out.push(`; === case ${counter}: FormalParameter_List / ${vname} ===`);
    out.push([`Func FormalParam${counter}(ByRef $t, $u)`, "\tLocal $dummy = 1", "EndFunc", ""].join(NL));

    counter++;
    out.push(`; === case ${counter}: FormalParameter_ConstByRef / ${vname} ===`);
    out.push([`Func FormalConst${counter}(Const ByRef $t, ByRef $u)`, "\tLocal $dummy = 1", "EndFunc", ""].join(NL));
}

// ---- Enum: [scope] Enum [Step <sign><digits>] <constantlist> --------------
// One statement terminated by EOS, which means the whole thing has to be on a
// single physical line: a newline ends the statement before the constant list.
// There is no `EndEnum` and no enum name.
// The Step clause is the one place that uses `Whitespace` (singular) between
// the Step token, the sign and the digits.
const SINGLE_LINE = (v, head, step, members) =>
    v([head, step, members].filter(Boolean).join(" ")) + NL;

for (const [vname, v] of Object.entries(VARIANTS)) {
    for (const [sname, step] of Object.entries({
        stepPlus:  "Step +2",
        stepMinus: "Step -3",
        stepStar:  "Step *4",
        stepBare:  "Step 5",
    })) {
        counter++;
        out.push(`; === case ${counter}: Enum_${sname} / ${vname} ===`);
        out.push(SINGLE_LINE(v, "Local Enum", step, "$a = 1, $b = 3"));
    }

    for (const [sname, head] of Object.entries({
        plain:     "Local Enum",
        global:    "Global Enum",
        dim:       "Dim Enum",
        constEnum: "Local Const Enum",
        noScope:   "Enum",
    })) {
        counter++;
        out.push(`; === case ${counter}: Enum_${sname} / ${vname} ===`);
        out.push(SINGLE_LINE(v, head, null, "$a = 1, $b = 3"));
    }

    // The documented form, with per-member initialisers.
    counter++;
    out.push(`; === case ${counter}: Enum_membersWithInit / ${vname} ===`);
    out.push(SINGLE_LINE(v, "Local Enum", "Step *2",
        "$eVariant1 = 1, $eVariant2, $eVariant3 = 5, $eVariant4"));
}

// ---- EOS / SingleLineComment interaction (highest risk) -------------------
// LineContinuation allows a trailing comment before its newline, and EOS also
// accepts a trailing comment. The two interact.
for (const [vname, v] of Object.entries(VARIANTS)) {
    counter++;
    out.push(`; === case ${counter}: EOS_trailingComment / ${vname} ===`);
    out.push([
        `Func EosComment${counter}()`,
        v("\tLocal $a = 1 ; comment on the continued line"),
        "\tReturn $a ; comment on the last line",
        "EndFunc",
        "",
    ].join(NL));
}

// A continuation joins two physical lines into one logical line.
counter++;
out.push(`; === case ${counter}: continuation_joins_lines ===`);
out.push(["Func ContJoin()", "\tLocal $a = _", "\t1 + 2", "\tReturn $a", "EndFunc", ""].join(NL));

// ---- statement boundaries -------------------------------------------------
for (const [vname, v] of Object.entries(VARIANTS)) {
    counter++;
    out.push(`; === case ${counter}: statement_boundary / ${vname} ===`);
    out.push([
        `Func StmtBoundary${counter}()`,
        v("\tLocal $a = 1"),
        v("\tLocal $b = 2"),
        v("\t$a = $b"),
        "\tReturn $a",
        "EndFunc",
        "",
    ].join(NL));
}

// ---- inside With blocks (the InWith rule family) --------------------------
for (const [vname, v] of Object.entries(VARIANTS)) {
    counter++;
    out.push(`; === case ${counter}: With_block / ${vname} ===`);
    out.push([
        `Func WithCase${counter}($o)`,
        "\tWith $o",
        v("\t\t.a = 1 ; set a"),
        v("\t\t.b = 2 ; set b"),
        "\tEndWith",
        "\tReturn $o",
        "EndFunc",
        "",
    ].join(NL));
}

// ---- comments in every position ------------------------------------------
for (const [vname, v] of Object.entries(VARIANTS)) {
    counter++;
    out.push(`; === case ${counter}: comments_everywhere / ${vname} ===`);
    out.push([
        "; leading comment",
        `Func CommentMix${counter}($a)`,
        "\t; a plain comment",
        v("\t; a comment on a continued line"),
        v("\tLocal $b = 1 ; trailing"),
        "\t; another comment",
        "\tReturn $b ; final comment",
        "EndFunc ; comment after EndFunc",
        "",
    ].join(NL));
}

// ---- large mixed file -----------------------------------------------------
counter++;
out.push(`; === case ${counter}: large_mixed ===`);
{
    const keys = Object.keys(VARIANTS);
    const lines = [`Func Large${counter}($a, $b)`];
    for (let i = 0; i < 60; i++) {
        const v = VARIANTS[keys[i % keys.length]];
        if (i % 5 === 0) lines.push(v(`\tIf $a > ${i} And $b < 10 Then`));
        else if (i % 5 === 1) lines.push(v(`\t\tLocal $v${i} = MyFunc(${i}, $a)`));
        else if (i % 5 === 2) lines.push(v(`\t\t$v${i} = $obj.prop[${i}] + 2 * 3`));
        else if (i % 5 === 3) lines.push(v("\t\tEndIf"));
        else lines.push(v(`\t$s${i} = "text" & $a ; note`));
    }
    lines.push("\tReturn $a", "EndFunc", "");
    out.push(lines.join(NL));
}

// ---- negative cases: these MUST NOT parse --------------------------------
// Note: a bare `_` is NOT a negative case. IdentifierStart is [a-zA-Z_], so `_`
// on its own is a legal identifier, and the parser correctly reads `_` followed
// by a newline as an ExpressionStatement rather than a continuation.
//
// These are the constructs that genuinely cannot parse. They would start
// parsing if the whitespace rules were loosened incorrectly.
const NEGATIVES = {
    double_underscore_no_newline:  "Func f()\n\tLocal $a = 1 __\n\t+ 2\nEndFunc\n",
    continuation_before_EndFunc:   "Func f()\n\tLocal $a = 1 _\n\tEndFunc\n",
    continuation_then_comma:       "Func f()\n\tLocal $a = 1 _\n\t, 2\nEndFunc\n",
    continuation_then_closing:     "Func f()\n\tLocal $a = 1 _\n\t)\nEndFunc\n",
    continuation_then_colon:       "Func f()\n\tLocal $a = 1 _\n\t: 2\nEndFunc\n",
    continuation_before_Next:      "Func f()\n\tFor $i = 1 To 10 _\n\tNext\nEndFunc\n",
    continuation_before_EndIf:     "Func f()\n\tIf 1 Then\n\t\t$a = 1 _\n\tEndIf\nEndFunc\n",
    continuation_in_param_list:    "Func f(_\n\t$a)\n\tReturn $a\nEndFunc\n",
    continuation_before_Return_kw: "Func f()\n\t$a = 1 _\n\tReturn\nEndFunc\n",
    continuation_then_EndWith:     "Func f($o)\n\tWith $o\n\t\t.a = 1 _\n\tEndWith\nEndFunc\n",
    continuation_then_endfunc_eof: "Func f()\n\tLocal $a = 1 _\nEndFunc\n_",
};

writeFileSync(OUT, out.join(NL));
writeFileSync(NEG_OUT, JSON.stringify(NEGATIVES, null, 2) + "\n");

console.log("wrote " + OUT);
console.log("wrote " + NEG_OUT);
console.log("positive cases: " + counter);
console.log("negative cases: " + Object.keys(NEGATIVES).length);
