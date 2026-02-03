# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Subsequent SourceElements did not allow leading whitespace, caused by ea122e3ce373cfaf626ec308d714000d36adcad7

## [4.1.0] - 2026-02-02

### Added

- Support for With...EndWith code blocks ( #13 )

### Fixed

- Missing whitespace requirement between ByRef, const and a function parameter ( #47 )
- ByRef function parameters allowed default values ( #44 )

## [4.0.0] - 2025-02-15

### Changed

- Changed package to be used via NPM instead.

## [3.0.4] - 2025-02-13

### Fixed

- `"type": "module"` in package.json give unexpected errors when imported by other projects.

## [3.0.3] - 2025-02-13

### Fixed

- Manual type replacement added for `IncludeStatement` rule, to fix wrong interpreted type for properties `library` and `file`.
- Missing `object` property from TS type object with property `type` equals `MemberExpression` from `CallExpression` rule

## [3.0.2] - 2025-01-22

### Fixed

- Missing location property on `ParenthesizedExpression` AST node.
- Updated peggy-to-ts to fix mismatch between location function return value and Peggy LocationRange type.

## [3.0.1] - 2025-01-22

### Fixed

- Recursion typescript error for circular type reference
- Wrong types was generated for MemberExpression and CallExpression rules.

## [3.0.0] - 2025-01-18

### Changed

- TypeScript types are now auto-generated instead of hand written, to remove the element of human error. (This is a breaking change)

### Fixed

- NotExpression precedence issue causing it to be disallowed on the right-hand side of BinaryExpressions. ( #8 )
- SingleLineComment used EOS instead of LineTerminatorSequence / EOF
- Wrong TypeScript type "Comment" used instead of "SingleLineComment|MultiLineComment"

## [2.0.0] - 2024-09-21

### Added

- More granular typescript types, to better access each node case within the `IterationStatement`

### Changed

- `ForStatement` id property removed from AST node and init property now contains a `VariableDeclarator` node
- `ForInStatement` left property in AST node now contains a `VariableDeclarator` node instead

## [1.2.0] - 2024-03-30

### Added

- `volatile` property for `FunctionDeclaration` AST object
- `dimensions` property for variable declarations on `VariableDeclaration` and `ConstDeclaration`

### Fixed

- Declaring array dimensions was missing on `ConstDeclaration`

## [1.1.7] - 2024-03-09

### Fixed

- Missing `Null` as a possible value for Parameter AST object init property
- EnumDeclaration AST object could have properties `stepoperator` could be null
- EnumDeclaration AST object could have properties `stepval` could be NaN

## [1.1.6] - 2024-02-28

### Fixed

- Fixed problems with expected and allowed keywords for VariableDeclarations ( #33, #34 )

## [1.1.5] - 2024-02-07

### Added

- Created CHANGELOG.md

### Changed

- Single line if statement TS object consequent after parser fix

### Fixed

- Default keyword returning array instead of expected keyword AST element object
- Problems introduced from the initial fix of issue #29

## [1.1.4] - 2024-01-16

### Changed

- Single line IfStatement TS object consequent type changes after parser fix

### Fixed

- SingleLineComment above first case in switch block resulted in array value, instead of expected SingleLineComment element object
- Single line IfStatement consequent requirements was too loose ( #29 )
- RedimIdentifierExpression was not implemented ( #20 )
- Scope string value in VariableDeclarations and EnumDeclarations should be lowercase ( #31 )
- EnumDeclaration TS type was missing `null` as a possible scope value
- `null` and `boolean` literals was returning array instead of expected literal AST element object

## [1.1.3] - 2024-01-09

### Fixed

- Removed version from package.json to avoid release tag and version string mismatch

## [1.1.2] - 2024-01-09

### Fixed

- MultiLineComment too strict ( #18 )
- SwitchStatement did not allow empty statement before first case ( #38 )
- Separator after keyword should be required ( #35 )
- TS MultilineComment was of type string, but actual value was array of strings.

## [1.1.1] - 2023-04-02

### Fixed

- EnumDeclaration type used `VariableDeclaration`, making it hard to locate enums in AST ( #23 )
- EnumDeclaration did not support step declaration ( #22 )
- Include statement file path too strict ( #30 )
- Unexpected EmptyStatement between MultiLineComment and FunctionDeclaration ( #32 )

## [1.1.0] - 2023-02-08

### Added

- Description for the computed property on a MemberExpression

### Fixed

- VariableDeclaration too strict with array declaration ( #19 )
- VariableIdentifier should allow number for first char after the dollar sign ( #28 )
- Issue with location range on include token included the whitespace and/or single line comment
- @SW_SHOWNA failed to parse ( #27 )

## [1.0.3] - 2023-01-19

### Fixed

- Issue in IncludeStatement from commit e07c406

## [1.0.2] - 2023-01-19

### Fixed

- Hex expression did not allow "0x" ( #15 )
- ElseIfClause ast object was missing location information ( #24 )
- ElseClause did not return an AST object ( #25 )
- Missing location property on ElseClause
- PreProcStatement should not allow #include ( #17 )
- IncludeStatement was too strict ( #16 )
- IncludeStatement should allow trailing singleLineComments and LineContinuation
- Exit could not be called with empty parentheses

## [1.0.1] - 2023-01-07

### Fixed

- Missing location information on DefaultKeyword pegjs rule ( #21 )

## [1.0.0] - 2023-01-03

[unreleased]: https://github.com/genius257/autoit3-pegjs/compare/4.1.0...HEAD
[4.0.1]: https://github.com/genius257/autoit3-pegjs/compare/4.0.0...4.1.0
[4.0.0]: https://github.com/genius257/autoit3-pegjs/compare/3.0.4...4.0.0
[3.0.4]: https://github.com/genius257/autoit3-pegjs/compare/3.0.3...3.0.4
[3.0.3]: https://github.com/genius257/autoit3-pegjs/compare/3.0.2...3.0.3
[3.0.2]: https://github.com/genius257/autoit3-pegjs/compare/3.0.1...3.0.2
[3.0.1]: https://github.com/genius257/autoit3-pegjs/compare/3.0.0...3.0.1
[3.0.0]: https://github.com/genius257/autoit3-pegjs/compare/2.0.0...3.0.0
[2.0.0]: https://github.com/genius257/autoit3-pegjs/compare/1.2.0...2.0.0
[1.2.0]: https://github.com/genius257/autoit3-pegjs/compare/1.1.7...1.2.0
[1.1.7]: https://github.com/genius257/autoit3-pegjs/compare/1.1.6...1.1.7
[1.1.6]: https://github.com/genius257/autoit3-pegjs/compare/1.1.5...1.1.6
[1.1.5]: https://github.com/genius257/autoit3-pegjs/compare/1.1.4...1.1.5
[1.1.4]: https://github.com/genius257/autoit3-pegjs/compare/1.1.3...1.1.4
[1.1.4]: https://github.com/genius257/autoit3-pegjs/compare/1.1.3...1.1.4
[1.1.3]: https://github.com/genius257/autoit3-pegjs/compare/1.1.2...1.1.3
[1.1.2]: https://github.com/genius257/autoit3-pegjs/compare/1.1.1...1.1.2
[1.1.1]: https://github.com/genius257/autoit3-pegjs/compare/1.1.0...1.1.1
[1.1.0]: https://github.com/genius257/autoit3-pegjs/compare/1.0.3...1.1.0
[1.0.3]: https://github.com/genius257/autoit3-pegjs/compare/1.0.2...1.0.3
[1.0.2]: https://github.com/genius257/autoit3-pegjs/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/genius257/autoit3-pegjs/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/genius257/autoit3-pegjs/releases/tag/1.0.0
