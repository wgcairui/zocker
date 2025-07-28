import { InstanceofGeneratorDefinition } from "../../zocker.js";
import { Generator, generate } from "../../generate.js";
import {z} from "zod";

import {
	InvalidSchemaException,
	NoGeneratorException
} from "../../exceptions.js";

const generate_intersection: Generator<z.core.$ZodIntersection<any, any>> = (
	schema,
	ctx
) => {
	const schema_1 = schema._zod.def.left;
	const schema_2 = schema._zod.def.right;

	const merged = merge_schema(schema_1, schema_2);
	return generate(merged, ctx);
};

const merge_schema = (
	schema_1: z.core.$ZodType,
	schema_2: z.core.$ZodType
): z.core.$ZodType => {
	if (
		schema_1 instanceof z.core.$ZodNumber &&
		schema_2 instanceof z.core.$ZodNumber
	) {
		const combined = z.number();
		combined._zod.def.checks = [
			...(schema_1._zod.def.checks ?? []),
			...(schema_2._zod.def.checks ?? [])
		];
		return combined;
	}

	if (
		schema_1 instanceof z.core.$ZodString &&
		schema_2 instanceof z.core.$ZodString
	) {
		const combined = z.string();
		combined._zod.def.checks = [
			...(schema_1._zod.def.checks ?? []),
			...(schema_2._zod.def.checks ?? [])
		];
		return combined;
	}

	if (
		schema_1 instanceof z.core.$ZodBoolean &&
		schema_2 instanceof z.core.$ZodBoolean
	) {
		return z.boolean();
	}

	if (
		schema_1 instanceof z.core.$ZodLiteral &&
		schema_2 instanceof z.core.$ZodLiteral
	) {
		const common_values = setIntersection(
			new Set(schema_1._zod.def.values),
			new Set(schema_2._zod.def.values)
		);

		if (common_values.size === 0) {
			throw new InvalidSchemaException(
				"Cannot generate intersection of literal schemas with no common values"
			);
		}

		return z.literal(Array.from(common_values));		
	}

	if (
		schema_1 instanceof z.core.$ZodSymbol &&
		schema_2 instanceof z.core.$ZodType
	) {
		return z.symbol();
	}

	if (
		schema_1 instanceof z.core.$ZodUnion &&
		schema_2 instanceof z.core.$ZodUnion
	) {
		const combined = [];
		for (const option1 of schema_1._zod.def.options) {
			for (const option2 of schema_2._zod.def.options) {
				try {
					combined.push(merge_schema(option1, option2));
				} catch (e) {
					continue;
				}
			}
		}

		if (combined.length == 0)
			throw new NoGeneratorException(
				"Could not generate intersection of unions"
			);
		return z.union(combined);
	}

	if (
		schema_1 instanceof z.core.$ZodEnum &&
		schema_2 instanceof z.core.$ZodEnum
	) {
		// only add entries that are in **both** enums
		const shared = setIntersection(
			new Set(Object.values(schema_1._zod.def.entries)),
			new Set(Object.values(schema_2._zod.def.entries))
		);

		return z.enum(Array.from(shared));
	}

	if (
		schema_1 instanceof z.core.$ZodArray &&	
		schema_2 instanceof z.core.$ZodArray
	) {
		return z.array(
			merge_schema(schema_1._zod.def.element, schema_2._zod.def.element)
		);
	}

	throw new NoGeneratorException(
		"ZodIntersections only have very limited support at the moment."
	);
};

export const IntersectionGenerator: InstanceofGeneratorDefinition<
	z.core.$ZodIntersection<any, any>
> = {
	schema: z.core.$ZodIntersection as any,
	generator: generate_intersection,
	match: "instanceof"
};

function setIntersection(a: Set<any>, b: Set<any>) {
	return new Set([...a].filter((x) => b.has(x)));
}
