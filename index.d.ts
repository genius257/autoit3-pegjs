import { LocationRange as PeggyLocationRange, Location as PeggyLocation, Parser, ParserOptions, parser as PeggyParser } from "peggy"

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

export type Location = PeggyLocation;
export type LocationRange = PeggyLocationRange;

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
    type: "EnumDeclaration",
    declarations: EnumDeclarationList,
    stepoperator: "+"|"-"|"*",
    stepval: number,
    location: PeggyLocationRange,
}

export type LocalToken = AnyCase<"Local">
export type GlobalToken = AnyCase<"Global">
export type DimToken = AnyCase<"Dim">

export type EmptyStatement = {
    type: "EmptyStatement",
    location: PeggyLocationRange,
};

export type SingleLineComment = {
    type: "SingleLineComment",
    body: string,
    location: PeggyLocationRange,
}

export type ExpressionStatement = {
    type: "ExpressionStatement",
    expression: Expression,
    location: PeggyLocationRange,
}

export type IfStatement = {
    type: "IfStatement",
    test: Expression,
    consequent: StatementList|null,
    alternate: ElseIfClauses|Array<ElseClause>,//FIXME not sure if & or | sould be used!
    location: PeggyLocationRange,
} | {
    type: "IfStatement",
    test: Expression,
    consequent: ExpressionStatement|VariableStatement,
    location: PeggyLocationRange,
}

export type ElseIfClauses = Array<ElseIfClause>
export type ElseIfClause = {
    type: "ElseIfStatement",
    test: Expression,
    consequent: StatementList|null,
    location: PeggyLocationRange,
}
export type ElseClause = {
    type: "ElseStatement",
    consequent: StatementList|null,
    location: PeggyLocationRange,
};

export type IterationStatement = {
    type: "DoWhileStatement",
    body: StatementList,
    test: Expression,
    location: PeggyLocationRange,
} | {
    type: "WhileStatement",
    test: Expression,
    body: StatementList,
    location: PeggyLocationRange,
} | {
    type: "ForStatement",
    id: VariableIdentifier,
    init: Expression,
    test: Expression,
    update: Expression|null,
    body: StatementList,
    location: PeggyLocationRange,
} | {
    type: "ForInStatement",
    left: VariableIdentifier,
    right: Expression,
    body: StatementList,
    location: PeggyLocationRange,
}

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
    cases: CaseBlock,
    location: PeggyLocationRange,
}

export type ExitStatement = {
    type: "ExitStatement",
    argument: AssignmentExpression|null,
    location: PeggyLocationRange,
}

export type PreProcStatement = PreProc;
export type PreProc = {
    type: "IncludeOnceStatement",
    location: PeggyLocationRange,
} | IncludeStatement | {
    type: "PreProcStatement",
    body: string,
    location: PeggyLocationRange,
}

export type IncludeStatement = {
    type: "IncludeStatement",
    library: IncludeFileName[0]
    file: IncludeFileName[1],
    location: PeggyLocationRange,
};

export type MultiLineComment = {
    type: "MultiLineComment",
    body: string,
    location: PeggyLocationRange,
}

export type SelectStatement = {
    type: "SelectStatement",
    cases: SelectCaseBlock,
    location: PeggyLocationRange,
}

export type Identifier = IdentifierName;
export type IdentifierName = {
    type: "Identifier",
    name: string,
    location: PeggyLocationRange,
}

export type FormalParameterList = Array<FormalParameter>;
export type FormalParameter = {
    type: "Parameter",
    "const": boolean,
    byref: true,
    id: VariableIdentifier,
    init: Expression,
    location: PeggyLocationRange,
} | {
    type: "Parameter",
    byref: boolean,
    "const": true,
    id: VariableIdentifier,
    init: Expression,
    location: PeggyLocationRange,
} | {
    type: "Parameter",
    "const": false,
    byref: false,
    id: VariableIdentifier ,
    init: Expression,
    location: PeggyLocationRange,
}

export type StatementList = Array<Statement>;

export type VariableDeclarationList = Array<VariableDeclaration>;

export type RedimIdentifierExpression = {
    type: "RedimIdentifierExpression",
    id: VariableIdentifier,
    location: PeggyLocationRange,
}

export type EnumDeclarationList = Array<EnumDeclaration>;

export type Expression = AssignmentExpression;

export type AssignmentExpression = {
    type: "AssignmentExpression",
    operator: "=",
    left: LeftHandSideExpression,
    right: AssignmentExpression,
    location: PeggyLocationRange,
} | {
    type: "AssignmentExpression",
    operator: AssignmentOperator,
    left: LeftHandSideExpression,
    right: AssignmentExpression,
    location: PeggyLocationRange,
} | ConditionalExpression;

export type AssignmentOperator = "*=" | "/=" | "+=" | "-=" | "&=";

export type CaseBlock = [...CaseClauses, DefaultClause, ...CaseClauses];

/** File URI */
export type IncludeFileName = [boolean, string];

export type SelectCaseBlock = [...SelectCaseClauses, DefaultClause, ...SelectCaseClauses];

export type VariableIdentifier = {
    type: "VariableIdentifier",
    name: string,
    location: PeggyLocationRange,
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
    location: PeggyLocationRange,
} | LogicalORExpression;

export type CaseClauses = Array<CaseClause>;

export type DefaultClause = {
    type: "SwitchCase",
    tests: null,
    consequent: StatementList,
    location: PeggyLocationRange,
}

export type SelectCaseClauses = SelectCaseClause[]

export type Initialiser = AssignmentExpression | ArrayDeclaration;

export type LogicalORExpression = LogicalExpression<LogicalOROperator, LogicalANDExpression>
export type LogicalANDExpression = LogicalExpression<LogicalANDOperator, NotExpression>

export type LogicalOROperator = OrToken;
export type LogicalANDOperator = AndToken;
export type OrToken = AnyCase<"Or">;
export type AndToken = AnyCase<"And">;

export type LogicalExpression<Operator, T> = {
    type: "LogicalExpression",
    operator: Operator,
    left: T,
    right: T,
    location: PeggyLocationRange,
} | T;

export type CaseClause = {
    type: "SwitchCase",
    tests: CaseValueList,
    consequent: StatementList,
    location: PeggyLocationRange,
} | SingleLineComment;

export type SelectCaseClause = {
    type: "SelectCase",
    tests: AssignmentExpression,
    consequent: StatementList,
    location: PeggyLocationRange,
}

export type ArrayDeclaration = {
    type: "ArrayDeclaration",
    elements: ArrayDeclarationElementList|null,
    location: PeggyLocationRange,
}

export type NotExpression = {
    type: "NotExpression",
    value: EqualityExpression,
    location: PeggyLocationRange,
} | EqualityExpression

export type CaseValueList = Array<SwitchCaseValue>;

export type ArrayDeclarationElementList = Array<Expression|ArrayDeclaration>;

export type EqualityExpression = BinaryExpression<EqualityOperator, RelationalExpression>

export type BinaryExpression<Operator, T> = {
    type: "BinaryExpression",
    operator: Operator,
    left: T,
    right: T,
    location: PeggyLocationRange,
}|T;

export type SwitchCaseValue = {
    type: "SwitchCaseRange",
    from: Expression,
    to: Expression,
    location: PeggyLocationRange,
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
    prefix: true,
    location: PeggyLocationRange,
}

export type ExponentialOperator = "^"

export type UnaryOperator = 
 // "++"
  //| "--"
  "+"
  | "-"
  //| "~"
  //| "!"

export type CallExpression = {
    type: "CallExpression",
    callee: MemberExpression,
    arguments: Arguments,
    location: PeggyLocationRange,
}

type _MemberExpression = {
    type: "MemberExpression",
    object: _MemberExpression|PrimaryExpression,
    property: Expression|IdentifierName,
    /** true if array accessor, false if object property */
    computed: boolean,
    location: PeggyLocationRange,
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

export type Macro = { type: "Macro", value: string, location: PeggyLocationRange, }
export type DefaultKeyword = { type: "Keyword", value: "Default", location: PeggyLocationRange, }

export type Literal =
NullLiteral
|BooleanLiteral
|NumericLiteral
|StringLiteral

export type NullLiteral = { type: "Literal", value: null, location: PeggyLocationRange, }
export type BooleanLiteral = { type: "Literal", value: boolean, location: PeggyLocationRange, }
export type NumericLiteral = HexIntegerLiteral|DecimalLiteral
export type StringLiteral = { type: "Literal", value: string, location: PeggyLocationRange, }

export type HexIntegerLiteral = { type: "Literal", value: number, location: PeggyLocationRange, }
export type DecimalLiteral = { type: "Literal", value: number, location: PeggyLocationRange, }
