import {z} from "zod";
import { generate, Generator } from "../generate.js";
import { pick } from "../utils/random.js";
import { InstanceofGeneratorDefinition } from "../zocker.js";

export type AnyOptions = {
	strategy: "true-any" | "json-compatible" | "fast";
};

const literalSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null()
]);
const jsonSchema: z.core.$ZodType = z.lazy(() =>
	z.union([
		literalSchema,
		z.array(jsonSchema),
		z.record(z.string(), jsonSchema)
	])
);

//It's important to have the schemas outside the generator, so that they have reference equality accross invocations.
//This allows us to not worry about infinite recursion, as the cyclic generation logic will protect us.
const any = z.any();
const potential_schemas = [
	z.undefined(),
	z.null(),
	z.boolean(),
	z.number(),
	z.string(),
	z.bigint(),
	z.date(),
	z.symbol(),
	z.unknown(),
	z.nan(),
	z.record(z.union([z.string(), z.number(), z.symbol()]), any), //`z.object` is just a subset of this - no need for a separate case.
	z.array(any), //Tuples are just a subset of this - no need for a separate case.
	z.map(any, any),
	z.set(any),
	z.promise(any)
].map((schema) => schema.optional());

const generate_any: Generator<z.core.$ZodAny> = (schema, ctx) => {
	if (ctx.any_options.strategy === "fast") {
		return undefined;
	}

	if (ctx.any_options.strategy === "json-compatible") {
		const generated = generate(jsonSchema, ctx);
		return generated;
	}

	const schema_to_use: z.core.$ZodType = pick(potential_schemas);
	const generated = generate(schema_to_use, ctx);
	return generated;
};

const generate_unknown: Generator<z.core.$ZodUnknown> = (schema, ctx) => {
	if (ctx.unknown_options.strategy === "fast") {
		return undefined;
	}

	if (ctx.unknown_options.strategy === "json-compatible") {
		const generated = generate(jsonSchema, ctx);
		return generated;
	}

	const schema_to_use = pick(potential_schemas);
	const generated = generate(schema_to_use, ctx);
	return generated;
};

export const AnyGenerator: InstanceofGeneratorDefinition<z.core.$ZodAny> = {
	schema: z.core.$ZodAny as any,
	generator: generate_any,
	match: "instanceof"
};

export const UnknownGenerator: InstanceofGeneratorDefinition<z.core.$ZodUnknown> = {
	schema: z.core.$ZodUnknown as any,
	generator: generate_unknown,
	match: "instanceof"
};
