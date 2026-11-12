import { expect, expectTypeOf, test } from "vitest";
import { AutoIt3, LocationRange } from "../dist/autoit3";

expectTypeOf<AutoIt3.FunctionDeclaration>().toMatchTypeOf<{
    type: "FunctionDeclaration";
    volatile: boolean;
    id: AutoIt3.Identifier;
    params: never[] | AutoIt3.FormalParameterList;
    body: never[] | AutoIt3.StatementList;
    location: LocationRange;
}>();
