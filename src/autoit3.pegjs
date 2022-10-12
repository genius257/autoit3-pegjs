// AutoIt3 Grammar
// ==================
//
// Target AutoIt3 version is: 3.3.14.5
//

{
  var TYPES_TO_PROPERTY_NAMES = {
    CallExpression:   "callee",
    MemberExpression: "object",
  };

  function extractOptional(optional, index) {
    return optional ? optional[index] : null;
  }

    function extractList(list, index) {
      return list.map(function(element) { return element[index]; });
    }

  function buildList(head, tail, index) {
    return [head].concat(extractList(tail, index));
  }

  function buildBinaryExpression(head, tail) {
    return tail.reduce(function(result, element) {
      return {
        type: "BinaryExpression",
        operator: element[1],
        left: result,
        right: element[3]
      };
    }, head);
  }

  function buildLogicalExpression(head, tail) {
    return tail.reduce(function(result, element) {
      return {
        type: "LogicalExpression",
        operator: element[1],
        left: result,
        right: element[3]
      };
    }, head);
  }

  function optionalList(value) {
    return value !== null ? value : [];
  }
}

Start
    = __ program:Program __ { return program; }

PreProc
  = "#include-once"i {
    return { type: "IncludeOnceStatement" };
  }
  / "#" 'include'i Whitespace file:IncludeFileNameLiteral { //FIXME: require once ore more whirespace
    return {
      type: "IncludeStatement", //FIXME: move into a new rule IncludeStatement
      file: file,
      location: location(),
    };
  }
  / "#" !(CSToken / CEToken / CommentsStartToken / CommentsEndToken) body:(!Newline .)+ {
    return { type: "PreProcStatement", body: body };
  }

IncludeFileNameLiteral
  = "<" file:[^:?"<>]+ ">" {
    return file.join("");
  }
  / '"' file:[^:?"<>]+ '"' {
    return file.join("");
  }
  / "'" file:[^:?"'<>]+ "'" {
    return file.join("");
  }

LiteralWhitespace = "\u0009" / "\u0020"

Whitespace = LineContinuation LiteralWhitespace* / LiteralWhitespace+

OptionalWhitespace = Whitespace?

LineContinuation = LiteralWhitespace+ '_' LiteralWhitespace* SingleLineComment? Newline

Newline = LineTerminatorSequence

EnumDeclarationList
  = head:EnumDeclaration tail:(__ "," __ EnumDeclaration)* {
      return buildList(head, tail, 3);
    }

VariableDeclarationList
  = head:VariableDeclaration tail:(__ "," __ VariableDeclaration)* {
      return buildList(head, tail, 3);
    }

VariableDeclaration
  = id:VariableIdentifier ("[" __ Expression? __ "]")* init:(__ Initialiser)? {
      return {
        type: "VariableDeclarator",
        id: id,
        init: extractOptional(init, 1),
        location: location(),
      };
    }

EnumDeclaration = id:VariableIdentifier init:(__ '=' __ AssignmentExpression)? {
  return {
    type: "VariableDeclarator",
    id: id,
    init: extractOptional(init, 3),
    location: location(),
  }
}

Initialiser
  = "=" !"=" __ expression:(AssignmentExpression / ArrayDeclaration) { return expression; }

VariableIdentifier = '$' head:[a-zA-Z_] tail:[0-9a-zA-Z_]*
  {return {
    type: "VariableIdentifier",
    name: head + tail.join("")
  }}

ArrayExpression = ArrayDeclaration

Number = HexIntegerLiteral / Integer

HexDigit
  = [0-9a-f]i

HexIntegerLiteral
    = "0x"i digits:$HexDigit+ {
        return { type: "Literal", value: parseInt(digits, 16) };
    }

Integer = [0-9]+

//FIXME: !('"' / LineTerminator) instead of [^"]
StringLiteral "string"
  = '"' chars:([^"] / '""')* '"' {
    return { type: "Literal", value: chars.join("") }
  }
  / "'" chars:([^'] / "''")* "'" {
    return { type: "Literal", value: chars.join("") }
  }

Comment = SingleLineComment / MultiLineComment

SingleLineComment = ';' body:([^\u000A\u000D]*) {
  return {type: "SingleLineComment", body: body.join("")}
}

MultiLineCommentStartTag = "#" (CSToken / CommentsStartToken)

MultiLineComment
  = MultiLineCommentStartTag beforeBody:(LiteralWhitespace $(!Newline .)*)? body:(MultiLineComment/!(Newline Whitespace* MultiLineCommentEndTag) .)* Newline Whitespace* MultiLineCommentEndTag afterBody:(LiteralWhitespace+ $(!Newline .)*)? {
    return {
      type: "MultiLineComment",
      body: (extractOptional(beforeBody, 1) !== null ? [extractOptional(beforeBody, 1)] : []).concat(body.map((match) => match[1] ?? match).reduce((carry, match) => {
        typeof match === "string" && typeof match === typeof carry[carry.length-1] ? carry[carry.length-1]+=match : carry.push(match);
        return carry;
      }, []).concat(extractOptional(afterBody, 1) ?? [])),
    };
  }

MultiLineCommentEndTag = '#' (CEToken / CommentsEndToken)

ArrayDeclaration = "[" __ elements:ArrayDeclarationElementList? __ "]" {
  return {
    type: "ArrayDeclaration",
    elements: elements,
  }
}

ArrayDeclarationElementList
  = head:(Expression / ArrayDeclaration) tail:(__ "," __ (Expression / ArrayDeclaration))* {
      return buildList(head, tail, 3);
    }

Identifier = !ReservedWord name:IdentifierName { return name; }

IdentifierName "identifier"
  = head:IdentifierStart tail:IdentifierPart* {
      return {
        type: "Identifier",
        name: head + tail.join(""),
        location: location(),
      };
    }

IdentifierStart
  = Letter
  / "_"

IdentifierPart
  = IdentifierStart
  / DecimalDigit

Macro
    = value: $("@" (
    "AppDataCommonDir"i
    / "AppDataDir"i
    / "AutoItExe"i
    / "AutoItPID"i
    / "AutoItVersion"i
    / "AutoItX64"i
    / "COM_EventObj"i
    / "CommonFilesDir"i
    / "Compiled"i
    / "ComputerName"i
    / "ComSpec"i
    / "CPUArch"i
    / "CRLF"i
    / "CR"i
    / "DesktopCommonDir"i
    / "DesktopDepth"i
    / "DesktopDir"i
    / "DesktopHeight"i
    / "DesktopRefresh"i
    / "DesktopWidth"i
    / "DocumentsCommonDir"i
    / "error"i
    / "exitCode"i
    / "exitMethod"i
    / "extended"i
    / "FavoritesCommonDir"i
    / "FavoritesDir"i
    / "GUI_CtrlHandle"i
    / "GUI_CtrlId"i
    / "GUI_DragFile"i
    / "GUI_DragId"i
    / "GUI_DropId"i
    / "GUI_WinHandle"i
    / "HomeDrive"i
    / "HomePath"i
    / "HomeShare"i
    / "HotKeyPressed"i
    / "HOUR"i
    / "IPAddress"i [1-4]
    / "KBLayout"i
    / "LF"i
    / "LocalAppDataDir"i
    / "LogonDNSDomain"i
    / "LogonDomain"i
    / "LogonServer"i
    / "MDAY"i
    / "MIN"i
    / "MON"i
    / "MSEC"i
    / "MUILang"i
    / "MyDocumentsDir"i
    / "NumParams"i
    / "OSArch"i
    / "OSBuild"i
    / "OSLang"i
    / "OSServicePack"i
    / "OSType"i
    / "OSVersion"i
    / "ProgramFilesDir"i
    / "ProgramsCommonDir"i
    / "ProgramsDir"i
    / "ScriptDir"i
    / "ScriptFullPath"i
    / "ScriptLineNumber"i
    / "ScriptName"i
    / "SEC"i
    / "StartMenuCommonDir"i
    / "StartMenuDir"i
    / "StartupCommonDir"i
    / "StartupDir"i
    / "SW_DISABLE"i
    / "SW_ENABLE"i
    / "SW_HIDE"i
    / "SW_LOCK"i
    / "SW_MAXIMIZE"i
    / "SW_MINIMIZE"i
    / "SW_RESTORE"i
    / "SW_SHOW"i
    / "SW_SHOWDEFAULT"i
    / "SW_SHOWMAXIMIZED"i
    / "SW_SHOWMINIMIZED"i
    / "SW_SHOWMINNOACTIVE"i
    / "SW_SHOWNA"i
    / "SW_SHOWNOACTIVATE"i
    / "SW_SHOWNORMAL"i
    / "SW_UNLOCK"i
    / "SystemDir"i
    / "TAB"i
    / "TempDir"i
    / "TRAY_ID"i
    / "TrayIconFlashing"i
    / "TrayIconVisible"i
    / "UserName"i
    / "UserProfileDir"i
    / "WDAY"i
    / "WindowsDir"i
    / "WorkingDir"i
    / "YDAY"i
    / "YEAR"i
    )) !IdentifierPart {
  return {
      type: "Macro",
      value: value,
  };
}

NullLiteral = NullToken { return { type: "Literal", value: null }; }

ReservedWord
    = Keyword
    / FutureReservedWord
    / NullLiteral
    / BooleanLiteral

Keyword
    = AndToken
    / ByRefToken
    / CaseToken
    / ConstToken
    / ContinueCaseToken
    / ContinueLoopToken
    / DefaultToken
    / DimToken
    / DoToken
    / ElseToken
    / ElseIfToken
    / EndFuncToken
    / EndIfToken
    / EndSelectToken
    / EndSwitchToken
    / EndWithToken
    / EnumToken
    / ExitToken
    / ExitLoopToken
    / ForToken
    / FuncToken
    / GlobalToken
    / IfToken
    / InToken
    / LocalToken
    / NextToken
    / NotToken
    / OrToken
    / RedimToken
    / ReturnToken
    / SelectToken
    / StaticToken
    / StepToken
    / SwitchToken
    / ThenToken
    / ToToken
    / UntilToken
    / VolatileToken
    / WEndToken
    / WhileToken
    / WithToken

FutureReservedWord
    = "@RESERVED" //NOTE: no future reserved words so far

WithStatement = WithToken object:(__ Expression) EOS //FIXME: WIP
body:StatementList?
EndWithToken EOS {
  return {
    type: "WithStatement",
    object: extractOptional(object, 1),
    body: optionalList(body),
    location: location()
  };
}

ReturnStatement = ReturnToken value:(__ Expression)? EOS {
  return {
    type: "ReturnStatement",
    value: extractOptional(value, 1),
    location: location()
  };
}

ExitLoopStatement = ExitLoopToken level:(__ Expression)? EOS {
  return {
    type: "ExitLoopStatement",
    level: extractOptional(level, 1),
    location: location()
  };
}

ContinueLoopStatement = ContinueLoopToken level:(__ Expression)? EOS {
  return {
    type: "ContinueLoopStatement",
    level: extractOptional(level, 1),
    location: location()
  };
}

ContinueCaseStatement = ContinueCaseToken EOS {
  return {
    type: "ContinueCaseStatement",
    location: location()
  };
}

SelectStatement = SelectToken EOS
(EmptyStatement / __ SingleLineComment EOS)*
cases:SelectCaseBlock //FIXME: WIP. verify that requirements are not too loose.
EndSelectToken EOS {
    return {
      type: "SelectStatement",
      cases: cases
    };
  }

SelectCaseBlock
  = __
    before:(SelectCaseClauses __)?
    default_: DefaultClause __
    after:(SelectCaseClauses __)? {//FIXME: verify that other case clauses can come after the default clase in au3
      return optionalList(extractOptional(before, 0))
        .concat(default_)
        .concat(optionalList(extractOptional(after, 0)));
    }
  / __ clauses:(SelectCaseClauses __)? { //FIXME: verify that "?" CAN be there
    return optionalList(extractOptional(clauses, 0));
  }

SelectCaseClauses
  = head:SelectCaseClause tail:(__ SelectCaseClause)* { return buildList(head, tail, 1); }

SelectCaseClause
  = CaseToken __ tests: AssignmentExpression EOS
    consequent: (__ StatementList)?
    {
      return {
        type: "SelectCase",
        tests: tests,
        consequent: optionalList(extractOptional(consequent, 1))
      };
    }

BooleanLiteral 
    = TrueToken  { return { type: "Literal", value: true  }; }
    / FalseToken { return { type: "Literal", value: false }; }

Literal
    = NullLiteral
    / BooleanLiteral
    / NumericLiteral
    / StringLiteral

// Tokens

AndToken           = "And"i            !IdentifierPart
ByRefToken         = "ByRef"i          !IdentifierPart
CaseToken          = "Case"i           !IdentifierPart
CEToken            = "ce"i             !IdentifierPart
CommentsStartToken = "comments-start"i !IdentifierPart
CommentsEndToken   = "comments-end"i   !IdentifierPart
ConstToken         = "Const"i          !IdentifierPart
ContinueCaseToken  = "ContinueCase"i   !IdentifierPart
ContinueLoopToken  = "ContinueLoop"i   !IdentifierPart
CSToken            = "cs"i             !IdentifierPart
DefaultToken       = "Default"i        !IdentifierPart
DimToken           = "Dim"i            !IdentifierPart
DoToken            = "Do"i             !IdentifierPart
ElseToken          = "Else"i           !IdentifierPart
ElseIfToken        = "ElseIf"i         !IdentifierPart
EndFuncToken       = "EndFunc"i        !IdentifierPart
EndIfToken         = "EndIf"i          !IdentifierPart
EndSelectToken     = "EndSelect"i      !IdentifierPart
EndSwitchToken     = "EndSwitch"i      !IdentifierPart
EndWithToken       = "EndWith"i        !IdentifierPart
EnumToken          = "Enum"i           !IdentifierPart
ExitToken          = "Exit"i           !IdentifierPart
ExitLoopToken      = "ExitLoop"i       !IdentifierPart
FalseToken         = "False"i          !IdentifierPart
ForToken           = "For"i            !IdentifierPart
FuncToken          = "Func"i           !IdentifierPart
GlobalToken        = "Global"i         !IdentifierPart
IfToken            = "If"i             !IdentifierPart
InToken            = "In"i             !IdentifierPart
LocalToken         = "Local"i          !IdentifierPart
NextToken          = "Next"i           !IdentifierPart
NullToken          = "Null"i           !IdentifierPart
NotToken           = "Not"i            !IdentifierPart
OrToken            = "Or"i             !IdentifierPart
RedimToken         = "Redim"i          !IdentifierPart
ReturnToken        = "Return"i         !IdentifierPart
SelectToken        = "Select"i         !IdentifierPart
StaticToken        = "Static"i         !IdentifierPart
StepToken          = "Step"i           !IdentifierPart
SwitchToken        = "Switch"i         !IdentifierPart
ThenToken          = "Then"i           !IdentifierPart
ToToken            = "To"i             !IdentifierPart
UntilToken         = "Until"i          !IdentifierPart
VolatileToken      = "Volatile"i       !IdentifierPart
TrueToken          = "True"            !IdentifierPart
WEndToken          = "WEnd"i           !IdentifierPart
WhileToken         = "While"i          !IdentifierPart
WithToken          = "With"i           !IdentifierPart

Letter
  = [a-z]i

//BUG: --------------------------------------------------------------------------------------------------------------------------------------

NumericLiteral "number"
  = literal:HexIntegerLiteral !(IdentifierStart / DecimalDigit) {
      return literal;
    }
  / literal:DecimalLiteral !(IdentifierStart / DecimalDigit) {
      return literal;
    }

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]

DecimalLiteral
  = DecimalIntegerLiteral "." DecimalDigit* ExponentPart? {
      return { type: "Literal", value: parseFloat(text()) };
    }
  / "." DecimalDigit+ ExponentPart? {
      return { type: "Literal", value: parseFloat(text()) };
    }
  / DecimalIntegerLiteral ExponentPart? {
      return { type: "Literal", value: parseFloat(text()) };
    }

DecimalIntegerLiteral
  = DecimalDigit+

ExponentPart
  = ExponentIndicator SignedInteger

ExponentIndicator
  = "e"i

SignedInteger
  = [+-]? DecimalDigit+

//BUG: --------------------------------------------------------------------------------------------------------------------------------------

MemberExpression
  = head:(
        PrimaryExpression
    )
    tail:(
        __ "[" __ property:Expression __ "]" {
          return { property: property, computed: true };
        }
      / __ "." __ property:IdentifierName {
          return { property: property, computed: false };
        }
    )*
    {
      return tail.reduce(function(result, element) {
        return {
          type: "MemberExpression",
          object: result,
          property: element.property,
          computed: element.computed
        };
      }, head);
    }
    / Macro


DefaultKeyword = DefaultToken { return { type: "Keyword", value: "Default" }; }

PrimaryExpression
  = Identifier
  / VariableIdentifier
  / Literal //FIXME: this does not make sense with dot and array access in au3
  // ArrayLiteral
  // ObjectLiteral
  / "(" __ expression:Expression __ ")" { return expression; }
  //FIXME: rules below are not sure if belong
  / DefaultKeyword

  //FIXME: all NewExpression are MemberExpression

CallExpression
  = head:(
      callee:MemberExpression __ args:Arguments {
        return { type: "CallExpression", callee: callee, arguments: args };
      }
    )
    tail:(
        __ args:Arguments {
          return { type: "CallExpression", arguments: args };
        }
      / __ "[" __ property:Expression __ "]" {
          return {
            type: "MemberExpression",
            property: property,
            computed: true
          };
        }
      / __ "." __ property:IdentifierName {
          return {
            type: "MemberExpression",
            property: property,
            computed: false
          };
        }
    )*
    {
      return tail.reduce(function(result, element) {
        element[TYPES_TO_PROPERTY_NAMES[element.type]] = result;
        return element;
      }, head);
    }

Arguments
  = "(" __ args:(ArgumentList __)? ")" {
      return optionalList(extractOptional(args, 0));
    }

ArgumentList
  = head:AssignmentExpression tail:(__ "," __ AssignmentExpression)* {
      return buildList(head, tail, 3);
    }

LeftHandSideExpression
  = CallExpression
  / MemberExpression

AssignmentExpression
  = left:LeftHandSideExpression __
    "=" !"=" __
    right:AssignmentExpression
    {
      return {
        type: "AssignmentExpression",
        operator: "=",
        left: left,
        right: right
      };
    }
  / left:LeftHandSideExpression __
    operator:AssignmentOperator __
    right:AssignmentExpression
    {
      return {
        type: "AssignmentExpression",
        operator: operator,
        left: left,
        right: right
      };
    }
  / ConditionalExpression

  AssignmentOperator //WARNING: au3 does not allow assignemnt in inline-expressions
  = "*="
  / "/="
  / "+="
  / "-="
  / "&="

  ConditionalExpression
  = test:LogicalORExpression __
    "?" __ consequent:AssignmentExpression __
    ":" __ alternate:AssignmentExpression
    {
      return {
        type: "ConditionalExpression",
        test: test,
        consequent: consequent,
        alternate: alternate
      };
    }
  / LogicalORExpression

LogicalORExpression
  = head:LogicalANDExpression
    tail:(__ LogicalOROperator __ LogicalANDExpression)*
    { return buildLogicalExpression(head, tail); }

LogicalANDExpression
  = head:NotExpression
    tail:(__ LogicalANDOperator __ NotExpression)*
    { return buildLogicalExpression(head, tail); }

LogicalOROperator
  = OrToken

LogicalANDOperator
 = AndToken WhiteSpace //FIXME: we need to allow multiple whitespaces

NotExpression
  = (NotToken __) value:EqualityExpression { return {
    type: "NotExpression",
    value: value
  } }
  / EqualityExpression

EqualityExpression //FIXME: support NOT
  = head:RelationalExpression
    tail:(__ EqualityOperator __ RelationalExpression)*
    { return buildBinaryExpression(head, tail); }

EqualityOperator
  = "=="
  // "!=="
  / "="
  // "!="

RelationalExpression
  = head:AdditiveExpression
    tail:(__ RelationalOperator __ AdditiveExpression)*
    { return buildBinaryExpression(head, tail); }

AdditiveExpression
  = head:MultiplicativeExpression
    tail:(__ AdditiveOperator __ MultiplicativeExpression)*
    { return buildBinaryExpression(head, tail); }

AdditiveOperator
  = $("+" ![+=])
  / $("-" ![-=])
  / $("&" ![=])

RelationalOperator
  = "<="
  / ">="
  / "<>" //TODO: this may not belong here
  / $("<" !"<")
  / $(">" !">")

MultiplicativeExpression
  = head:ExponentialExpression
    tail:(__ MultiplicativeOperator __ ExponentialExpression)*
    { return buildBinaryExpression(head, tail); }

MultiplicativeOperator
  = $("*" !"=")
  / $("/" !"=")
  // $("%" !"=")

ExponentialExpression
  = head:UnaryExpression
    tail:(__ ExponentialOperator __ UnaryExpression)*
    { return buildBinaryExpression(head, tail); }

ExponentialOperator
  = $("^" !"=")

UnaryExpression
  = LeftHandSideExpression
  / operator:UnaryOperator __ argument:UnaryExpression {
      return {
        type: "UnaryExpression",
        operator: operator,
        argument: argument,
        prefix: true
      };
    }

UnaryOperator//FIXME: NOT token in here?
  = 
  // "++"
  // "--"
  $("+" !"=")
  / $("-" !"=")
  // "~"
  // "!"

//BUG: --------------------------------------------------------------------------------------------------------------------------------------

Program
  = body:SourceElements? {
      return {
        type: "Program",
        body: optionalList(body)
      };
    }

SourceElements
  = head:SourceElement tail:(__ SourceElement)* {
      return buildList(head, tail, 1);
    }

SourceElement
  = Statement
  / FunctionDeclaration

//NOTE: au3 specific!
PreProcStatement = preproc:PreProc EOS {
  return preproc;
}

FunctionDeclaration
  = ("Volatile" __)? FuncToken __ id:Identifier __
  "(" __ params:(FormalParameterList __)? __ ")" EOS
  __ body:StatementList? __ EndFuncToken EOS {
    return {
      type: "FunctionDeclaration",
      id: id,
      params: optionalList(extractOptional(params, 0)),
      body: optionalList(body),
      location: location()
    };
  }

/*FormalParameterList
  = head:VariableIdentifier tail:(__ "," __ VariableIdentifier)* {
      return buildList(head, tail, 3);
    }*/
FormalParameterList
  = head:FormalParameter tail:(__ "," __ FormalParameter)* {
      return buildList(head, tail, 3);
    }

// HACK: start of custom support of function arguements with default value
//FIXME: currently this allows ($a, $b = 123, $c) but no parameters without Initializer allowed after first parameter with Initializer occurred
FormalParameter
  = _const:(ConstToken __)? ByRefToken __ id:VariableIdentifier __ init:("=" __ Expression)? {
    return {
      type: "Parameter",
      "const": !!extractOptional(_const, 0),
      byref: true,
      id: id,
      init: extractOptional(init, 2),
    };
  }
  / byref:(ByRefToken __)? ConstToken __ id:VariableIdentifier __ init:("=" __ Expression)? {
    return {
      type: "Parameter",
      byref: !!extractOptional(byref, 0),
      "const": true,
      id: id,
      init: extractOptional(init, 2),
    };
  }
  / id:VariableIdentifier __ init:("=" __ Expression)? {
    return {
      type: "Parameter",
      "const": false,
      byref: true,
      id: id,
      init: extractOptional(init, 2),
    };
  }

//Initializer

// HACK: end of custom support of function arguements with default value

Statement
  = VariableStatement //TODO: should we dilute?
  / EmptyStatement
  / SingleLineComment EOS
  / ExpressionStatement
  / IfStatement
  / IterationStatement
  / ContinueLoopStatement
  / ContinueCaseStatement
  / ExitLoopStatement
  / ReturnStatement
  / WithStatement
  / SwitchStatement
  // DebuggerStatement
  //NOTE: below here is new unsure rules
  / ExitStatement
  / PreProcStatement
  / MultiLineComment
  / SelectStatement

EmptyStatement
  = __ LineTerminatorSequence { return { type: "EmptyStatement" }; }


StatementList
  = head:Statement tail:(__ Statement)* { return buildList(head, tail, 1); }

//NOTE: VariableDeclarationStatement
//FIXME: update syntax to use new identifiers, expressions and statements
VariableStatement
  = static_:(StaticToken __)? scope:($(LocalToken / GlobalToken / DimToken) __)? constant:(ConstToken __)? declarations:VariableDeclarationList EOS {
    return {
      scope: extractOptional(scope, 0),
      constant: !!constant,
      static_: !!static_,
      type: "VariableDeclaration",
      declarations: declarations,
      location: location(),
    }
  }
  / scope:($(LocalToken / GlobalToken / DimToken) __)? static_:(StaticToken __)? constant:(ConstToken __)? declarations:VariableDeclarationList EOS {
    return {
      scope: extractOptional(scope, 0),
      constant: !!constant,
      static_: !!static_,
      type: "VariableDeclaration",
      declarations: declarations,
      location: location(),
    }
  }
  / RedimToken __ head:RedimIdentifierExpression tail:(__ "," __ RedimIdentifierExpression)* EOS {
    return {
      type: "RedimExpression",
      declarations: buildList(head, tail, 3),
    };
  }
  / scope:($(LocalToken / GlobalToken / DimToken) __)? constant:(ConstToken __)? EnumToken __ declarations:EnumDeclarationList EOS {
    return {
      scope: extractOptional(scope, 0),
      constant: !!constant,
      static: false,
      type: "VariableDeclaration",
      declarations: declarations,
    }
  }

  RedimIdentifierExpression = VariableIdentifier __ ("[" __ Expression __ "]")+ { //FIXME: implement the expressions array as a nested rule.
    return {
      type: "RedimIdentifierExpression"
    };
  }

ExpressionStatement
  = !FuncToken expression:Expression EOS {
      return {
        type: "ExpressionStatement",
        expression: expression
      };
    }

IfStatement
  = IfToken __ test:Expression __ ThenToken __ EOS
       consequent:(__ StatementList __)?
    __ alternates:ElseIfClauses? __
    __ alternate:ElseClause? __
    EndIfToken EOS {
      alternate = alternate ? [alternate] : [];
      return {
        type: "IfStatement",
        test: test,
        consequent: extractOptional(consequent, 1),
        alternate: [...alternates ?? [], ...alternate]
      }
    }
    / IfToken __ test:Expression __ ThenToken __ consequent:Statement {
      return {
        type: "IfStatement",
        test: test,
        consequent: consequent,
      }
    }

ElseIfClauses
  = head:ElseIfClause tail:(__ ElseIfClause)* { return buildList(head, tail, 1); }

ElseIfClause
  = ElseIfToken __ test:Expression __ ThenToken __ EOS
    consequent:(__ StatementList __)? {
      return {
        type: "ElseIfStatement",
        test: test,
        consequent: extractOptional(consequent, 1),
      }
    }

ElseClause
  = ElseToken __ EOS
    alternate:(__ StatementList __)? {
      return extractOptional(alternate, 1);
    }

IterationStatement
  = DoToken __ EOS
    __ body:StatementList? __
    UntilToken __ test:Expression __ EOS
    { return { type: "DoWhileStatement", body: body ?? [], test: test }; }
  / WhileToken __ test:Expression __ EOS
    __ body:StatementList? __
    WEndToken __ EOS
    { return { type: "WhileStatement", test: test, body: body ?? [] }; }
  / ForToken __ VariableIdentifier __ "=" __ Expression __ ToToken __ Expression __ (StepToken __ Expression)? EOS
      __ body:StatementList? __
    NextToken
  / ForToken __ VariableIdentifier __ InToken __ Expression
      __ body:StatementList? __
    NextToken

EOS
  = _ SingleLineComment? ( LineTerminatorSequence / EOF)
  / __ EOF

EOF
  = !.

WhiteSpace = Whitespace
__ //FIXME: support line continuation
  = WhiteSpace*
//FIXME: implement this
_ = __

//TODO: verify the chars in here!
LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"


//FIXME: validate if this is true for au3
Expression
  = head:AssignmentExpression {
      return head;
    }

ExitStatement
  = ExitToken argument:(__ AssignmentExpression)? EOS {
    return {
      type: "ExitStatement",
      argument: extractOptional(argument, 1),
    }
  }

SwitchStatement
  = SwitchToken __ discriminant:Expression __ EOS
    cases:CaseBlock
  EndSwitchToken EOS
  {
    return {
      type: "SwitchStatement",
      discriminant: discriminant,
      cases: cases
    };
  }

CaseBlock
  = __
    before:(CaseClauses __)?
    default_: DefaultClause __
    after:(CaseClauses __)? {//FIXME: verify that other case clauses can come after the default clase in au3
      return optionalList(extractOptional(before, 0))
        .concat(default_)
        .concat(optionalList(extractOptional(after, 0)));
    }
  / __ clauses:(CaseClauses __)? { //FIXME: verify that "?" CAN be there
    return optionalList(extractOptional(clauses, 0));
  } 


CaseClauses
  = head:CaseClause tail:(__ CaseClause)* { return buildList(head, tail, 1); }

CaseClause
  = CaseToken __ tests: CaseValueList EOS
    consequent: (__ StatementList)?
    {
      return {
        type: "SwitchCase",
        tests: tests,
        consequent: optionalList(extractOptional(consequent, 1))
      };
    }
  / SingleLineComment EOS

DefaultClause
  = CaseToken __ ElseToken __ EOS
    consequent:(__ StatementList)?
    {
      return {
        type: "SwitchCase",
        test: null,
        consequent: optionalList(extractOptional(consequent, 1))
      };
    }

CaseValueList
  = head:SwitchCaseValue tail:(__ "," __ SwitchCaseValue)* {
      return buildList(head, tail, 3);
    }

SwitchCaseValue
  = from:Expression __ ToToken __ to:Expression {
    return {
      type: "SwitchCaseRange",
      from: from,
      to: to,
    }
  }
  / Expression
