import { LocationRange as PeggyLocationRange, Parser, ParserOptions, parser as PeggyParser } from "peggy"

/**
 * @see https://stackoverflow.com/a/64932909/3958400
 */
type AnyCase<T extends string> =
    string extends T ? string :
    T extends `${infer F1}${infer F2}${infer R}` ? (
        `${Uppercase<F1> | Lowercase<F1>}${Uppercase<F2> | Lowercase<F2>}${AnyCase<R>}`
    ) :
    T extends `${infer F}${infer R}` ? `${Uppercase<F> | Lowercase<F>}${AnyCase<R>}` :
    ""

export type SyntaxError = PeggyParser.SyntaxError;

export interface AutoItParser extends Parser {
    parse(input: string, options?: ParserOptions): Program;
}

declare const parser: AutoItParser;
export default parser;

export type Program = {
    type: "Program",
    body: SourceElements,
}

export type SourceElements = Array<SourceElement>;

export type SourceElement = (Statement|FunctionDeclaration);

export type Statement = VariableStatement|EmptyStatement|SingleLineComment|ExpressionStatement|IfStatement|IterationStatement|ContinueLoopStatement|ContinueCaseStatement|ExitLoopStatement|ReturnStatement|WithStatement|SwitchStatement|ExitStatement|PreProcStatement|MultiLineComment|SelectStatement

export type FunctionDeclaration = {
    type: "FunctionDeclaration",
    id: Identifier,
    params: FormalParameterList,
    body: StatementList,
    location: PeggyLocationRange,
}

export type VariableStatement = {
    scope: LocalToken|GlobalToken|DimToken|null,
    constant: boolean,
    static_: boolean,
    type: "VariableDeclaration",
    declarations: VariableDeclarationList,
    location: PeggyLocationRange,
} | {
    type: "RedimExpression",
    declarations: Array<RedimIdentifierExpression>,
    location: PeggyLocationRange,
} | {
    scope: LocalToken|GlobalToken|DimToken,
    constant: boolean,
    static: false,
    type: "VariableDeclaration",
    declarations: EnumDeclarationList,
}

export type LocalToken = AnyCase<"Local">
export type GlobalToken = AnyCase<"Global">
export type DimToken = AnyCase<"Dim">

export type EmptyStatement = {
    type: "EmptyStatement",
};

export type SingleLineComment = {
    type: "SingleLineComment",
    body: string,
}

export type ExpressionStatement = {
    type: "ExpressionStatement",
    expression: Expression,
}

export type IfStatement = {
    type: "IfStatement",
    test: Expression,
    consequent: StatementList|null,
    alternate: ElseIfClauses|Array<ElseClause>//FIXME not sure if & or | sould be used!
} | {
    type: "IfStatement",
    test: Expression,
    consequent: Statement,
}

export type ElseIfClauses = Array<ElseIfClause>
export type ElseIfClause = {
    type: "ElseIfStatement",
    test: Expression,
    consequent: StatementList|null,
}
export type ElseClause = StatementList|null;

export type IterationStatement = {
    type: "DoWhileStatement",
    body: StatementList,
    test: Expression
} | {
    type: "WhileStatement",
    test: Expression,
    body: StatementList,
} //FIXME: for and for in not ready

export type ContinueLoopStatement = {
    type: "ContinueLoopStatement",
    level: Expression|null,
    location: PeggyLocationRange,
}
export type ContinueCaseStatement = {
    type: "ContinueCaseStatement",
    location: PeggyLocationRange,
}
export type ExitLoopStatement = {
    type: "ExitLoopStatement",
    level: Expression|null,
    location: PeggyLocationRange,
}
export type ReturnStatement = {
    type: "ReturnStatement",
    value: Expression|null,
    location: PeggyLocationRange,
}
export type WithStatement = {
    type: "WithStatement",
    object: Expression|null,
    body: StatementList,
    location: PeggyLocationRange,
}

export type SwitchStatement = {
    type: "SwitchStatement",
    discriminant: Expression,
    cases: CaseBlock
}

export type ExitStatement = {
    type: "ExitStatement",
    argument: AssignmentExpression|null,
}

export type PreProcStatement = PreProc;
export type PreProc = {
    type: "IncludeOnceStatement"
} | {
    type: "IncludeStatement",
    file: IncludeFileNameLiteral,
    location: PeggyLocationRange,
} | {
    type: "PreProcStatement",
    body: string,
}

export type MultiLineComment = {
    type: "MultiLineComment",
    body: string,
}

export type SelectStatement = {
    type: "SelectStatement",
    cases: SelectCaseBlock,
}

export type Identifier = IdentifierName;
export type IdentifierName = {
    type: "Identifier",
    name: string,
}

export type FormalParameterList = Array<FormalParameter>;
export type FormalParameter = {
    type: "Parameter",
    "const": boolean,
    byref: true,
    id: VariableIdentifier,
    init: Expression,
} | {
    type: "Parameter",
    byref: boolean,
    "const": true,
    id: VariableIdentifier,
    init: Expression,
} | {
    type: "Parameter",
    "const": false,
    byref: true,
    id: VariableIdentifier ,
    init: Expression,
}

export type StatementList = Array<Statement>;

export type VariableDeclarationList = Array<VariableDeclaration>;

export type RedimIdentifierExpression = {
    type: "RedimIdentifierExpression",
}

export type EnumDeclarationList = Array<EnumDeclaration>;

export type Expression = AssignmentExpression;

export type AssignmentExpression = {
    type: "AssignmentExpression",
    operator: "=",
    left: LeftHandSideExpression,
    right: AssignmentExpression
} | {
    type: "AssignmentExpression",
    operator: AssignmentOperator,
    left: LeftHandSideExpression,
    right: AssignmentExpression
} | ConditionalExpression;

export type AssignmentOperator = "*=" | "/=" | "+=" | "-=" | "&=";

export type CaseBlock = [...CaseClauses, DefaultClause, ...CaseClauses];

/** File URI */
export type IncludeFileNameLiteral = string;

export type SelectCaseBlock = [...SelectCaseClauses, DefaultClause, ...SelectCaseClauses];

export type VariableIdentifier = {
    type: "VariableIdentifier",
    name: string,
};

export type VariableDeclaration = {
    type: "VariableDeclarator",
    id: VariableIdentifier,
    init: Initialiser|null,
    location: PeggyLocationRange,
}

export type EnumDeclaration = {
    type: "VariableDeclarator",
    id: VariableIdentifier,
    init: AssignmentExpression|null,
    location: PeggyLocationRange,
}

export type LeftHandSideExpression = CallExpression|MemberExpression

export type ConditionalExpression = {
    type: "ConditionalExpression",
    test: LogicalORExpression,
    consequent: AssignmentExpression,
    alternate: AssignmentExpression,
} | LogicalORExpression;

export type CaseClauses = Array<CaseClause>;

export type DefaultClause = {
    type: "SwitchCase",
    test: null,
    consequent: StatementList,
}

export type SelectCaseClauses = SelectCaseClause[]

export type Initialiser = AssignmentExpression | ArrayDeclaration;

export type LogicalORExpression = LogicalExpression<LogicalOROperator, LogicalANDExpression>
export type LogicalANDExpression = LogicalExpression<LogicalANDOperator, NotExpression>

export type LogicalOROperator = [OrToken, string];
export type LogicalANDOperator = [AndToken, string];
export type OrToken = AnyCase<"Or">;
export type AndToken = AnyCase<"And">;

export type LogicalExpression<Operator, T> = {
    type: "LogicalExpression",
    operator: Operator,
    left: T,
    right: T,
} | T;

export type CaseClause = {
    type: "SwitchCase",
    tests: CaseValueList,
    consequent: StatementList,
} | SingleLineComment;

export type SelectCaseClause = {
    type: "SelectCase",
    tests: AssignmentExpression,
    consequent: StatementList,
}

export type ArrayDeclaration = {
    type: "ArrayDeclaration",
    elements: ArrayDeclarationElementList|null,
}

export type NotExpression = {
    type: "NotExpression",
    value: EqualityExpression,
} | EqualityExpression

export type CaseValueList = Array<SwitchCaseValue>;

export type ArrayDeclarationElementList = Array<Expression|ArrayDeclaration>;

export type EqualityExpression = BinaryExpression<EqualityOperator, RelationalExpression>

export type BinaryExpression<Operator, T> = {
    type: "BinaryExpression",
    operator: Operator,
    left: T,
    right: T
}|T;

export type SwitchCaseValue = {
    type: "SwitchCaseRange",
    from: Expression,
    to: Expression,
}

export type RelationalExpression = BinaryExpression<RelationalOperator, AdditiveExpression>;

export type EqualityOperator = "==" |
//| "!=="
"="
//| "!="

export type AdditiveExpression = BinaryExpression<AdditiveOperator, MultiplicativeExpression>;

export type RelationalOperator = "<="
| ">="
| "<>" //TODO: this may not belong here
| "<"
| ">"

export type MultiplicativeExpression = BinaryExpression<MultiplicativeOperator, ExponentialExpression>;

export type AdditiveOperator = "+"
| "-"
| "&"

export type ExponentialExpression = BinaryExpression<ExponentialOperator, UnaryExpression>;

export type MultiplicativeOperator = "*"
| "/"
//| $("%" !"=")

export type UnaryExpression = LeftHandSideExpression | {
    type: "UnaryExpression",
    operator: UnaryOperator,
    argument: UnaryExpression,
    prefix: true
}

export type ExponentialOperator = "^"

export type UnaryOperator = 
 // "++"
  //| "--"
  "+"
  | "-"
  //| "~"
  //| "!"

export type CallExpression = { //FIXME
    type: "CallExpression",
    callee: MemberExpression,
    arguments: Arguments,
}

type _MemberExpression = {
    type: "MemberExpression",
    object: _MemberExpression|PrimaryExpression,
    property: Expression|IdentifierName,
    computed: boolean,
}

export type MemberExpression = _MemberExpression|PrimaryExpression|Macro

export type Arguments = ArgumentList
export type ArgumentList = Array<AssignmentExpression>

export type PrimaryExpression = 
Identifier
|VariableIdentifier
|Literal
//|ArrayLiteral
//|ObjectLiteral
|ExpressionStatement //FIXME:changed from expression to expressionstatement, to solve circular reference. Make sure this is correct.
|DefaultKeyword

export type Macro = { type: "Macro", value: string }
export type DefaultKeyword = { type: "Keyword", value: "Default" }

export type Literal =
NullLiteral
|BooleanLiteral
|NumericLiteral
|StringLiteral

export type NullLiteral = { type: "Literal", value: null }
export type BooleanLiteral = { type: "Literal", value: boolean }
export type NumericLiteral = HexIntegerLiteral|DecimalLiteral
export type StringLiteral = { type: "Literal", value: string }

export type HexIntegerLiteral = { type: "Literal", value: number }
export type DecimalLiteral = { type: "Literal", value: number }
