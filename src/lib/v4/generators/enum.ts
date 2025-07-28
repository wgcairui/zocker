import { InstanceofGeneratorDefinition } from "../zocker.js";
import { Generator } from "../generate.js";
import { pick } from "../utils/random.js";
import {z} from "zod";

const generate_enum: Generator<z.core.$ZodEnum<any>> = (schema, ctx) => {
	const values = Object.values(schema._zod.def.entries);
	const value = pick(values);
	return value;
};

export const EnumGenerator: InstanceofGeneratorDefinition<z.core.$ZodEnum<any>> = {
	schema: z.core.$ZodEnum as any,
	generator: generate_enum,
	match: "instanceof"
};
