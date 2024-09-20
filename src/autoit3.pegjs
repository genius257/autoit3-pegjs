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

  function buildBinaryExpression(head, tail) {
    return tail.reduce(function(result, element) {
      return {
        type: "BinaryExpression",
        operator: element[1],
        left: result,
        right: element[3],
        location: location(),
      };
    }, head);
  }

  function buildLogicalExpression(head, tail) {
    return tail.reduce(function(result, element) {
      return {
        type: "LogicalExpression",
        operator: element[1],
        left: result,
        right: element[3],
        location: location(),
      };
    }, head);
  }
}

Start
    = __ program:Program __ { return program; }

PreProc
  = "#include-once"i {
    return { type: "IncludeOnceStatement", location: location() };
  }
  / IncludeStatement
  / "#" !(CSToken / CEToken / CommentsStartToken / CommentsEndToken / IncludeToken) body:$(!Newline .)+ {
    return { type: "PreProcStatement", body: body, location: location() };
  }

IncludeStatement
  = "#" IncludeToken LiteralWhitespace* file:IncludeFileName {
    return {
      type: "IncludeStatement",
      library: file[0],
      file: file[1],
      location: location(),
    };
  }

IncludeFileName
  = "<" file:$(([a-zA-Z]":")?[^:?"<>]+) ">" {
    return [true, file];
  }
  / '"' file:$(([a-zA-Z]":")?[^:?"<>]+) '"' {
    return [false, file];
  }
  / "'" file:$(([a-zA-Z]":")?[^:?"'<>]+) "'" {
    return [false, file];
  }

LiteralWhitespace = "\u0009" / "\u0020"

Whitespace = LineContinuation LiteralWhitespace* / LiteralWhitespace+

OptionalWhitespace = Whitespace?

LineContinuation = LiteralWhitespace+ '_' LiteralWhitespace* SingleLineComment? Newline

Newline = LineTerminatorSequence

ConstDeclarationList
  = head: ConstDeclaration tail:(__ "," __ @ConstDeclaration)* {
    return [head, ...tail];
  }

EnumDeclarationList
  = head:EnumDeclaration tail:(__ "," __ @EnumDeclaration)* {
      return [head, ...tail];
    }

VariableDeclarationList
  = head:VariableDeclaration tail:(__ "," __ @VariableDeclaration)* {
      return [head, ...tail];
    }

VariableDeclaration
  = id:VariableIdentifier dimensions:(__ "[" __ @Expression? __ "]" )* init:(__ @Initialiser)? {
      return {
        type: "VariableDeclarator",
        id: id,
        dimensions: dimensions,
        init: init,
        location: location(),
      };
    }

EnumDeclaration = id:VariableIdentifier init:(__ '=' __ @AssignmentExpression)? {
  return {
    type: "VariableDeclarator",
    id: id,
    init: init,
    location: location(),
  }
}

ConstDeclaration
  = id:VariableIdentifier dimensions:(__ "[" __ @Expression? __ "]")* __ '=' __ init:(AssignmentExpression/ArrayDeclaration) {
    return {
      type: "VariableDeclarator",
      id: id,
      dimensions: dimensions,
      init: init,
      location: location(),
    }
  }

Initialiser
  = "=" !"=" __ expression:(AssignmentExpression / ArrayDeclaration) { return expression; }

VariableIdentifier = '$' name:$[0-9a-zA-Z_]+
  {return {
    type: "VariableIdentifier",
    name: name,
    location: location(),
  }}

ArrayExpression = ArrayDeclaration

Number = HexIntegerLiteral / Integer

HexDigit
  = [0-9a-f]i

HexIntegerLiteral
    = "0x"i digits:$HexDigit* {
        var value = digits === "" ? 0 : parseInt(digits, 16);
        return { type: "Literal", value: value, location: location(), };
    }

Integer = [0-9]+

//FIXME: !('"' / LineTerminator) instead of [^"]
StringLiteral "string"
  = '"' chars:([^"] / '""')* '"' {
    return { type: "Literal", value: chars.join(""), location: location(), }
  }
  / "'" chars:([^'] / "''")* "'" {
    return { type: "Literal", value: chars.join(""), location: location(), }
  }

Comment = SingleLineComment / MultiLineComment

SingleLineComment = ';' body:([^\u000A\u000D]*) {
  return {type: "SingleLineComment", body: body.join(""), location: location()}
}

MultiLineCommentStartTag = "#" (CSToken / CommentsStartToken)

MultiLineComment
  = MultiLineCommentStartTag beforeBody:$($(!Newline .)*)? body:$((MultiLineComment/!(Newline Whitespace* MultiLineCommentEndTag) .)* Newline Whitespace*) MultiLineCommentEndTag afterBody:$($(!Newline .)*)? {
    return {
      type: "MultiLineComment",
      body: beforeBody+body,
      location: location(),
    };
  }

MultiLineCommentEndTag = '#' (CEToken / CommentsEndToken)

ArrayDeclaration = "[" __ elements:ArrayDeclarationElementList? __ "]" {
  return {
    type: "ArrayDeclaration",
    elements: elements,
    location: location(),
  }
}

ArrayDeclarationElementList
  = head:(Expression / ArrayDeclaration) tail:(__ "," __ @(Expression / ArrayDeclaration))* {
      return [head, ...tail];
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
    / "SW_SHOWDEFAULT"i
    / "SW_SHOWMAXIMIZED"i
    / "SW_SHOWMINIMIZED"i
    / "SW_SHOWMINNOACTIVE"i
    / "SW_SHOWNA"i
    / "SW_SHOWNOACTIVATE"i
    / "SW_SHOWNORMAL"i
    / "SW_SHOW"i
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
      location: location(),
  };
}

NullLiteral = NullToken { return { type: "Literal", value: null, location: location(), }; }

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

WithStatement = WithToken object:(__ @Expression) EOS //FIXME: WIP
body:StatementList?
EndWithToken EOS {
  return {
    type: "WithStatement",
    object: object,
    body: body??[],
    location: location()
  };
}

ReturnStatement = ReturnToken value:(__ @Expression)? EOS {
  return {
    type: "ReturnStatement",
    value: value,
    location: location()
  };
}

ExitLoopStatement = ExitLoopToken level:(__ @Expression)? EOS {
  return {
    type: "ExitLoopStatement",
    level: level,
    location: location()
  };
}

ContinueLoopStatement = ContinueLoopToken level:(__ @Expression)? EOS {
  return {
    type: "ContinueLoopStatement",
    level: level,
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
      cases: cases,
      location: location(),
    };
  }

SelectCaseBlock
  = __
    before:(@SelectCaseClauses __)?
    default_: DefaultClause __
    after:(@SelectCaseClauses __)? {//FIXME: verify that other case clauses can come after the default clase in au3
      return [...before??[], default_, ...after??[]];
    }
  / __ clauses:(@SelectCaseClauses __)? { //FIXME: verify that "?" CAN be there
    return clauses??[];
  }

SelectCaseClauses
  = head:SelectCaseClause tail:(__ @SelectCaseClause)* { return [head, ...tail]; }

SelectCaseClause
  = CaseToken __ tests: AssignmentExpression EOS
    consequent: (__ @StatementList)?
    {
      return {
        type: "SelectCase",
        tests: tests,
        consequent: consequent??[],
        location: location(),
      };
    }

BooleanLiteral 
    = TrueToken  { return { type: "Literal", value: true, location: location(), }; }
    / FalseToken { return { type: "Literal", value: false, location: location(), }; }

Literal
    = literal:NullLiteral !AdditiveOperator { return literal; }
    / literal:BooleanLiteral !AdditiveOperator { return literal; }
    / NumericLiteral
    / StringLiteral

// Tokens

AndToken           = "And"i            !IdentifierPart
ByRefToken         = "ByRef"i          !IdentifierPart
CaseToken          = "Case"i           !IdentifierPart
CEToken            = "ce"i
CommentsStartToken = "comments-start"i
CommentsEndToken   = "comments-end"i
ConstToken         = "Const"i          !IdentifierPart
ContinueCaseToken  = "ContinueCase"i   !IdentifierPart
ContinueLoopToken  = "ContinueLoop"i   !IdentifierPart
CSToken            = "cs"i
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
IncludeToken       = "Include"i        !IdentifierPart
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
      return { type: "Literal", value: parseFloat(text()), location: location(), };
    }
  / "." DecimalDigit+ ExponentPart? {
      return { type: "Literal", value: parseFloat(text()), location: location(), };
    }
  / DecimalIntegerLiteral ExponentPart? {
      return { type: "Literal", value: parseFloat(text()), location: location(), };
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
          computed: element.computed,
          location: location(),
        };
      }, head);
    }
    / Macro


DefaultKeyword = DefaultToken { return { type: "Keyword", value: "Default", location: location() }; }

PrimaryExpression
  = Identifier
  / VariableIdentifier
  / Literal //FIXME: this does not make sense with dot and array access in au3
  // ArrayLiteral
  // ObjectLiteral
  / "(" __ expression:Expression __ ")" { return expression; }
  //FIXME: rules below are not sure if belong
  / Keyword:DefaultKeyword !AdditiveOperator { return Keyword; }

CallExpression
  = head:(
      callee:MemberExpression __ args:Arguments {
        return { type: "CallExpression", callee: callee, arguments: args, location: location() };
      }
    )
    tail:(
        __ args:Arguments {
          return { type: "CallExpression", arguments: args, location: location() };
        }
      / __ "[" __ property:Expression __ "]" {
          return {
            type: "MemberExpression",
            property: property,
            computed: true,
            location: location(),
          };
        }
      / __ "." __ property:IdentifierName {
          return {
            type: "MemberExpression",
            property: property,
            computed: false,
            location: location(),
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
  = "(" __ args:(@ArgumentList __)? ")" {
      return args??[];
    }

ArgumentList
  = head:AssignmentExpression tail:(__ "," __ @AssignmentExpression)* {
      return [head, ...tail];
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
        right: right,
        location: location(),
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
        right: right,
        location: location(),
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
        alternate: alternate,
        location: location(),
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
  = $OrToken

LogicalANDOperator
 = $AndToken

NotExpression
  = (NotToken __) value:EqualityExpression { return {
    type: "NotExpression",
    value: value,
    location: location(),
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
        prefix: true,
        location: location(),
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
        body: body??[]
      };
    }

SourceElements
  = head:SourceElement tail:(__ @SourceElement)* {
      return [head, ...tail];
    }

SourceElement
  = Statement
  / FunctionDeclaration

//NOTE: au3 specific!
PreProcStatement = preproc:PreProc EOS {
  return preproc;
}

FunctionDeclaration
  = volatile:(VolatileToken __)? FuncToken __ id:Identifier __
  "(" __ params:(@FormalParameterList __)? __ ")" EOS
  __ body:StatementList? __ EndFuncToken EOS {
    return {
      type: "FunctionDeclaration",
      volatile: volatile !== null,
      id: id,
      params: params??[],
      body: body??[],
      location: location()
    };
  }

/*FormalParameterList
  = head:VariableIdentifier tail:(__ "," __ VariableIdentifier)* {
      return buildList(head, tail, 3);
    }*/
FormalParameterList
  = head:FormalParameter tail:(__ "," __ @FormalParameter)* {
      return [head, ...tail];
    }

// HACK: start of custom support of function arguements with default value
//FIXME: currently this allows ($a, $b = 123, $c) but no parameters without Initializer allowed after first parameter with Initializer occurred
FormalParameter
  = _const:(@ConstToken __)? ByRefToken __ id:VariableIdentifier __ init:("=" __ @Expression)? {
    return {
      type: "Parameter",
      "const": !!_const,
      byref: true,
      id: id,
      init: init,
      location: location(),
    };
  }
  / byref:(@ByRefToken __)? ConstToken __ id:VariableIdentifier __ init:("=" __ @Expression)? {
    return {
      type: "Parameter",
      byref: !!byref,
      "const": true,
      id: id,
      init: init,
      location: location(),
    };
  }
  / id:VariableIdentifier __ init:("=" __ @Expression)? {
    return {
      type: "Parameter",
      "const": false,
      byref: false,
      id: id,
      init: init,
      location: location(),
    };
  }

//Initializer

// HACK: end of custom support of function arguements with default value

Statement
  = VariableStatement //TODO: should we dilute?
  / EmptyStatement
  / slc:SingleLineComment EOS {return slc;}
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
  / mlc:MultiLineComment EOS {return mlc;}
  / SelectStatement

EmptyStatement
  = __ LineTerminatorSequence { return { type: "EmptyStatement", location: location() }; }


StatementList
  = head:Statement tail:(__ @Statement)* { return [head, ...tail]; }

//NOTE: VariableDeclarationStatement

VariableStatement
  = scope:(@$(LocalToken / GlobalToken / DimToken) __) declarations:VariableDeclarationList EOS {
    return {
      scope: scope?.toLocaleLowerCase()??null,
      constant: false,
      static_: false,
      type: "VariableDeclaration",
      declarations: declarations,
      location: location(),
    }
  }
  / scope:(@$(LocalToken / GlobalToken / DimToken) __)? ConstToken __ declarations:ConstDeclarationList EOS {
    return {
      scope: scope?.toLocaleLowerCase()??null,
      constant: true,
      static_: false,
      type: "VariableDeclaration",
      declarations: declarations,
      location: location(),
    }
  }
  / scope:(@$(LocalToken / GlobalToken) __)? StaticToken __ declarations:VariableDeclarationList EOS {
    return {
      scope: scope?.toLocaleLowerCase()??null,
      constant: false,
      static_: true,
      type: "VariableDeclaration",
      declarations: declarations,
      location: location(),
    }
  }
  / StaticToken __ scope:(@$(LocalToken / GlobalToken) __)? declarations:VariableDeclarationList EOS {
    return {
      scope: scope?.toLocaleLowerCase()??null,
      constant: false,
      static_: true,
      type: "VariableDeclaration",
      declarations: declarations,
      location: location(),
    }
  }
  / declaration:ConstDeclaration EOS {
    return {
      scope: null,
      constant: false,
      static_: false,
      type: "VariableDeclaration",
      declarations: [declaration],
      location: location(),
    }
  }
  / RedimToken __ head:RedimIdentifierExpression tail:(__ "," __ @RedimIdentifierExpression)* EOS {
    return {
      type: "RedimExpression",
      declarations: [head, ...tail],
      location: location(),
    };
  }
  / scope:(@$(LocalToken / GlobalToken / DimToken) __)? constant:(ConstToken __)? EnumToken step:( __ StepToken Whitespace @[+\-*]? @$[0-9]+ )? __ declarations:EnumDeclarationList EOS {
    return {
      scope: scope?.toLocaleLowerCase()??null,
      constant: !!constant,
      static: false,
      type: "EnumDeclaration",
      declarations: declarations,
      stepoperator: step?.[0] ?? '+',
      stepval: parseInt(step?.[1] ?? 1),
      location: location(),
    }
  }

  RedimIdentifierExpression = id:VariableIdentifier __ ("[" __ Expression __ "]")+ { //FIXME: implement the expressions array as a nested rule.
    return {
      type: "RedimIdentifierExpression",
      id: id,
      location: location(),
    };
  }

ExpressionStatement
  = !FuncToken expression:Expression EOS {
      return {
        type: "ExpressionStatement",
        expression: expression,
        location: location(),
      };
    }

IfStatement
  = IfToken __ test:Expression __ ThenToken __ EOS
       consequent:(__ @StatementList __)?
    __ alternates:ElseIfClauses? __
    __ alternate:ElseClause? __
    EndIfToken EOS {
      alternate = alternate ? [alternate] : [];
      return {
        type: "IfStatement",
        test: test,
        consequent: consequent,
        alternate: [...alternates ?? [], ...alternate],
        location: location(),
      }
    }
    / IfToken __ test:Expression __ ThenToken __ !(EmptyStatement/Comment) consequent:(ExpressionStatement/VariableStatement/ContinueLoopStatement/ContinueCaseStatement/ExitLoopStatement/ReturnStatement/ExitStatement) {
      return {
        type: "IfStatement",
        test: test,
        consequent: consequent,
        location: location(),
      }
    }

ElseIfClauses
  = head:ElseIfClause tail:(__ @ElseIfClause)* { return [head, ...tail]; }

ElseIfClause
  = ElseIfToken __ test:Expression __ ThenToken __ EOS
    consequent:(__ @StatementList __)? {
      return {
        type: "ElseIfStatement",
        test: test,
        consequent: consequent,
        location: location(),
      }
    }

ElseClause
  = ElseToken __ EOS
    consequent:(__ @StatementList __)? {
      return {
        type: "ElseStatement",
        consequent: consequent,
        location: location(),
      }
    }

ForLoopVariableDeclaration = id:VariableIdentifier __ "=" __ init:Expression
{
  return {
    type: "VariableDeclarator",
    id: id,
    init: init,
    location: location(),
  }
}

ForInLoopVariableDeclaration = id: VariableIdentifier
{
  return {
    type: "VariableDeclarator",
    id: id,
    init: null,
    location: location(),
  }
}

IterationStatement
  = DoToken __ EOS
    __ body:StatementList? __
    UntilToken __ test:Expression __ EOS
    { return { type: "DoWhileStatement", body: body ?? [], test: test, location: location() }; }
  / WhileToken __ test:Expression __ EOS
    __ body:StatementList? __
    WEndToken __ EOS
    { return { type: "WhileStatement", test: test, body: body ?? [], location: location() }; }
  / ForToken __ init:ForLoopVariableDeclaration __ ToToken __ test:Expression __ update:(StepToken __ @Expression)? EOS
      __ body:StatementList? __
    NextToken __ EOS
    { return { type: "ForStatement", init: init, test: test, update: update, body: body??[], location: location() }; }
  / ForToken __ left:ForInLoopVariableDeclaration __ InToken __ right:Expression
      __ body:StatementList? __
    NextToken __ EOS
    { return { type: "ForInStatement", left: left, right: right, body: body??[], location: location() } }

EOS
  = _ SingleLineComment? ( LineTerminatorSequence / EOF)
  / __ EOF

EOF
  = !.

__ //FIXME: support line continuation
  = Whitespace*
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
  = ExitToken argument:(__ @AssignmentExpression / __ "(" __ ")" { return null; } )? EOS {
    return {
      type: "ExitStatement",
      argument: argument,
      location: location(),
    }
  }

SwitchStatement
  = SwitchToken __ discriminant:Expression __ EOS
    EmptyStatement*
    cases:CaseBlock
  EndSwitchToken EOS
  {
    return {
      type: "SwitchStatement",
      discriminant: discriminant,
      cases: cases,
      location: location(),
    };
  }

CaseBlock
  = __
    before:(@CaseClauses __)?
    default_: DefaultClause __
    after:(@CaseClauses __)? {//FIXME: verify that other case clauses can come after the default clase in au3
      return [...before??[], default_, ...after??[]];
    }
  / __ clauses:(@CaseClauses __)? { //FIXME: verify that "?" CAN be there
    return clauses??[];
  } 


CaseClauses
  = head:CaseClause tail:(__ @CaseClause)* { return [head, ...tail]; }

CaseClause
  = CaseToken __ tests: CaseValueList EOS
    consequent: (__ @StatementList)?
    {
      return {
        type: "SwitchCase",
        tests: tests,
        consequent: consequent??[],
        location: location(),
      };
    }
  / slc:SingleLineComment EOS {return slc;}

DefaultClause
  = CaseToken __ ElseToken __ EOS
    consequent:(__ @StatementList)?
    {
      return {
        type: "SwitchCase",
        tests: null,
        consequent: consequent??[],
        location: location(),
      };
    }

CaseValueList
  = head:SwitchCaseValue tail:(__ "," __ @SwitchCaseValue)* {
      return [head, ...tail];
    }

SwitchCaseValue
  = from:Expression __ ToToken __ to:Expression {
    return {
      type: "SwitchCaseRange",
      from: from,
      to: to,
      location: location(),
    }
  }
  / Expression
