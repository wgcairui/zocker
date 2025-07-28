import { Generator } from "../generate.js";
import {z} from "zod";
import { faker } from "@faker-js/faker";
import { InstanceofGeneratorDefinition } from "../zocker.js";

const generate_symbol: Generator<z.core.$ZodSymbol> = () => {
	const symbol_key = faker.string.alphanumeric();
	return Symbol.for(symbol_key);
};

export const SymbolGenerator: InstanceofGeneratorDefinition<z.core.$ZodSymbol> = {
	schema: z.core.$ZodSymbol as any,
	generator: generate_symbol,
	match: "instanceof"
};
