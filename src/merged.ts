import { InstanceofGeneratorDefinition } from "./zocker.js";
import {z} from "zod";

import {
	NumberGenerator,
	BigintGenerator,
	BooleanGenerator,
	DateGenerator,
	SymbolGenerator,
	OptionalGenerator,
	NullableGenerator,
	AnyGenerator,
	UnknownGenerator,
	ArrayGenerator,
	TupleGenerator,
	RecordGenerator,
	MapGenerator,
	SetGenerator,
	ObjectGenerator,
	UnionGenerator,
	EnumGenerator,
	DefaultGenerator,
	PromiseGenerator,
	LazyGenerator,
	IntersectionGenerator,
	ReadonlyGenerator,
	StringGenerator,
	CUIDGenerator,
	CUID2Generator,
	IPv4Generator,
	IPv6Generator,
	UUIDGenerator,
	E164Generator,
	EmailGenerator,
	ISODateGenerator,
	ISODateTimeGenerator,
	ISOTimeGenerator,
	ISODurationGenerator,
	NanoIDGenerator,
	ULIDGenerator,
	CIDRv4Generator,
	CIDRv6Generator,
	URLGenerator,
	PipeGenerator,
	EmojiGenerator,
	Base64Generator,
	Base64URLGenerator,
	GUIDGenerator,
	KSUIDGenerator,
	XIDGenerator
} from "./generators/index.js";

export const default_generators: InstanceofGeneratorDefinition<any>[] = [
	XIDGenerator,
	KSUIDGenerator,
	Base64Generator,
	Base64URLGenerator,
	EmojiGenerator,
	URLGenerator,
	CIDRv4Generator,
	CIDRv6Generator,
	ULIDGenerator,
	NanoIDGenerator,
	ISODateGenerator,
	ISODateTimeGenerator,
	ISOTimeGenerator,
	ISODurationGenerator,
	EmailGenerator,
	E164Generator,
	GUIDGenerator,
	UUIDGenerator,
	IPv4Generator,
	IPv6Generator,
	CUID2Generator,
	CUIDGenerator,
	StringGenerator,
	NumberGenerator,
	BigintGenerator,
	BooleanGenerator,
	DateGenerator,
	SymbolGenerator,
	OptionalGenerator,
	NullableGenerator,
	AnyGenerator,
	UnknownGenerator,
	PipeGenerator,
	ArrayGenerator,
	TupleGenerator,
	RecordGenerator,
	MapGenerator,
	SetGenerator,
	ObjectGenerator,
	UnionGenerator,
	EnumGenerator,
	DefaultGenerator,
	PromiseGenerator,
	LazyGenerator,
	ReadonlyGenerator,
	{
		schema: z.core.$ZodVoid,
		generator: () => {},
		match: "instanceof"
	},
	{
		schema: z.core.$ZodUndefined,
		generator: () => undefined,
		match: "instanceof"
	},
	{
		schema: z.core.$ZodNull,	
		generator: () => null,
		match: "instanceof"
	},
	{
		schema: z.core.$ZodNaN,
		generator: () => NaN,
		match: "instanceof"
	},
	{
		schema: z.core.$ZodLiteral,
		generator: (schema: z.core.$ZodLiteral) => schema._zod.def.values[0],
		match: "instanceof"
	},
	{
		schema: z.core.$ZodNever,
		generator: () => void 0,
		match: "instanceof"
	},
	IntersectionGenerator
];
// There are some exceptions that can occur during the generation process.
// Since some of these are recoverable, we have a standard way of handling them.
export class RecursionLimitReachedException extends Error {}
export class NoGeneratorException extends Error {}
export class InvalidSchemaException extends Error {}
/**
 * Calculates the least common multiple (LCM) of two numbers.
 * @param a
 * @param b
 * @returns
 */
export function lcm<N extends bigint | number>(a: N, b: N): N {
	if (a === Number.MIN_VALUE || a == 0) return b as N;
	if (b === Number.MIN_VALUE || b == 0) return a as N;

	if (typeof a === "bigint") return bigintLCM(BigInt(a), BigInt(b)) as N;

	return lcmNonIntegers(a.toString(), b.toString()) as N;
}

/**
 * Calculates the greatest common divisor (GCD) of two numbers using the Euclidean algorithm.
 */
function bigintGCD(a: bigint, b: bigint): bigint {
	while (b !== 0n) {
		[a, b] = [b, a % b];
	}
	return a;
}

/**
 * Calculates the least common multiple (LCM) of two numbers.
 */
function bigintLCM(a: bigint, b: bigint) {
	return (a * b) / bigintGCD(a, b);
}

/**
 * Converts a decimal string to a fraction represented as a tuple of two bigints (numerator, denominator).
 * @param decimalStr Eg "0.75" or "1.5"
 * @returns A tuple where the first element is the numerator and the second element is the denominator.
 *
 * @example "0.75" -> [3n, 4n]
 */
function decimalToFraction(decimalStr: string): [bigint, bigint] {
	// Handle e-notation
	if (decimalStr.includes("e")) {
		const [base, exponent] = decimalStr.split("e");
		if (!base || !exponent)
			throw new Error(`Invalid number string: ${decimalStr}`);

		// get the fractional representation of the base
		const baseFraction = decimalToFraction(base);

		// the part after the 'e' is the exponent.
		// may be negative or positive
		const exponentValue = BigInt(exponent);

		// if the exponent is negative we scale the denominator up
		// if the exponent is positive we scale the numerator up
		if (exponentValue < 0n) {
			baseFraction[1] *= 10n ** -exponentValue; // Scale denominator
		} else {
			baseFraction[0] *= 10n ** exponentValue; // Scale numerator
		}

		return baseFraction;
	}

	// handle integers directly
	if (!decimalStr.includes(".")) return [BigInt(decimalStr), 1n];

	// Handle numbers with decimal points
	const parts = decimalStr.split(".");
	const intPart = parts[0];
	const fracPart = parts[1] ?? "";
	const scale = 10n ** BigInt(fracPart.length);
	const numerator = BigInt(intPart + fracPart);
	const denominator = scale;

	const divisor = bigintGCD(numerator, denominator);
	return [numerator / divisor, denominator / divisor];
}

/**
 *
 * @param aStr
 * @param bStr
 * @returns
 */
function lcmNonIntegers(aStr: string, bStr: string) {
	// Convert to fractions
	const [numA, denA] = decimalToFraction(aStr);
	const [numB, denB] = decimalToFraction(bStr);

	// Find LCM of denominators
	const lcmDen = bigintLCM(denA, denB);

	// Convert both numbers to integer equivalents
	const A = numA * (lcmDen / denA);
	const B = numB * (lcmDen / denB);

	// Find integer LCM
	const lcmInt = bigintLCM(A, B);

	// Divide back to get final result
	const result = Number(lcmInt) / Number(lcmDen);
	return Number(result.toString());
}
/*
    Utility functions for taking random actions.
    All functions are based on faker.js, and are therefore reproducible if the seed is set.
*/

import { faker } from "@faker-js/faker";

/**
 * @deprecated Use `faker.helpers.arrayElement` directly
 */
export function pick<T>(array: readonly T[]): T {
	return faker.helpers.arrayElement(array);
}

/**
 * Randomly pick between two option, with a given probability of picking the first option.
 * @param probability - The probability of choosing option_1 (between 0 and 1)
 */
export function weighted_pick<A, B>(
	option_1: A,
	option_2: B,
	probability: number
): A | B {
	const first = faker.datatype.boolean({ probability });
	return first ? option_1 : option_2;
}

/**
 * @deprecated Use `faker.datatype.boolean({ probability })` directly
 */
export function weighted_random_boolean(true_probability: number): boolean {
	return faker.datatype.boolean({ probability: true_probability });
}
export type SemanticFlag =
	| "unspecified"
	| "key"
	| "fullname"
	| "firstname"
	| "lastname"
	| "street"
	| "city"
	| "country"
	| "paragraph"
	| "sentence"
	| "word"
	| "phoneNumber"
	| "age"
	| "zip"
	| "jobtitle"
	| "color"
	| "color-hex"
	| "age"
	| "year"
	| "month"
	| "day-of-the-month"
	| "hour"
	| "minute"
	| "second"
	| "millisecond"
	| "weekday"
	| "birthday"
	| "gender"
	| "municipality"
	| "unique-id";

const paragraph_triggers = [
	"about",
	"description",
	"paragraph",
	"text",
	"body",
	"content"
];
const sentence_triggers = ["sentence", "line", "headline", "heading"];
const jobtitle_triggers = [
	"job",
	"title",
	"position",
	"role",
	"occupation",
	"profession",
	"career"
];

const delimiters = [",", ";", ":", "|", "/", "\\", "-", "_", " "];

export function get_semantic_flag(str: string): SemanticFlag {
	str = str.toLowerCase().trim();

	for (const delimiter of delimiters) {
		str = str.split(delimiter).join(" ");
	}

	if (str.includes("name")) {
		if (str.includes("first")) return "firstname";
		if (str.includes("last")) return "lastname";
		return "fullname";
	}

	if (str.includes("street")) return "street";
	if (str.includes("city")) return "city";
	if (str.includes("country")) return "country";

	if (paragraph_triggers.some((t) => str.includes(t))) return "paragraph";
	if (sentence_triggers.some((t) => str.includes(t))) return "sentence";
	if (str.includes("word")) return "word";

	if (jobtitle_triggers.some((t) => str.includes(t))) return "jobtitle";

	if (str.includes("phone")) return "phoneNumber";
	if (str.includes("age")) return "age";

	if (str.includes("hex")) return "color-hex";
	if (str.includes("color")) return "color";
	if (str.includes("zip")) return "zip";

	if (str.includes("week") && str.includes("day")) return "weekday";
	if (str.includes("birthday")) return "birthday";
	if (str.includes("year")) return "year";
	if (str.includes("month")) return "month";
	if (str.includes("day")) return "day-of-the-month";
	if (str.includes("hour")) return "hour";
	if (str.includes("minute")) return "minute";
	if (str.includes("second")) return "second";
	if (str.includes("millisecond")) return "millisecond";

	if (str.includes("gender") || str.includes("sex")) return "gender";

	if (
		str.includes("municipality") ||
		str.includes("city") ||
		str.includes("town") ||
		str.includes("place") ||
		str.includes("region") ||
		str.includes("state")
	)
		return "municipality";

	if (str.includes("id")) return "unique-id";
	return "unspecified";
}
import * as z from "zod";
import {
	NoGeneratorException,
	RecursionLimitReachedException
} from "./exceptions.js";
import {
	InstanceofGeneratorDefinition,
	ReferenceGeneratorDefinition
} from "./zocker.js";
import { SemanticFlag } from "./semantics.js";
import { NumberGeneratorOptions } from "./generators/numbers.js";
import { OptionalOptions } from "./generators/optional.js";
import { NullableOptions } from "./generators/nullable.js";
import { DefaultOptions } from "./generators/default.js";
import { MapOptions } from "./generators/map.js";
import { RecordOptions } from "./generators/record.js";
import { SetOptions } from "./generators/set.js";
import { AnyOptions } from "./generators/any.js";
import { ArrayOptions } from "./generators/array.js";
import { ObjectOptions } from "./generators/object.js";

/**
 * Contains all the necessary configuration to generate a value for a given schema.
 */
export type GenerationContext<Z extends z.core.$ZodType> = {
	instanceof_generators: InstanceofGeneratorDefinition<any>[];
	reference_generators: ReferenceGeneratorDefinition<any>[];

	/** A Map that keeps count of how often we've seen a parent schema - Used for cycle detection */
	parent_schemas: Map<z.core.$ZodType, number>;
	recursion_limit: number;

	path: (string | number | symbol)[];
	semantic_context: SemanticFlag;

	seed: number;

	number_options: NumberGeneratorOptions;
	optional_options: OptionalOptions;
	nullable_options: NullableOptions;
	default_options: DefaultOptions;
	map_options: MapOptions;
	record_options: RecordOptions;
	set_options: SetOptions;
	any_options: AnyOptions;
	unknown_options: AnyOptions;
	array_options: ArrayOptions;
	object_options: ObjectOptions;
};

export type Generator<Z extends z.core.$ZodType> = (
	schema: Z,
	ctx: GenerationContext<Z>
) => z.infer<Z>;

/**
 * Generate a random value that matches the given schema.
 * This get's called recursively until schema generation is done.
 *
 * @param schema - The schema to generate a value for.
 * @param ctx - The context and configuration for the generation process.
 * @returns - A pseudo-random value that matches the given schema.
 */
export function generate<Z extends z.core.$ZodType>(
	schema: Z,
	ctx: GenerationContext<Z>
): z.infer<Z> {
	increment_recursion_count(schema, ctx);
	try {
		return generate_value(schema, ctx) as z.infer<Z>;
	} finally {
		decrement_recursion_count(schema, ctx);
	}
}

const generate_value: Generator<z.core.$ZodType> = (schema, generation_context) => {
	//Check if a reference generator is available for this schema
	const reference_generator = generation_context.reference_generators.find(
		(g) => g.schema === schema
	);
	if (reference_generator)
		return reference_generator.generator(schema, generation_context);

	//Check if an instanceof generator is available for this schema
	const instanceof_generator = generation_context.instanceof_generators.find(
		(g) => schema instanceof (g.schema as any)
	);
	if (instanceof_generator)
		return instanceof_generator.generator(schema, generation_context);

	throw new NoGeneratorException(
		`No generator for schema ${schema._zod.def.type} - You can provide a custom generator in the zocker options`
	);
};

function increment_recursion_count<Z extends z.core.$ZodType>(
	schema: Z,
	ctx: GenerationContext<Z>
) {
	const previous_depth = ctx.parent_schemas.get(schema) ?? 0;
	const current_depth = previous_depth + 1;

	if (current_depth >= ctx.recursion_limit) {
		throw new RecursionLimitReachedException("Recursion limit reached");
	}

	ctx.parent_schemas.set(schema, current_depth);
}

function decrement_recursion_count<Z extends z.core.$ZodType>(
	schema: Z,
	ctx: GenerationContext<Z>
) {
	const previous_depth = ctx.parent_schemas.get(schema) ?? 0;
	const current_depth = previous_depth - 1;

	ctx.parent_schemas.set(schema, current_depth);
}
import {z} from "zod";
import { Generator, generate } from "../generate.js";
import { faker } from "@faker-js/faker";
import { RecursionLimitReachedException } from "../exceptions.js";
import { InstanceofGeneratorDefinition } from "../zocker.js";

const generate_union: Generator<z.core.$ZodUnion<z.core.$ZodType[]>> = (schema, ctx) => {
	const schemas = schema._zod.def.options;

	const possible_indexes = new Array(schemas.length).fill(0).map((_, i) => i);
	const indexes = faker.helpers.shuffle(possible_indexes);

	//Generate a value for the first schema that doesn't throw a RecursionLimitReachedException
	for (const index of indexes) {
		try {
			ctx.path.push(index);
			const schema = schemas[index]!;
			return generate(schema, ctx);
		} catch (e) {
			if (e instanceof RecursionLimitReachedException) {
				continue;
			} else {
				throw e;
			}
		} finally {
			ctx.path.pop();
		}
	}

	//If all schemas throw a RecursionLimitReachedException, then this union cannot be generated
	//and we should throw a RecursionLimitReachedException
	throw new RecursionLimitReachedException();
};

export const UnionGenerator: InstanceofGeneratorDefinition<z.core.$ZodUnion<any>> = {
	schema: z.core.$ZodUnion as any,
	generator: generate_union,
	match: "instanceof"
};
import { InstanceofGeneratorDefinition } from "../zocker.js";
import { generate, Generator } from "../generate.js";
import {z} from "zod";

const pipe_generator: Generator<z.core.$ZodPipe> = (schema, ctx) => {
	const first = schema._zod.def.in;
	const second = schema._zod.def.out;

	if (!(second instanceof z.core.$ZodTransform)) {
		// this is likely `z.preprocess`. Generate a value for the second parameter
		return generate(second, ctx);
	}

	const transform_function = second._zod.def.transform;

	const value = generate(first, ctx);
	const transformed = transform_function(value, { issues: [], value });

	return transformed;
};

export const PipeGenerator: InstanceofGeneratorDefinition<z.core.$ZodPipe> = {
	schema: z.core.$ZodPipe as any,
	generator: pipe_generator,
	match: "instanceof"
};
import {z} from "zod";
import { faker } from "@faker-js/faker";
import { generate, Generator } from "../generate.js";
import { RecursionLimitReachedException } from "../exceptions.js";
import { InstanceofGeneratorDefinition } from "../zocker.js";

export type SetOptions = {
	max: number;
	min: number;
};

const generate_set: Generator<z.core.$ZodSet<any>> = (schema, ctx) => {
	const size = faker.number.int({
		min: ctx.set_options.min,
		max: ctx.set_options.max
	});

	const set: z.infer<typeof schema> = new Set();

	try {
		for (let i = 0; i < size; i++) {
			try {
				ctx.path.push(i);
				const value = generate(schema._zod.def.valueType, ctx);
				set.add(value);
			} finally {
				ctx.path.pop();
			}
		}
	} catch (error) {
		if (error instanceof RecursionLimitReachedException) {
			return set;
		}
		throw error;
	}

	return set;
};

export const SetGenerator: InstanceofGeneratorDefinition<z.core.$ZodSet<any>> = {
	schema: z.core.$ZodSet as any,
	generator: generate_set,
	match: "instanceof"
};
import { faker } from "@faker-js/faker";
import { Generator, generate } from "../generate.js";
import {z} from "zod";
import {
	InvalidSchemaException,
	RecursionLimitReachedException
} from "../exceptions.js";
import { InstanceofGeneratorDefinition } from "../zocker.js";
import { getLengthConstraints } from "./string/length-constraints.js";

export type ArrayOptions = {
	/** The minimum number of elements, unless specified otherwise */
	min: number;
	/** The maximum number of elements, unless specified otherwise */
	max: number;
};

const generate_array: Generator<z.core.$ZodArray<any>> = (array_schema, ctx) => {
	const length_constraints = getLengthConstraints(array_schema);

	const min = Math.max(length_constraints.min, ctx.array_options.min);
	const max = Math.min(length_constraints.max, ctx.array_options.max);

	if (min > max)
		throw new InvalidSchemaException("min length is greater than max length");

	const length = length_constraints.exact ?? faker.number.int({ min, max });

	const generated_array = [];

	try {
		for (let i = 0; i < length; i++) {
			let generated_value;
			try {
				ctx.path.push(i);
				generated_value = generate(array_schema._zod.def.element, ctx);
			} finally {
				ctx.path.pop();
			}
			generated_array.push(generated_value);
		}
		return generated_array;
	} catch (error) {
		//If we hit the recursion limit, and there is no minimum length, return an empty array
		if (!(error instanceof RecursionLimitReachedException)) throw error;
		if (min !== 0) throw error;
		if (length_constraints.exact !== null && length_constraints.exact !== 0)
			throw error;
		return [];
	}
};

export const ArrayGenerator: InstanceofGeneratorDefinition<z.core.$ZodArray<any>> = {
	schema: z.core.$ZodArray as any,
	generator: generate_array,
	match: "instanceof"
};
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
import { InstanceofGeneratorDefinition } from "../zocker.js";
import { Generator, generate } from "../generate.js";
import {z} from "zod";

const generate_lazy: Generator<z.core.$ZodLazy<any>> = (
	schema,
	generation_context
) => {
	const getter = schema._zod.def.getter();
	return generate(getter, generation_context);
};

export const LazyGenerator: InstanceofGeneratorDefinition<z.core.$ZodLazy<any>> = {
	schema: z.core.$ZodLazy as any,
	generator: generate_lazy,
	match: "instanceof"
};
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
import { faker } from "@faker-js/faker";
import { InvalidSchemaException } from "../exceptions.js";
import { Generator } from "../generate.js";
import { InstanceofGeneratorDefinition } from "../zocker.js";
import {z} from "zod";

// The minimum & maximum date
// according to https://262.ecma-international.org/5.1/#sec-15.9.1.1
const MIN_DATE = new Date(-8640000000000000);
const MAX_DATE = new Date(8640000000000000);

const generate_date: Generator<z.core.$ZodDate> = (date_schema, ctx) => {
	const min_checks =
		date_schema._zod.def.checks?.filter(
			(c) => c instanceof z.core.$ZodCheckGreaterThan
		) ?? [];
	const max_checks =
		date_schema._zod.def.checks?.filter(
			(c) => c instanceof z.core.$ZodCheckLessThan
		) ?? [];

	const min = min_checks.reduce((acc, check) => {
		const value = check._zod.def.value as Date;
		return value > acc ? value : acc;
	}, MIN_DATE);

	const max = max_checks.reduce((acc, check) => {
		const value = check._zod.def.value as Date;
		return value < acc ? value : acc;
	}, MAX_DATE);

	if (min && max && max < min)
		throw new InvalidSchemaException("max date is less than min date");

	// if min & max are not explicitly set, choose a recent date
	if (min === MIN_DATE && max === MAX_DATE) {
		return faker.date.recent({ days: 100 });
	}

	// If only the min date is set, choose a future date
	if (min !== MIN_DATE && max === MAX_DATE) {
		return faker.date.future({ refDate: min });
	}

	if (min === MIN_DATE && max !== MAX_DATE) {
		return faker.date.past({ refDate: max });
	}

	// if both min & max are set, choose a random date between them
	return faker.date.between({
		from: min,
		to: max ?? Date.now() + 10000000
	});
};

export const DateGenerator: InstanceofGeneratorDefinition<z.core.$ZodDate> = {
	schema: z.core.$ZodDate as any,
	generator: generate_date,
	match: "instanceof"
};
import { faker } from "@faker-js/faker";
import { GenerationContext, Generator, generate } from "../generate.js";
import {z} from "zod";
import { RecursionLimitReachedException } from "../exceptions.js";
import { InstanceofGeneratorDefinition } from "../zocker.js";

export type RecordOptions = {
	max: number;
	min: number;
};

const generate_record: Generator<z.core.$ZodRecord> = (schema, ctx) => {
	type Key = z.infer<(typeof schema)["_zod"]["def"]["keyType"]>;
	type Value = z.infer<(typeof schema)["_zod"]["def"]["valueType"]>;

	const record = {} as any as Record<Key, Value>;

	try {
		const keys = generateKeys<typeof schema>(schema, ctx) as unknown as Key[];

		for (const key of keys) {
			let value: Value;
			let prev_semantic_context = ctx.semantic_context;

			try {
				ctx.path.push(key);
				ctx.semantic_context = "key";

				value = generate(schema._zod.def.valueType, ctx) as Value;
			} finally {
				ctx.path.pop();
				ctx.semantic_context = prev_semantic_context;
			}
			record[key] = value;
		}
	} catch (error) {
		if (error instanceof RecursionLimitReachedException) return record;
		throw error;
	}

	return record;
};

/**
 * Geneartes keys for a record
 * @param schema
 * @param ctx
 */
function generateKeys<Z extends z.core.$ZodRecord>(
	schema: Z,
	ctx: GenerationContext<z.core.$ZodRecord>
): z.infer<Z>[] {
	const keySchema = schema._zod.def.keyType;

	// Enums & other schemas with a list of values must always return ALL
	// their values
	if (keySchema._zod.values) {
		return [...keySchema._zod.values] as z.infer<Z>[];
	}

	// otherwise, pick a random number of keys
	const numKeys = faker.number.int({
		min: ctx.record_options.min,
		max: ctx.record_options.max
	});

	const keys: z.infer<Z>[] = [];
	while (keys.length < numKeys) {
		const key = generate(schema._zod.def.keyType, ctx) as unknown as z.infer<Z>;
		if (key != undefined) keys.push(key);
	}

	return keys;
}

export const RecordGenerator: InstanceofGeneratorDefinition<z.core.$ZodRecord> = {
	schema: z.core.$ZodRecord as any,
	generator: generate_record,
	match: "instanceof"
};
import { Generator, generate } from "../generate.js";
import {z} from "zod";
import { weighted_random_boolean } from "../utils/random.js";
import { InstanceofGeneratorDefinition } from "../zocker.js";

export type DefaultOptions = {
	default_chance: number;
};

const generator: Generator<z.core.$ZodDefault<any>> = (schema, ctx) => {
	const should_use_default = weighted_random_boolean(
		ctx.default_options.default_chance
	);
	const default_value = schema._zod.def.defaultValue;
	return should_use_default
		? default_value
		: generate(schema._zod.def.innerType, ctx);
};

export const DefaultGenerator: InstanceofGeneratorDefinition<
	z.core.$ZodDefault<any>
> = {
	schema: z.core.$ZodDefault as any,
	generator: generator,
	match: "instanceof"
};
import { faker } from "@faker-js/faker";
import { Generator, generate } from "../generate.js";
import { RecursionLimitReachedException } from "../exceptions.js";
import { InstanceofGeneratorDefinition } from "../zocker.js";
import {z} from "zod";

export type MapOptions = {
	max: number;
	min: number;
};

const generate_map: Generator<z.core.$ZodMap> = (schema, ctx) => {
	const size = faker.number.int({
		min: ctx.map_options.min,
		max: ctx.map_options.max
	});

	type Key = z.infer<(typeof schema)["_zod"]["def"]["keyType"]>;
	type Value = z.infer<(typeof schema)["_zod"]["def"]["valueType"]>;

	const map = new Map<Key, Value>();

	try {
		const keys: Key[] = [];
		for (let i = 0; i < size; i++) {
			const key = generate(schema._zod.def.keyType, ctx);
			keys.push(key);
		}

		for (const key of keys) {
			let prev_semantic_context = ctx.semantic_context;
			try {
				ctx.path.push(key as string | number | symbol);
				ctx.semantic_context = "key";

				const value = generate(schema._zod.def.valueType, ctx);
				map.set(key, value);
			} finally {
				ctx.path.pop();
				ctx.semantic_context = prev_semantic_context;
			}
		}
	} catch (error) {
		if (error instanceof RecursionLimitReachedException) {
			return map;
		}
		throw error;
	}

	return map;
};

export const MapGenerator: InstanceofGeneratorDefinition<z.core.$ZodMap> = {
	schema: z.core.$ZodMap as any,
	generator: generate_map,
	match: "instanceof"
};
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
import { faker } from "@faker-js/faker";
import { Generator } from "../generate.js";
import {z} from "zod";
import { InstanceofGeneratorDefinition } from "../zocker.js";

const generate_boolean: Generator<z.core.$ZodBoolean> = () => {
	return faker.datatype.boolean();
};

export const BooleanGenerator: InstanceofGeneratorDefinition<z.core.$ZodBoolean> = {
	schema: z.core.$ZodBoolean as any,
	generator: generate_boolean,
	match: "instanceof"
};
import {z} from "zod";
import { faker } from "@faker-js/faker";
import { InstanceofGeneratorDefinition } from "../zocker.js";
import { Generator } from "../generate.js";
import { lcm } from "../utils/lcm.js";
import { InvalidSchemaException } from "../exceptions.js";
import { SemanticFlag } from "../semantics.js";

export type NumberGeneratorOptions = {
	extreme_value_chance: number;
};

/**
 * Represents a minimum/maximum boundary for a number.
 * Format: `[number, is_inclusive]`
 *
 * Example: `[10, true]`
 */
type Boundary = [number, boolean];

const generate_number: Generator<z.core.$ZodNumber> = (number_schema, ctx) => {
	try {
		//Generate semantically meaningful number
		let proposed_number = NaN;

		const semantic_generators: {
			[flag in SemanticFlag]?: () => number;
		} = {
			age: () => faker.number.int({ min: 0, max: 120 }),
			year: () => faker.number.int({ min: 1200, max: 3000 }),
			month: () => faker.number.int({ min: 1, max: 12 }),
			"day-of-the-month": () => faker.number.int({ min: 1, max: 31 }),
			hour: () => faker.number.int({ min: 0, max: 23 }),
			minute: () => faker.number.int({ min: 0, max: 59 }),
			second: () => faker.number.int({ min: 0, max: 59 }),
			millisecond: () => faker.number.int({ min: 0, max: 999 }),
			weekday: () => faker.number.int({ min: 0, max: 6 })
		};

		const generator = semantic_generators[ctx.semantic_context];
		if (!generator)
			throw new Error(
				"No generator found for semantic context - Falling back to random number"
			);

		proposed_number = generator();

		const result = number_schema["~standard"].validate(proposed_number);
		if ("then" in result) throw new Error();
		if (result.issues) throw new Error();
		return result.value;
	} catch (e) {}

	let is_extreme_value = faker.datatype.boolean({
		probability: ctx.number_options.extreme_value_chance
	});

	const formatChecks: z.core.$ZodCheckNumberFormat[] =
		number_schema._zod.def.checks?.filter(
			(c) => c instanceof z.core.$ZodCheckNumberFormat
		) ?? [];

	let is_int = formatChecks.reduce(
		(acc, check) =>
			acc ||
			check._zod.def.format === "int32" ||
			check._zod.def.format === "safeint" ||
			check._zod.def.format === "uint32",
		false
	);

	const is_finite = true; // get_number_checks(number_schema, "finite").length !== 0;

	const min_checks =
		number_schema._zod.def.checks?.filter(
			(c) => c instanceof z.core.$ZodCheckGreaterThan
		) ?? [];
	const max_checks =
		number_schema._zod.def.checks?.filter(
			(c) => c instanceof z.core.$ZodCheckLessThan
		) ?? [];

	const min_boundary: Boundary = min_checks.reduce<Boundary>(
		(prev, curr) => {
			const proposedBoundary: Boundary = [
				curr._zod.def.value as number,
				curr._zod.def.inclusive
			];
			return proposedBoundary[0] > prev[0] ? proposedBoundary : prev;
		},
		[Number.MIN_SAFE_INTEGER / 2, true]
	);

	const max_boundary: Boundary = max_checks.reduce<Boundary>(
		(prev, curr) => {
			const proposedBoundary: Boundary = [
				curr._zod.def.value as number,
				curr._zod.def.inclusive
			];
			return proposedBoundary[0] < prev[0] ? proposedBoundary : prev;
		},
		[Number.MAX_SAFE_INTEGER / 2, true]
	);

	let inclusive_min = min_boundary[1];
	let inclusive_max = max_boundary[1];

	let min = min_boundary[0];
	let max = max_boundary[0];

	if (!inclusive_min) {
		const float_step = float_step_size(min);
		min += is_int ? 1 : float_step;
	}

	if (!inclusive_max) {
		const float_step = float_step_size(max);
		max -= is_int ? 1 : float_step;
	}

	if (max < min) {
		throw new InvalidSchemaException(
			"max must be greater than min if specified"
		);
	}

	let value: number;
	if (is_int) {
		value = faker.number.int({ min, max });
	} else {
		if (is_extreme_value) {
			const use_lower_extreme = faker.datatype.boolean({ probability: 0.5 });
			if (use_lower_extreme) value = is_finite ? -Infinity : min;
			else value = is_finite ? Infinity : max;
		}

		value = faker.number.float({ min, max });
	}

	if (value === undefined)
		throw new Error(
			"Failed to generate Number. This is a bug in the built-in generator"
		);

	const multipleof_checks =
		number_schema._zod.def.checks?.filter(
			(c) => c instanceof z.core.$ZodCheckMultipleOf
		) ?? [];

	const multipleof = multipleof_checks.reduce((acc, check) => {
		const multipleOf = check._zod.def.value as number;
		return lcm(acc, multipleOf);
	}, Number(multipleof_checks[0]?._zod.def.value ?? Number.MIN_VALUE));

	if (multipleof !== Number.MIN_VALUE) {
		value = is_int
			? faker.number.int({
					min,
					max,
					multipleOf: multipleof !== Number.MIN_VALUE ? multipleof : undefined
			  })
			: faker.number.float({
					min,
					max,
					multipleOf: multipleof !== Number.MIN_VALUE ? multipleof : undefined
			  });

		// Due to floating point precision issues the generated number might not symbolically be a multiple of the given value.
		// Eg: 2.30000000000000004 is not a multiple of 0.1, and zod won't accept it.
		// We have to check that the generated value is actually a multiple of the given value.
		// otherwise, try again.
		const result = z.number().multipleOf(multipleof).safeParse(value);
		if (!result.success) return generate_number(number_schema, ctx);
	}

	return value;
};

//Calculate the step size for modifying a float value
function float_step_size(n: number) {
	return Math.max(
		Number.MIN_VALUE,
		2 ** Math.floor(Math.log2(n)) * Number.EPSILON
	);
}

export const NumberGenerator: InstanceofGeneratorDefinition<z.core.$ZodNumber> = {
	schema: z.core.$ZodNumber as any,
	generator: generate_number,
	match: "instanceof"
};
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
import {z} from "zod";
import { faker } from "@faker-js/faker";
import { Generator } from "../generate.js";
import { InstanceofGeneratorDefinition } from "../zocker.js";
import { InvalidSchemaException } from "../exceptions.js";

const generate_bigint: Generator<z.core.$ZodBigInt> = (bigint_schema, ctx) => {
	const multiple_of_checks =
		bigint_schema._zod.def.checks?.filter(
			(c) => c instanceof z.core.$ZodCheckMultipleOf
		) ?? [];

	const min_checks =
		bigint_schema._zod.def.checks?.filter(
			(c) => c instanceof z.core.$ZodCheckGreaterThan
		) ?? [];
	const max_checks =
		bigint_schema._zod.def.checks?.filter(
			(c) => c instanceof z.core.$ZodCheckLessThan
		) ?? [];

	const min = min_checks.reduce((acc, check) => {
		const min = check._zod.def.value as bigint;
		return min > acc ? min : acc;
	}, BigInt(Number.MIN_SAFE_INTEGER));

	const max = max_checks.reduce((acc, check) => {
		const max = check._zod.def.value as bigint;
		return max < acc ? max : acc;
	}, BigInt(Number.MAX_SAFE_INTEGER));

	const multipleof = multiple_of_checks.reduce((acc, check) => {
		const multipleOf = check._zod.def.value as bigint;
		return lcm(acc, multipleOf);
	}, 1n);

	let value = faker.number.bigInt({ min, max });
	const next_larger_multiple = value + (multipleof - (value % multipleof));
	const next_smaller_multiple = value - (value % multipleof);

	if (next_larger_multiple <= max) value = next_larger_multiple;
	else if (next_smaller_multiple >= min) value = next_smaller_multiple;
	else
		throw new InvalidSchemaException(
			"Cannot generate a valid BigInt that satisfies the constraints"
		);

	return value;
};

function lcm(a: bigint, b: bigint) {
	return (a * b) / gcd(a, b);
}

function gcd(a: bigint, b: bigint): bigint {
	if (b === 0n) return a;
	return gcd(b, a % b);
}

export const BigintGenerator: InstanceofGeneratorDefinition<z.core.$ZodBigInt> = {
	schema: z.core.$ZodBigInt as any,
	generator: generate_bigint,
	match: "instanceof"
};
import { get_semantic_flag } from "../semantics.js";
import { GenerationContext, generate } from "../generate.js";
import { InstanceofGeneratorDefinition } from "../zocker.js";
import {z} from "zod";

export type ObjectOptions = {
	/** If extra keys should be generated on schemas that allow it. Defaults to true */
	generate_extra_keys: boolean;
};

const generate_object = <T extends z.core.$ZodShape>(
	object_schema: z.core.$ZodObject<T>,
	ctx: GenerationContext<z.core.$ZodObject<T>>
): z.infer<z.core.$ZodObject<T>> => {
	type Shape = z.infer<typeof object_schema>;
	type Value = Shape[keyof Shape];
	type Key = string | number | symbol;

	const mock_entries = [] as [Key, Value][];

	Object.entries(object_schema._zod.def.shape).forEach((entry) => {
		const key = entry[0] as Key;
		const property_schema = entry[1] as Value;

		const prev_semantic_context = ctx.semantic_context;
		const semantic_flag = get_semantic_flag(String(key));

		try {
			ctx.path.push(key);
			ctx.semantic_context = semantic_flag;

			//@ts-ignore
			const generated_value: Value = generate(property_schema, ctx);
			mock_entries.push([key, generated_value]);
		} finally {
			ctx.path.pop();
			ctx.semantic_context = prev_semantic_context;
		}
	});

	return Object.fromEntries(mock_entries) as Shape;
};

export const ObjectGenerator: InstanceofGeneratorDefinition<z.core.$ZodObject<any>> =
	{
		schema: z.core.$ZodObject as any,
		generator: generate_object,
		match: "instanceof"
	};
import {z} from "zod";
import { Generator } from "../../generate.js";
import { InstanceofGeneratorDefinition } from "../../zocker.js";
import { faker } from "@faker-js/faker";
import { getLengthConstraints } from "./length-constraints.js";
import { getContentConstraints } from "./content-constraints.js";

// const ULID_REGEX =  /^[0-9A-HJKMNP-TV-Z]{26}$/;
const ULID_LENGTH = 26; // All valid ULIDs are 26 characters long
const ULID_CHARS = [..."0123456789ABCDEFGHJKMNPQRSTVWXYZ"]; // The characters allowed in an ULID

const ulid_generator: Generator<z.core.$ZodULID> = (schema, ctx) => {
	const length_constraints = getLengthConstraints(schema);
	const content_constraints = getContentConstraints(schema);

	const min_length_too_long = length_constraints.min > ULID_LENGTH;
	const max_length_too_short = length_constraints.max < ULID_LENGTH;
	const exact_length_wrong =
		length_constraints.exact != null && length_constraints.exact != ULID_LENGTH;
	const starts_with_too_long =
		content_constraints.starts_with.length > ULID_LENGTH;
	const ends_with_too_long = content_constraints.ends_with.length > ULID_LENGTH;
	const includes_too_long = content_constraints.includes.some(
		(i) => i.length > ULID_LENGTH
	);

	if (
		min_length_too_long ||
		max_length_too_short ||
		exact_length_wrong ||
		starts_with_too_long ||
		ends_with_too_long ||
		includes_too_long
	) {
		throw new Error(
			"Invalid length constraints for ULID. All valid ULIDs are 26 characters long"
		);
	}

	let ulid =
		content_constraints.starts_with + content_constraints.includes.join("");
	const generated_length =
		ULID_LENGTH - ulid.length - content_constraints.ends_with.length;

	for (let i = 0; i < generated_length; i++) {
		ulid += faker.helpers.arrayElement(ULID_CHARS);
	}

	ulid += content_constraints.ends_with;

	// TODO: Support overlapping include, starts_with and ends_with constraints

	return ulid;
};

export const ULIDGenerator: InstanceofGeneratorDefinition<z.core.$ZodULID> = {
	match: "instanceof",
	schema: z.core.$ZodULID as any,
	generator: ulid_generator
};
import {z} from "zod";
import { Generator } from "../../generate.js";
import { InstanceofGeneratorDefinition } from "../../zocker.js";
import { faker } from "@faker-js/faker";
import Randexp from "randexp";

const uuid_generator: Generator<z.core.$ZodUUID> = (schema, ctx) => {
	const version = Number.parseInt(schema._zod.def.version?.slice(1) ?? "4");
	if (version == 4 || !version) return faker.string.uuid(); // faker always returns v4

	const pattern = schema._zod.def.pattern ?? z.regexes.uuid(version);

	const randexp = new Randexp(pattern);
	randexp.randInt = (min: number, max: number) =>
		faker.number.int({ min, max });
	return randexp.gen();
};

export const UUIDGenerator: InstanceofGeneratorDefinition<z.core.$ZodUUID> = {
	match: "instanceof",
	schema: z.core.$ZodUUID as any,
	generator: uuid_generator
};

const guid_generator: Generator<z.core.$ZodGUID> = (schema, ctx) => {
	const pattern = schema._zod.def.pattern ?? z.regexes.guid;

	const randexp = new Randexp(pattern);
	randexp.randInt = (min: number, max: number) =>
		faker.number.int({ min, max });
	return randexp.gen();
};

export const GUIDGenerator: InstanceofGeneratorDefinition<z.core.$ZodGUID> = {
	match: "instanceof",
	schema: z.core.$ZodGUID as any,
	generator: guid_generator
};
import {z} from "zod";	
import { Generator } from "../../generate.js";
import { InstanceofGeneratorDefinition } from "../../zocker.js";
import { faker } from "@faker-js/faker";
import Randexp from "randexp";

const iso_datetime_generator: Generator<z.core.$ZodISODateTime> = (schema, ctx) => {
	const offset = schema._zod.def.offset === true;

	const defined_precision = schema._zod.def.precision;
	let precision =
		defined_precision != null
			? defined_precision
			: faker.number.int({ min: 0, max: 6 });
	let datetime = faker.date.recent({ days: 100 }).toISOString();

	// remove the precision (if present).
	const PRECISION_REGEX = /(\.\d+)?Z/;
	datetime = datetime.replace(PRECISION_REGEX, "Z");

	if (precision > 0) {
		const number = faker.number.int({
			min: 0,
			max: Math.pow(10, precision) - 1
		});
		const replacement = `.${number.toString().padStart(precision, "0")}Z`;
		datetime = datetime.replace("Z", replacement);
	}

	if (offset) {
		const hours_number = faker.number.int({ min: 0, max: 23 });
		const minutes_number = faker.number.int({ min: 0, max: 59 });

		const hours = hours_number.toString().padStart(2, "0");
		const minutes = minutes_number.toString().padStart(2, "0");

		const sign = faker.datatype.boolean({ probability: 0.5 }) ? "+" : "-";
		datetime = datetime.replace("Z", `${sign}${hours}:${minutes}`);
	}

	return datetime;
};

export const ISODateTimeGenerator: InstanceofGeneratorDefinition<z.core.$ZodISODateTime> =
	{
		match: "instanceof",
		schema: z.core.$ZodISODateTime as any,
		generator: iso_datetime_generator
	};

const iso_date_generator: Generator<z.core.$ZodISODate> = (schema, ctx) => {
	const date = faker.date.recent({ days: 100 }).toISOString().split("T")[0];
	if (!date)
		throw new Error(
			"INTERNAL ERROR - ISODateGenerator - `date` is undefined - Please open an issue."
		);
	return date;
};

export const ISODateGenerator: InstanceofGeneratorDefinition<z.core.$ZodISODate> = {
	match: "instanceof",
	schema: z.core.$ZodISODate as any,
	generator: iso_date_generator
};

const iso_time_generator: Generator<z.core.$ZodISOTime> = (schema, ctx) => {
	const pattern = schema._zod.def.pattern!;

	const randexp = new Randexp(pattern);
	randexp.randInt = (min: number, max: number) =>
		faker.number.int({ min, max });
	const time = randexp.gen();

	return time;
};

export const ISOTimeGenerator: InstanceofGeneratorDefinition<z.core.$ZodISOTime> = {
	match: "instanceof",
	schema: z.core.$ZodISOTime as any,
	generator: iso_time_generator
};

const iso_duration_generator: Generator<z.core.$ZodISODuration> = (schema, ctx) => {
	// We don't support regexes with positive lookaheads, so we need to
	// manually generate a valid ISO time.

	// Format :P3Y6M4DT12H30M5S

	const parts = [
		faker.number.int({ min: 0, max: 100 }),
		faker.number.int({ min: 0, max: 11 }),
		faker.number.int({ min: 0, max: 31 }),
		faker.number.int({ min: 0, max: 23 }),
		faker.number.int({ min: 0, max: 59 }),
		faker.number.int({ min: 0, max: 59 })
	];

	// TODO: Support other Duration Formats
	let result = `P${parts[0]}Y${parts[1]}M${parts[2]}DT${parts[3]}H${parts[4]}M${parts[5]}S`;
	return result;
};

export const ISODurationGenerator: InstanceofGeneratorDefinition<z.core.$ZodISODuration> =
	{
		match: "instanceof",
		schema: z.core.$ZodISODuration as any,
		generator: iso_duration_generator
	};
import {z} from "zod";
import { Generator } from "../../generate.js";
import { InstanceofGeneratorDefinition } from "../../zocker.js";
import { faker } from "@faker-js/faker";
import Randexp from "randexp";
import { getLengthConstraints } from "./length-constraints.js";

// const XID_REGEX = /^[0-9a-vA-V]{20}$/;
const XID_LENGTH = 20;

const xid_generator: Generator<z.core.$ZodXID> = (schema, ctx) => {
	const pattern = schema._zod.def.pattern ?? z.regexes.xid;

	const length_constraints = getLengthConstraints(schema);
	const min_length_too_long = length_constraints.min > XID_LENGTH;
	const max_length_too_short = length_constraints.max < XID_LENGTH;
	const exact_length_too_long =
		length_constraints.exact != null && length_constraints.exact > XID_LENGTH;
	const exact_length_too_short =
		length_constraints.exact != null && length_constraints.exact < XID_LENGTH;

	if (
		min_length_too_long ||
		max_length_too_short ||
		exact_length_too_long ||
		exact_length_too_short
	) {
		throw new Error(`XID must be exactly ${XID_LENGTH} characters long`);
	}

	const randexp = new Randexp(pattern);
	randexp.randInt = (min: number, max: number) =>
		faker.number.int({ min, max });
	return randexp.gen();
};

export const XIDGenerator: InstanceofGeneratorDefinition<z.core.$ZodXID> = {
	match: "instanceof",
	schema: z.core.$ZodXID as any,
	generator: xid_generator
};
import {z} from "zod";
import { InstanceofGeneratorDefinition } from "../../zocker.js";
import { GenerationContext, Generator } from "../../generate.js";
import { faker } from "@faker-js/faker";
import { NoGeneratorException } from "../../exceptions.js";
import {
	type ContentConstraints,
	getContentConstraints
} from "./content-constraints.js";
import {
	type LengthConstraints,
	getLengthConstraints
} from "./length-constraints.js";
import Randexp from "randexp";
import { pick } from "../../utils/random.js";
import { SemanticFlag } from "../../semantics.js";
import z4 from "zod/v4";
import { legacyFormatString } from "./legacy.js";

const generate_string: Generator<z.core.$ZodString> = (string_schema, ctx) => {
	const legacy = legacyFormatString(string_schema, ctx);
	if (legacy !== null) return legacy;

	const lengthConstraints = getLengthConstraints(string_schema);
	const contentConstraints = getContentConstraints(string_schema);
	const regexConstraints = getRegexConstraints(string_schema);

	if (regexConstraints.length > 0) {
		if (regexConstraints.length > 1)
			throw new NoGeneratorException(
				"Zocker's included regex generator currently does support multiple regex checks on the same string. Provide a custom generator instead."
			);

		if (lengthConstraints.exact !== null)
			throw new NoGeneratorException(
				"Zocker's included regex generator currently does not work together with length constraints (minLength, maxLength, length). Provide a custom generator instead."
			);

		if (
			contentConstraints.starts_with != "" ||
			contentConstraints.ends_with != "" ||
			contentConstraints.includes.length > 0
		)
			throw new NoGeneratorException(
				"Zocker's included regex generator currently does not work together with startWith, endsWith or includes constraints. Provide a custom generator instead."
			);

		const regex = regexConstraints[0]!;

		const randexp = new Randexp(regex);
		randexp.randInt = (min: number, max: number) =>
			faker.number.int({ min, max });
		return randexp.gen();
	}

	// If there is no other format, try generating a human readable string
	// If this fails the constraints, generate a random stirng that passes

	try {
		const human_readable_string = generateStringWithoutFormat(
			ctx,
			lengthConstraints,
			contentConstraints
		);
		if (
			stringMatchesConstraints(
				human_readable_string,
				lengthConstraints,
				contentConstraints
			)
		) {
			return human_readable_string;
		}
	} catch (e) {
		// Human Readable string generation failed. Falling back to random string
	}

	// update the min-length
	lengthConstraints.min = Math.max(
		lengthConstraints.min,
		contentConstraints.starts_with.length,
		contentConstraints.ends_with.length,
		...contentConstraints.includes.map((s) => s.length)
	);

	// The string length to generate
	const length =
		lengthConstraints.exact ??
		faker.number.int({
			min: lengthConstraints.min,
			max:
				lengthConstraints.max == Infinity
					? lengthConstraints.min + 50_000
					: lengthConstraints.max
		});

	// How many characters need to be generated.
	// This is fewer than the length if there are startWith/endsWith constraints
	const generated_length =
		length -
		contentConstraints.starts_with.length -
		contentConstraints.ends_with.length -
		contentConstraints.includes.reduce((a, b) => a + b.length, 0);

	return (
		contentConstraints.starts_with +
		faker.string.sample(generated_length) +
		contentConstraints.includes.join("") +
		contentConstraints.ends_with
	);
};

export const StringGenerator: InstanceofGeneratorDefinition<z.core.$ZodString> = {
	schema: z.core.$ZodString as any,
	generator: generate_string,
	match: "instanceof"
};

/**
 * Takes in a ZodType & Returns a list of 0 or more regexes it has to fulfill.
 *
 * @example `z.string().regex(/abc/) -> [/abc/]`
 * @param schema
 */
function getRegexConstraints(schema: z.core.$ZodType): RegExp[] {
	const regex_checks =
		schema._zod.def.checks?.filter((c) => c instanceof z.core.$ZodCheckRegex) ?? [];
	return regex_checks.map((check) => check._zod.def.pattern);
}

function generateStringWithoutFormat(
	ctx: GenerationContext<z.core.$ZodString>,
	lc: LengthConstraints,
	cc: ContentConstraints
) {
	const semantic_generators: {
		[flag in SemanticFlag]?: () => string;
	} = {
		fullname: faker.person.fullName,
		firstname: faker.person.firstName,
		lastname: faker.person.lastName,
		street: faker.location.street,
		city: faker.location.city,
		country: faker.location.country,
		zip: faker.location.zipCode,
		phoneNumber: faker.phone.number,
		paragraph: faker.lorem.paragraph,
		sentence: faker.lorem.sentence,
		word: faker.lorem.word,
		jobtitle: faker.person.jobTitle,
		color: color,
		gender: faker.person.gender,
		municipality: faker.location.city,
		"color-hex": () => faker.color.rgb({ prefix: "#", casing: "lower" }),
		weekday: faker.date.weekday,
		"unique-id": faker.string.uuid,
		key: () => faker.lorem.word(),
		unspecified: () =>
			faker.lorem.paragraphs(faker.number.int({ min: 1, max: 5 }))
	};

	const generator = semantic_generators[ctx.semantic_context];
	if (!generator)
		throw new Error(
			"No semantic generator found for context - falling back to random string"
		);

	const proposed_string = generator();
	return proposed_string;
}

function color(): string {
	const generators = [faker.color.human, faker.internet.color];
	return pick(generators)();
}

function stringMatchesConstraints(
	str: string,
	lc: LengthConstraints,
	cc: ContentConstraints
): boolean {
	if (lc.exact && str.length !== lc.exact) return false;
	if (lc.min && str.length < lc.min) return false;
	if (lc.max && str.length > lc.max) return false;

	if (cc.starts_with && !str.startsWith(cc.starts_with)) return false;
	if (cc.ends_with && !str.endsWith(cc.ends_with)) return false;
	if (cc.includes.length > 0 && !cc.includes.every((i) => str.includes(i)))
		return false;

	return true;
}
import {z} from "zod";
import { Generator } from "../../generate.js";
import { InstanceofGeneratorDefinition } from "../../zocker.js";
import { getLengthConstraints } from "./length-constraints.js";
import { getContentConstraints } from "./content-constraints.js";
import { faker } from "@faker-js/faker";

// Zod checks IPv4 via new URL("http://<ipv4-address>") constructor
const IPV4_REGEX =
	/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const IPV4_MIN_LENGTH = 7; // 1.1.1.1
const IPV4_MAX_LENGTH = 15; // 255.255.255.255
const IPV4_NUM_DOTS = 3;

// Zod checks IPv6 via new URL("http://[<ipv6-address>]") constructor
// IPv6 has the :: syntax to denote one or more groups of 0s
// This makes generation more complex
const IPV6_MIN_LENGTH = 3; // ::1
const IPV6_MAX_LENGTH = 39; // 1111:2222:3333:4444:5555:6666:7777:8888
const IPV6_MIN_LENGTH_WITHOUT_DOUBLE_COLON = 15; // 0:0:0:0:0:0:0:0
const IPV6_MAX_LENGTH_WITH_DOUBLE_COLON = 36; // ::1111:2222:3333:4444:5555:6666:7777

const ipv4_generator: Generator<z.core.$ZodIPv4> = (schema, ctx) => {
	const length_constraints = getLengthConstraints(schema);
	const content_constraints = getContentConstraints(schema);

	// Verify that the length constraints can be satisfied
	const min_length_too_long = length_constraints.min > IPV4_MAX_LENGTH;
	const max_length_too_short = length_constraints.max < IPV4_MIN_LENGTH;
	const exact_length_too_long =
		length_constraints.exact != null &&
		length_constraints.exact > IPV4_MAX_LENGTH;
	const exact_length_too_short =
		length_constraints.exact != null &&
		length_constraints.exact < IPV4_MIN_LENGTH;

	if (
		min_length_too_long ||
		max_length_too_short ||
		exact_length_too_long ||
		exact_length_too_short
	) {
		throw new Error("Invalid length constraints for IPv4");
	}

	const length =
		length_constraints.exact ??
		faker.number.int({
			min: Math.max(length_constraints.min, IPV4_MIN_LENGTH),
			max: Math.min(length_constraints.max, IPV4_MAX_LENGTH)
		});

	// TODO: Support content_constraints

	// How many characters are numbers in the final IP?
	return generateIPv4OfLength(length);
};

const ipv6_generator: Generator<z.core.$ZodIPv6> = (schema, ctx) => {
	const length_constraints = getLengthConstraints(schema);
	const content_constraints = getContentConstraints(schema);

	// Verify that the length constraints can be satisfied
	const min_length_too_long = length_constraints.min > IPV6_MAX_LENGTH;
	const max_length_too_short = length_constraints.max < IPV6_MIN_LENGTH;
	const exact_length_too_long =
		length_constraints.exact != null &&
		length_constraints.exact > IPV6_MAX_LENGTH;
	const exact_length_too_short =
		length_constraints.exact != null &&
		length_constraints.exact < IPV6_MIN_LENGTH;

	if (
		min_length_too_long ||
		max_length_too_short ||
		exact_length_too_long ||
		exact_length_too_short
	) {
		throw new Error("Invalid length constraints for IPv6");
	}

	const length =
		length_constraints.exact ??
		faker.number.int({
			min: Math.max(length_constraints.min, IPV6_MIN_LENGTH),
			max: Math.min(length_constraints.max, IPV6_MAX_LENGTH)
		});

	return generateIPv6OfLength(length);
};

export const IPv4Generator: InstanceofGeneratorDefinition<z.core.$ZodIPv4> = {
	schema: z.core.$ZodIPv4 as any,
	generator: ipv4_generator,
	match: "instanceof"
};

export const IPv6Generator: InstanceofGeneratorDefinition<z.core.$ZodIPv6> = {
	schema: z.core.$ZodIPv6 as any,
	generator: ipv6_generator,
	match: "instanceof"
};

/**
 * Generates an IPv4 Address of the given length. The length must be such that
 * an IPv4 address can be made.
 *
 * @param length
 */
export function generateIPv4OfLength(length: number) {
	const num_numbers_in_ip = length - IPV4_NUM_DOTS;
	const segment_lengths = partition(num_numbers_in_ip, 4, 1, 3);

	const segments = segment_lengths.map((length) => generateIPv4Segment(length));
	return segments.join(".");
}

/**
 * Generates an IPv6 Address of the given length. The length must be such that
 * an IPv6 address can be made.
 *
 * @param length
 */
export function generateIPv6OfLength(length: number) {
	// How many segments the IPv6 address should have
	// If this is less than 8, we're using the double colon syntax
	const should_use_double_colon = ipv6ShouldUseDoubleColon(length);
	const num_segments = choseNumberOfIPv6Segments(
		length,
		should_use_double_colon
	);

	if (!should_use_double_colon) {
		const lengthWithoutColons = length - 7;
		const segment_lengths = partition(lengthWithoutColons, num_segments, 1, 4);
		const segments = segment_lengths.map((length) =>
			generateIPv6Segment(length)
		);
		return segments.join(":");
	}

	// With double colon
	const lengthWithoutColons = length - (num_segments - 1) - 2; // -2 for double colon at the start
	const segment_lengths = partition(lengthWithoutColons, num_segments, 1, 4);
	const segments = segment_lengths.map((length) => generateIPv6Segment(length));

	// TODO: Support the :: in positions other than the first

	return "::" + segments.join(":");
}

/**
 * Generates an IPv4 segment (0-255) of the given length
 * @param length How many characters the segment should be. Between 1 and 3
 * @returns An IPv4 segment
 * @throws TypeError if the length is invalid
 */
function generateIPv4Segment(length: number) {
	if (length < 1 || length > 3 || !Number.isInteger(length))
		throw new TypeError(
			"IPv4 segments must be between 1 and 3 characters long"
		);

	switch (length) {
		case 1:
			return faker.number.int({ min: 0, max: 9 }).toString();
		case 2:
			return faker.number.int({ min: 10, max: 99 }).toString();
		case 3:
		default:
			return faker.number.int({ min: 100, max: 255 }).toString();
	}
}

/**
 * Generates a random IPv6 segment (0-ffff) of the given length
 * @param length How many characters the segment should be. Between 1 and 4
 * @returns An IPv6 segment
 * @throws TypeError if the length is invalid
 */
function generateIPv6Segment(length: number) {
	if (length < 1 || length > 4 || !Number.isInteger(length))
		throw new TypeError(
			"IPv6 segments must be between 1 and 4 characters long"
		);

	return faker.string.hexadecimal({ length, prefix: "", casing: "lower" });
}

/**
 * Returns true/false if the IPv6 of the given length should use double colons
 * - If it's forced it will always use double colons
 * - If it can't use the double colon, it will not
 * - Otherwise, random
 *
 * @param length The length of the IPv6 address.
 */
function ipv6ShouldUseDoubleColon(length: number): boolean {
	if (
		length < IPV6_MIN_LENGTH ||
		length > IPV6_MAX_LENGTH ||
		!Number.isInteger(length)
	)
		throw new TypeError(
			`Pv6 addresses must be between ${IPV6_MIN_LENGTH} and ${IPV6_MAX_LENGTH} characters long, ${length} given`
		);

	if (length < IPV6_MIN_LENGTH_WITHOUT_DOUBLE_COLON) return true;
	if (length > IPV6_MAX_LENGTH_WITH_DOUBLE_COLON) return false;
	return faker.datatype.boolean();
}

/**
 * Determine the number of segments in the generated IPv6 address.
 * If the target length is really short, we might only be able to have 1 segment
 * If the target length is really long, we might be forced to have all 8 segments
 *
 * @param length
 */
function choseNumberOfIPv6Segments(
	length: number,
	shouldUseDoubleColon: boolean
): number {
	if (shouldUseDoubleColon == false) return 8;

	// The maximum number of segments we have space for with the remaining characters
	let max_segments = Math.min(Math.floor((length - 1) / 2), 7);

	// the minimum number of segments we have space for with the remaining characterss
	const min_segments = Math.max(Math.ceil((length - 1) / 5), 1);

	return faker.number.int({ min: min_segments, max: max_segments });
}

/**
 * Partitions a total number into a specified number of partitions,
 * ensuring each partition has a value between min_partition_size and max_partition_size
 *
 * @param total The total number to partition.
 * @param num_partitions The number of partitions to create.
 *
 * @param min_partition_size The minimum size of a partition.
 * @param max_partition_size The maximum size of a partition.
 * @returns An array of partition sizes.
 * @throws Error if it's not possible to partition the total into the given constraints.
 */
function partition(
	total: number,
	num_partitions: number,
	min_partition_size: number,
	max_partition_size: number
): number[] {
	if (
		total < num_partitions * min_partition_size ||
		total > num_partitions * max_partition_size
	) {
		throw new Error(
			`Cannot partition ${total} into ${num_partitions} Partitions, where each partition must be between ${min_partition_size} and ${max_partition_size}.`
		);
	}

	let remaining = total;
	const partitions = Array(num_partitions).fill(min_partition_size); // Start with the minimum value for each partition
	remaining -= num_partitions * min_partition_size; // Subtract the minimum values from the total

	// while remaining > 0, pich a random partition to increase
	while (remaining > 0) {
		const partition_index = faker.number.int({
			min: 0,
			max: num_partitions - 1
		});
		if (partitions[partition_index] >= max_partition_size) continue;

		partitions[partition_index]++;
		remaining--;
	}

	return partitions;
}
import {z} from "zod";
import { Generator } from "../../generate.js";
import { InstanceofGeneratorDefinition } from "../../zocker.js";
import { faker } from "@faker-js/faker";
import Randexp from "randexp";

const email_generator: Generator<z.core.$ZodEmail> = (schema, ctx) => {
	const pattern =
		getRegexCheck(schema) ?? schema._zod.def.pattern ?? z.regexes.email;

	// 1. Try using an email from faker
	const generated_email: string = faker.internet.email();
	if (generated_email.match(pattern)) {
		return generated_email;
	}

	// 2. As a fallback, use Randexp to generate a guaranteed valid string.
	const randexp = new Randexp(pattern);
	randexp.randInt = (min: number, max: number) =>
		faker.number.int({ min, max });
	return randexp.gen();
};

export const EmailGenerator: InstanceofGeneratorDefinition<z.core.$ZodEmail> = {
	match: "instanceof",
	schema: z.core.$ZodEmail as any,
	generator: email_generator
};

function getRegexCheck(schema: z.core.$ZodEmail): RegExp | null {
	const checks = schema._zod.def.checks ?? [];
	const regex_checks = checks.filter(
		(check) => check instanceof z.core.$ZodCheckRegex
	);
	return regex_checks.at(0)?._zod.def.pattern ?? null;
}
import {z} from "zod";
import { Generator } from "../../generate.js";
import { InstanceofGeneratorDefinition } from "../../zocker.js";
import { faker } from "@faker-js/faker";
import Randexp from "randexp";

const nanoid_generator: Generator<z.core.$ZodNanoID> = (schema, ctx) => {
	const pattern = z.regexes.nanoid;

	const randexp = new Randexp(pattern);
	randexp.randInt = (min: number, max: number) =>
		faker.number.int({ min, max });
	return randexp.gen();
};

export const NanoIDGenerator: InstanceofGeneratorDefinition<z.core.$ZodNanoID> = {
	match: "instanceof",
	schema: z.core.$ZodNanoID as any,
	generator: nanoid_generator
};
import { InvalidSchemaException } from "../../exceptions.js";
import {z} from "zod";

/**
 * Represents the constraints that apply to the _content_ of a string
 *
 * @property starts_with The string that the string must start with. ("" if not specified)
 * @property ends_with The string that the string must end with. ("" if not specified)
 * @property includes An array of strings that the string must contain
 */
export type ContentConstraints = {
	starts_with: string;
	ends_with: string;
	includes: string[];
};

/**
 * Returns the constraints on the _content_ of a string. These include:
 * - `starts_with`, `ends_with` and `includes`
 *
 * @param string_schema The string schema to get the Content Constarints for.
 * @returns The constaraints on the content of the string.
 */
export function getContentConstraints(
	string_schema: z.core.$ZodString
): ContentConstraints {
	const starts_with_checks =
		string_schema._zod.def.checks?.filter(
			(c) => c instanceof z.core.$ZodCheckStartsWith
		) ?? [];
	const ends_with_checks =
		string_schema._zod.def.checks?.filter(
			(c) => c instanceof z.core.$ZodCheckEndsWith
		) ?? [];
	const includes_checks =
		string_schema._zod.def.checks?.filter(
			(c) => c instanceof z.core.$ZodCheckIncludes
		) ?? [];

	const starts_with = starts_with_checks.reduce((acc, check) => {
		const suggested_starts_with = check._zod.def.prefix;

		if (
			acc.length == suggested_starts_with.length &&
			acc != suggested_starts_with
		) {
			throw new InvalidSchemaException(
				"startsWith constraints are not compatible - The Schema cannot be satisfied"
			);
		}

		const longer =
			suggested_starts_with.length > acc.length ? suggested_starts_with : acc;
		const shorter =
			suggested_starts_with.length < acc.length ? suggested_starts_with : acc;

		if (!longer.startsWith(shorter)) {
			throw new InvalidSchemaException(
				"startsWith constraints are not compatible - The Schema cannot be satisfied"
			);
		}
		return longer;
	}, "");

	const ends_with = ends_with_checks.reduce((acc, check) => {
		const suggested_ends_with = check._zod.def.suffix;

		if (
			acc.length == suggested_ends_with.length &&
			acc != suggested_ends_with
		) {
			throw new InvalidSchemaException(
				"endsWith constraints are not compatible - The Schema cannot be satisfied"
			);
		}

		const longer =
			suggested_ends_with.length > acc.length ? suggested_ends_with : acc;
		const shorter =
			suggested_ends_with.length < acc.length ? suggested_ends_with : acc;

		if (!longer.endsWith(shorter))
			throw new InvalidSchemaException(
				"endsWith constraints are not compatible - The Schema cannot be satisfied"
			);
		return longer;
	}, "");

	const includes = includes_checks
		.map((c) => c._zod.def.includes)
		.filter((include) => !starts_with.includes(include)) // filter out trivial includes
		.filter((include) => !ends_with.includes(include)); // filter out trivial includes

	return {
		starts_with,
		ends_with,
		includes
	};
}
import {z} from "zod";
import { Generator } from "../../generate.js";
import { InstanceofGeneratorDefinition } from "../../zocker.js";
import { faker } from "@faker-js/faker";
import { getLengthConstraints } from "./length-constraints.js";
import { getContentConstraints } from "./content-constraints.js";
import RandExp from "randexp";

const URL_MIN_LENGTH = 2; // Must have at least a protocol. Eg: "a:"

const url_generator: Generator<z.core.$ZodURL> = (schema, ctx) => {
	const hostnameRegex = schema._zod.def.hostname;
	const protocolRegex = schema._zod.def.protocol;

	const length_constraints = getLengthConstraints(schema);
	const content_constraints = getContentConstraints(schema);

	const generated_url = new URL(faker.internet.url());
	if (hostnameRegex !== undefined)
		generated_url.hostname = generateURLSafeStringForRegex(hostnameRegex);
	if (protocolRegex !== undefined)
		generated_url.protocol = generateURLSafeStringForRegex(protocolRegex);

	return generated_url.href;
};

export const URLGenerator: InstanceofGeneratorDefinition<z.core.$ZodURL> = {
	match: "instanceof",
	schema: z.core.$ZodURL as any,
	generator: url_generator
};

function generateURLSafeStringForRegex(regex: RegExp): string {
	const randexp = new RandExp(regex);

	// Disallow invalid characters
	randexp.defaultRange.subtract(0, 127);
	randexp.defaultRange.add(97, 122); // a-z
	randexp.defaultRange.add(48, 57); // 0-9
	randexp.defaultRange.add(45, 45); // -
	randexp.defaultRange.add(65, 90); // A-Z

	randexp.randInt = (min: number, max: number) =>
		faker.number.int({ min, max });
	return randexp.gen();
}
import {z} from "zod";
import { Generator } from "../../generate.js";
import { InstanceofGeneratorDefinition } from "../../zocker.js";
import { faker } from "@faker-js/faker";
import { getLengthConstraints } from "./length-constraints.js";
import { InvalidSchemaException } from "../../exceptions.js";
import { generateIPv4OfLength, generateIPv6OfLength } from "./ip.js";

const CIDR_V4_MIN_LENGTH = 9; // 1.1.1.1/0
const CIDR_V4_MAX_LENGTH = 18; // 255.255.255.255/32

const CIDR_V6_MIN_LENGTH = 5; // ::1/0
const CIDR_V6_MAX_LENGTH = 43; // 1111:2222:3333:4444:5555:6666:7777:8888/128

const cidrv4_generator: Generator<z.core.$ZodCIDRv4> = (schema, ctx) => {
	const length_constraints = getLengthConstraints(schema);

	const max_length_too_short = length_constraints.max < CIDR_V4_MIN_LENGTH;
	const min_length_too_long = length_constraints.min > CIDR_V4_MAX_LENGTH;
	const exact_length_too_short =
		length_constraints.exact && length_constraints.exact < CIDR_V4_MIN_LENGTH;
	const exact_length_too_long =
		length_constraints.exact && length_constraints.exact > CIDR_V4_MAX_LENGTH;

	if (
		max_length_too_short ||
		exact_length_too_short ||
		min_length_too_long ||
		exact_length_too_long
	) {
		throw new InvalidSchemaException(
			`CIDRv4 must be between ${CIDR_V4_MIN_LENGTH} and ${CIDR_V4_MAX_LENGTH} characters long`
		);
	}

	const length =
		length_constraints.exact ??
		faker.number.int({
			min: Math.max(length_constraints.min, CIDR_V4_MIN_LENGTH),
			max: Math.min(length_constraints.max, CIDR_V4_MAX_LENGTH)
		});

	// Chose a mask length
	// If the length is so short that the result MUST have a single digit mask. Eg /1
	const must_have_single_digit_mask = length == CIDR_V4_MIN_LENGTH;
	const must_have_double_digit_mask = length == CIDR_V4_MAX_LENGTH;

	let mask_length: 1 | 2;
	if (must_have_single_digit_mask) mask_length = 1;
	else if (must_have_double_digit_mask) mask_length = 2;
	else mask_length = faker.number.int({ min: 1, max: 2 }) as 1 | 2;

	const mask: number =
		mask_length == 1
			? faker.number.int({ min: 0, max: 9 })
			: faker.number.int({ min: 10, max: 32 });
	const ipv4_length = length - mask_length - 1;
	const ipv4_address = generateIPv4OfLength(ipv4_length);

	return `${ipv4_address}/${mask}`;
};

const cidrv6_generator: Generator<z.core.$ZodCIDRv6> = (schema, ctx) => {
	const length_constraints = getLengthConstraints(schema);

	const max_length_too_short = length_constraints.max < CIDR_V6_MIN_LENGTH;
	const min_length_too_long = length_constraints.min > CIDR_V6_MAX_LENGTH;
	const exact_length_too_short =
		length_constraints.exact && length_constraints.exact < CIDR_V6_MIN_LENGTH;
	const exact_length_too_long =
		length_constraints.exact && length_constraints.exact > CIDR_V6_MAX_LENGTH;

	if (
		max_length_too_short ||
		exact_length_too_short ||
		min_length_too_long ||
		exact_length_too_long
	) {
		throw new InvalidSchemaException(
			`CIDRv6 must be between ${CIDR_V6_MIN_LENGTH} and ${CIDR_V6_MAX_LENGTH} characters long`
		);
	}

	const length =
		length_constraints.exact ??
		faker.number.int({
			min: Math.max(length_constraints.min, CIDR_V6_MIN_LENGTH),
			max: Math.min(length_constraints.max, CIDR_V6_MAX_LENGTH)
		});

	// Chose a mask length
	// If the length is so short that the result MUST have a single digit mask. Eg /1
	const must_have_single_digit_mask = length == CIDR_V6_MIN_LENGTH;
	const cannot_have_triple_digit_mask = length <= CIDR_V4_MIN_LENGTH + 1;
	const cannot_have_single_digit_mask = length >= CIDR_V4_MAX_LENGTH - 1;
	const must_have_triple_digit_mask = length == CIDR_V6_MAX_LENGTH;

	let mask_length: 1 | 2 | 3;
	if (must_have_single_digit_mask) mask_length = 1;
	else if (must_have_triple_digit_mask) mask_length = 3;
	else mask_length = faker.number.int({ min: 1, max: 3 }) as 1 | 2 | 3;
	if (mask_length == 3 && cannot_have_triple_digit_mask) mask_length = 2;
	if (mask_length == 1 && cannot_have_single_digit_mask) mask_length = 2;

	const mask: number =
		mask_length == 1
			? faker.number.int({ min: 0, max: 9 })
			: mask_length == 2
			? faker.number.int({ min: 10, max: 99 })
			: faker.number.int({ min: 100, max: 128 });

	const ipv6_length = length - mask_length - 1;
	const ipv6_address = generateIPv6OfLength(ipv6_length);

	return `${ipv6_address}/${mask}`;
};

export const CIDRv4Generator: InstanceofGeneratorDefinition<z.core.$ZodCIDRv4> = {
	match: "instanceof",
	schema: z.core.$ZodCIDRv4 as any,
	generator: cidrv4_generator
};

export const CIDRv6Generator: InstanceofGeneratorDefinition<z.core.$ZodCIDRv6> = {
	match: "instanceof",
	schema: z.core.$ZodCIDRv6 as any,
	generator: cidrv6_generator
};
import {z} from "zod";
import { Generator } from "../../generate.js";
import { InstanceofGeneratorDefinition } from "../../zocker.js";
import { getLengthConstraints } from "./length-constraints.js";
import { getContentConstraints } from "./content-constraints.js";
import RandExp from "randexp";

const KSUID_LENGTH = 27;

const ksuid_generator: Generator<z.core.$ZodKSUID> = (schema, ctx) => {
	const length_constraints = getLengthConstraints(schema);

	const min_length_too_long = length_constraints.min > KSUID_LENGTH;
	const max_length_too_short = length_constraints.max < KSUID_LENGTH;
	const exact_length_too_long =
		length_constraints.exact != null && length_constraints.exact > KSUID_LENGTH;
	const exact_length_too_short =
		length_constraints.exact != null && length_constraints.exact < KSUID_LENGTH;

	if (
		min_length_too_long ||
		max_length_too_short ||
		exact_length_too_long ||
		exact_length_too_short
	) {
		throw new Error(`KSUID must be exactly ${KSUID_LENGTH} characters long`);
	}

	const content_constraints = getContentConstraints(schema);

	const ksuid = new RandExp(z.regexes.ksuid);
	return ksuid.gen();
};

export const KSUIDGenerator: InstanceofGeneratorDefinition<z.core.$ZodKSUID> = {
	match: "instanceof",
	schema: z.core.$ZodKSUID as any,
	generator: ksuid_generator
};
import {z} from "zod";
import { Generator } from "../../generate.js";
import { InstanceofGeneratorDefinition } from "../../zocker.js";
import { faker } from "@faker-js/faker";
import { getLengthConstraints } from "./length-constraints.js";
import { getContentConstraints } from "./content-constraints.js";

const generate_emoji: Generator<z.core.$ZodEmoji> = (schema, ctx) => {
	const lengthConstraints = getLengthConstraints(schema);
	const contentConstraints = getContentConstraints(schema);

	const length =
		lengthConstraints.exact ??
		faker.number.int({
			min: lengthConstraints.min,
			max:
				lengthConstraints.max == Infinity
					? lengthConstraints.min + 50_000
					: lengthConstraints.max
		});

	const generated_length =
		length -
		contentConstraints.starts_with.length -
		contentConstraints.ends_with.length;

	let emojis = contentConstraints.starts_with;
	for (let i = 0; i < length; i++) {
		emojis += faker.internet.emoji();
	}
	emojis += contentConstraints.ends_with;

	return emojis;
};

export const EmojiGenerator: InstanceofGeneratorDefinition<z.core.$ZodEmoji> = {
	match: "instanceof",
	generator: generate_emoji,
	schema: z.core.$ZodEmoji as any
};
import type { InstanceofGeneratorDefinition } from "../../zocker.js";
import type { Generator } from "../../generate.js";
import {z} from "zod";
import { getLengthConstraints } from "./length-constraints.js";
import { InvalidSchemaException } from "../../exceptions.js";
import { getContentConstraints } from "./content-constraints.js";
import { faker } from "@faker-js/faker";

// const CUID_REGEX = /^c[^\s-]{8,}$/i;
const CUID_MIN_LENGTH = 9;
const CUID_COMMON_LENGHT = 25; // Most CUIDs are around 25 characters long

// const CUID2_REGEX = /^[a-z][0-9a-z]+$/;
const CUID2_MIN_LENGTH = 2;
const CUID2_COMMON_LENGTH = 24;

/**
 * Generates a valid CUID. The CUID format is as follows:
 * 1. The char 'c'
 * 2. 8 or more characters [a-zA-Z0-9]. Technically more are allowed, just not - or whitespace.
 *
 * @param schema A CUID Schema
 * @param generation_context The relevant generation context
 * @returns A CUID that conforms to the given schema
 * @throws InvalidSchemaException if the Schema cannot be satisfied
 */
const generate_cuid: Generator<z.core.$ZodCUID> = (schema, generation_context) => {
	const length_constraints = getLengthConstraints(schema);
	const content_constraints = getContentConstraints(schema);

	// Validate that the length constraints can be satisfied for a CUID
	const exact_length_too_short =
		length_constraints.exact != null &&
		length_constraints.exact < CUID_MIN_LENGTH;
	const max_length_too_short = length_constraints.max < CUID_MIN_LENGTH;
	if (exact_length_too_short || max_length_too_short) {
		throw new InvalidSchemaException(
			"CUID cannot be less than 9 characters long"
		);
	}

	// validate that the content constraints can be verified
	if (
		content_constraints.starts_with != "" &&
		!content_constraints.starts_with.startsWith("c")
	) {
		// Note: Zod also allows uppercase 'C' as the first character, but according to the CUID spec that isn't allowed
		throw new InvalidSchemaException("CUID must start with a 'c'");
	}

	const length =
		length_constraints.exact ??
		faker.number.int({
			min: Math.max(length_constraints.min, CUID_MIN_LENGTH),
			max:
				length_constraints.max == Infinity
					? length_constraints.min + CUID_COMMON_LENGHT
					: length_constraints.max
		});

	return generateCUIDofLength(length);
};

/**
 * Generates a valid CUID2. The CUID2 format is as follows:
 * - One alpha character
 * - 1 or more alphanumeric characters
 *
 * @param schema A CUID2 Schema
 * @param generation_context The relevant generation context
 * @returns A CUID2 that conforms to the given schema
 * @throws InvalidSchemaException if the Schema cannot be satisfied
 */
const generate_cuid2: Generator<z.core.$ZodCUID2> = (schema, generation_context) => {
	const length_constraints = getLengthConstraints(schema);
	const content_constraints = getContentConstraints(schema);

	// Validate that the length constraints can be satisfied for a CUID
	const exact_length_too_short =
		length_constraints.exact != null &&
		length_constraints.exact < CUID2_MIN_LENGTH;
	const max_length_too_short = length_constraints.max < CUID2_MIN_LENGTH;
	if (exact_length_too_short || max_length_too_short) {
		throw new InvalidSchemaException(
			"CUID2 cannot be less than 2 characters long"
		);
	}

	const length =
		length_constraints.exact ??
		faker.number.int({
			min: Math.max(length_constraints.min, CUID2_MIN_LENGTH),
			max:
				length_constraints.max == Infinity
					? length_constraints.min + CUID2_COMMON_LENGTH
					: length_constraints.max
		});

	return generateCUID2ofLength(length);
};

export const CUIDGenerator: InstanceofGeneratorDefinition<z.core.$ZodCUID> = {
	schema: z.core.$ZodCUID as any,
	generator: generate_cuid,
	match: "instanceof"
};

export const CUID2Generator: InstanceofGeneratorDefinition<z.core.$ZodCUID2> = {
	schema: z.core.$ZodCUID2 as any,
	generator: generate_cuid2,
	match: "instanceof"
};

/**
 * Generates a CUID of the given length
 * @param len The length of the CUID. Must be at least 9
 * @returns A CUID of the given length
 * @throws If the length is too short
 */
function generateCUIDofLength(len: number) {
	if (len < CUID_MIN_LENGTH)
		throw new TypeError("CUID must be at least 9 characters long");

	let cuid = "c" + faker.string.alphanumeric({ length: len - 1 });
	return cuid;
}

/**
 * Generates a CUID2 of the given length
 * @param len The length of the CUID2. Must be at least 2
 * @returns A CUID of the given length
 * @throws If the length is too short
 */
function generateCUID2ofLength(len: number) {
	if (len < CUID2_MIN_LENGTH)
		throw new TypeError("CUID2 must be at least 2 characters long");
	let cuid2 =
		faker.string.alpha({ casing: "lower" }) +
		faker.string.alphanumeric({ length: len - 1, casing: "lower" });
	return cuid2;
}
import {z} from "zod";
import { InvalidSchemaException } from "../../exceptions.js";

export type LengthConstraints = {
	/** The minimum number of characters the string should have. Defaults to zero */
	min: number;
	/** The maximum number of characters the string should have. Defaults to Infinity*/
	max: number;

	/** The exact number of characters the string should have, if specified. Defaults to null. */
	exact: number | null;
};

/**
 * Returns the length constraints that apply for a given schema. If multiple constraints
 * are specified (eg. multiple min-lengths), the most restrictive is applied
 *
 * @param string_schema The schema to get length constraints for
 * @returns The length constraints
 * @throws InvalidSchemaException if the length constraints are impossible to satisfy (eg: min > max)
 */
export function getLengthConstraints(
	string_schema: z.core.$ZodType
): LengthConstraints {
	const min_length_checks =
		string_schema._zod.def.checks?.filter(
			(c) => c instanceof z.core.$ZodCheckMinLength
		) ?? [];
	const max_length_checks =
		string_schema._zod.def.checks?.filter(
			(c) => c instanceof z.core.$ZodCheckMaxLength
		) ?? [];
	const exact_length_checks =
		string_schema._zod.def.checks?.filter(
			(c) => c instanceof z.core.$ZodCheckLengthEquals
		) ?? [];

	const min_length = min_length_checks.reduce((acc, check) => {
		const value = check._zod.def.minimum;
		return value > acc ? value : acc;
	}, 0);

	const max_length = max_length_checks.reduce((acc, check) => {
		const value = check._zod.def.maximum;
		return value < acc ? value : acc;
	}, Infinity);

	// Make sure min & max don't conflict
	if (min_length > max_length)
		throw new InvalidSchemaException("min length is greater than max length");

	// if there are multiple
	let exact_length = null;
	for (const exact_length_check of exact_length_checks) {
		const suggested_length = exact_length_check._zod.def.length;
		if (exact_length == null) exact_length = suggested_length;
		else if (suggested_length != exact_length)
			throw new InvalidSchemaException(
				"Cannot generate a string with conflictung exact length constraints"
			);
	}

	// If there is an exact length constraint, make sure it doesn't conflict with min/max length constraints
	if (exact_length !== null) {
		if (min_length > exact_length)
			throw new InvalidSchemaException(
				"min length is greater than exact length"
			);
		if (max_length < exact_length)
			throw new InvalidSchemaException("max length is less than exact length");
	}

	return {
		min: min_length,
		max: max_length,
		exact: exact_length
	};
}

import {z} from "zod";
import { generate, GenerationContext } from "../../generate.js";

/**
 * If the schema has checks for a legacy format (eg `z.string().email()` instead of `z.string()`), this will
 * call the apropriate generator.
 *
 * @returns The generated string, or `null` if no legacy format was used
 */
export function legacyFormatString(
	schema: z.core.$ZodString,
	ctx: GenerationContext<any>
): string | null {
	const checks = schema._zod.def.checks ?? [];
	const format_checks = checks.filter(
		(check) => check instanceof z.ZodStringFormat
	);

	const date_checks = format_checks.filter(
		(check) => check instanceof z.iso.ZodISODate
	);
	if (date_checks.length > 0) {
		const date_schema = z.iso.date();
		date_schema._zod.def.checks = checks;
		return generate(date_schema, ctx);
	}

	const datetime_checks = format_checks.filter(
		(check) => check instanceof z.iso.ZodISODateTime
	);
	if (datetime_checks.length > 0) {
		const datetime_schema = z.iso.datetime();
		datetime_schema._zod.def.checks = checks;
		return generate(datetime_schema, ctx);
	}

	const duration_checks = format_checks.filter(
		(check) => check instanceof z.iso.ZodISODuration
	);
	if (duration_checks.length > 0) {
		const duration_schema = z.iso.duration();
		duration_schema._zod.def.checks = checks;
		return generate(duration_schema, ctx);
	}

	const time_checks = format_checks.filter(
		(check) => check instanceof z.iso.ZodISOTime
	);
	if (time_checks.length > 0) {
		const time_schema = z.iso.time();
		time_schema._zod.def.checks = checks;
		return generate(time_schema, ctx);
	}

	const email_checks = format_checks.filter(
		(check) => check instanceof z.ZodEmail
	);
	if (email_checks.length > 0) {
		const email_schema = z.email();
		email_schema._zod.def.checks = checks;
		return generate(email_schema, ctx);
	}

	const guid_checks = checks.filter((c) => c instanceof z.ZodGUID);
	if (guid_checks.length > 0) {
		const guid_schema = z.guid();
		guid_schema._zod.def.checks = checks;
		return generate(guid_schema, ctx);
	}

	const uuid_checks = checks.filter((c) => c instanceof z.ZodUUID);		
	if (uuid_checks.length > 0) {
		const uuid_schema = z.uuid({ version: uuid_checks[0]!.def.check as any });
		uuid_schema._zod.def.checks = checks;
		return generate(uuid_schema, ctx);
	}

	const url_checks = checks.filter((c) => c instanceof z.ZodURL);
	if (url_checks.length > 0) {
		const url_schema = z.url();
		url_schema._zod.def.checks = checks;
		return generate(url_schema, ctx);
	}

	const cuid_checks = checks.filter((c) => c instanceof z.ZodCUID);
	if (cuid_checks.length > 0) {
		const cuid_schema = z.cuid();
		cuid_schema._zod.def.checks = checks;
		return generate(cuid_schema, ctx);
	}

	const cuid2_checks = checks.filter((c) => c instanceof z.ZodCUID2);		
	if (cuid2_checks.length > 0) {
		const cuid2_schema = z.cuid2();
		cuid2_schema._zod.def.checks = checks;
		return generate(cuid2_schema, ctx);
	}

	const ulid_checks = checks.filter((c) => c instanceof z.ZodULID);	
	if (ulid_checks.length > 0) {
		const ulid_schema = z.ulid();
		ulid_schema._zod.def.checks = checks;
		return generate(ulid_schema, ctx);
	}

	const emoji_checks = checks.filter((c) => c instanceof z.ZodEmoji);
	if (emoji_checks.length > 0) {
		const emoji_schema = z.emoji();
		emoji_schema._zod.def.checks = checks;
		return generate(emoji_schema, ctx);
	}

	const nanoid_checks = checks.filter((c) => c instanceof z.ZodNanoID);
	if (nanoid_checks.length > 0) {
		const nanoid_schema = z.nanoid();
		nanoid_schema._zod.def.checks = checks;
		return generate(nanoid_schema, ctx);
	}

	const ipv6_checks = checks.filter((c) => c instanceof z.ZodIPv6);
	if (ipv6_checks.length > 0) {
		const ipv6_schema = z.ipv6();
		ipv6_schema._zod.def.checks = checks;
		return generate(ipv6_schema, ctx);
	}

	const ipv4_checks = checks.filter((c) => c instanceof z.ZodIPv4);		
	if (ipv4_checks.length > 0) {
		const ipv4_schema = z.ipv4();		
		ipv4_schema._zod.def.checks = checks;
		return generate(ipv4_schema, ctx);
	}

	const e164_checks = checks.filter((c) => c instanceof z.ZodE164);
	if (e164_checks.length > 0) {
		const e164_schema = z.e164();
		e164_schema._zod.def.checks = checks;
		return generate(e164_schema, ctx);
	}

	const cidrv4_checks = checks.filter((c) => c instanceof z.ZodCIDRv4);	
	if (cidrv4_checks.length > 0) {
		const cidrv4_schema = z.cidrv4();
		cidrv4_schema._zod.def.checks = checks;
		return generate(cidrv4_schema, ctx);
	}

	const cidrv6_checks = checks.filter((c) => c instanceof z.ZodCIDRv6);
	if (cidrv6_checks.length > 0) {
		const cidrv6_schema = z.cidrv6();
		cidrv6_schema._zod.def.checks = checks;
		return generate(cidrv6_schema, ctx);
	}

	const base64_url_checks = checks.filter((c) => c instanceof z.ZodBase64URL);
	if (base64_url_checks.length > 0) {
		const base64_url_schema = z.base64url();
		base64_url_schema._zod.def.checks = checks;
		return generate(base64_url_schema, ctx);
	}

	const base64_checks = checks.filter((c) => c instanceof z.ZodBase64);
	if (base64_checks.length > 0) {
		const base64_schema = z.base64();
		base64_schema._zod.def.checks = checks;
		return generate(base64_schema, ctx);
	}

	const jwt_checks = checks.filter((c) => c instanceof z.ZodJWT);
	if (jwt_checks.length > 0) {
		const jwt_schema = z.jwt();
		jwt_schema._zod.def.checks = checks;
		return generate(jwt_schema, ctx);
	}

	const ksuid_checks = checks.filter((c) => c instanceof z.ZodKSUID);
	if (ksuid_checks.length > 0) {
		const ksuid_schema = z.ksuid();
		ksuid_schema._zod.def.checks = checks;
		return generate(ksuid_schema, ctx);
	}

	const xid_checks = checks.filter((c) => c instanceof z.ZodXID);
	if (xid_checks.length > 0) {
		const xid_schema = z.xid();
		xid_schema._zod.def.checks = checks;
		return generate(xid_schema, ctx);
	}

	return null;
}
import {z} from "zod";
import { Generator } from "../../generate.js";
import { InstanceofGeneratorDefinition } from "../../zocker.js";
import { faker } from "@faker-js/faker";

const base64_generator: Generator<z.core.$ZodBase64> = (schema, ctx) => {
	return generateBase64String();
};

const base64url_generator: Generator<z.core.$ZodBase64URL> = (schema, ctx) => {
	const data = generateBase64String();
	const encodedData = data
		.replaceAll("+", "-")
		.replaceAll("/", "_")
		.replaceAll("=", "");
	return encodedData;
};

export const Base64Generator: InstanceofGeneratorDefinition<z.core.$ZodBase64> = {
	match: "instanceof",
	schema: z.core.$ZodBase64 as any,
	generator: base64_generator
};

export const Base64URLGenerator: InstanceofGeneratorDefinition<z.core.$ZodBase64URL> =
	{
		match: "instanceof",
		schema: z.core.$ZodBase64URL as any,
		generator: base64url_generator
	};

function generateBase64String(): string {
	const bytes = faker.number.int({ min: 0, max: 100000 });
	let data = "";
	for (let i = 0; i < bytes; i++) {
		data += String.fromCharCode(faker.number.int({ min: 0, max: 255 }));
	}
	return btoa(data);
}
import {z} from "zod";
import { Generator } from "../../generate.js";
import { InstanceofGeneratorDefinition } from "../../zocker.js";
import { faker } from "@faker-js/faker";
import Randexp from "randexp";

const e164_generator: Generator<z.core.$ZodE164> = (schema, ctx) => {
	const pattern =
		getRegexCheck(schema) ?? schema._zod.def.pattern ?? z.regexes.e164;

	const randexp = new Randexp(pattern);
	randexp.randInt = (min: number, max: number) =>
		faker.number.int({ min, max });
	return randexp.gen();
};

export const E164Generator: InstanceofGeneratorDefinition<z.core.$ZodE164> = {
	match: "instanceof",
	schema: z.core.$ZodE164 as any,
	generator: e164_generator
};

function getRegexCheck(schema: z.core.$ZodE164): RegExp | null {
	const checks = schema._zod.def.checks ?? [];
	const regex_checks = checks.filter(
		(check) => check instanceof z.core.$ZodCheckRegex
	);
	return regex_checks.at(0)?._zod.def.pattern ?? null;
}
export { DefaultGenerator } from "./default.js";
export { AnyGenerator, UnknownGenerator } from "./any.js";
export { NumberGenerator } from "./numbers.js";
export { TupleGenerator } from "./tuple.js";
export { UnionGenerator } from "./union.js";
export { ObjectGenerator } from "./object.js";
export { SetGenerator } from "./set.js";
export { MapGenerator } from "./map.js";
export { DateGenerator } from "./dates.js";
export { RecordGenerator } from "./record.js";
export { BigintGenerator } from "./bigint.js";
export { PromiseGenerator } from "./promise.js";
export { LazyGenerator } from "./lazy.js";
export { SymbolGenerator } from "./symbol.js";
export { EnumGenerator } from "./enum.js";
export { BooleanGenerator } from "./boolean.js";
export { ArrayGenerator } from "./array.js";
export { OptionalGenerator } from "./optional.js";
export { NullableGenerator } from "./nullable.js";
export { IntersectionGenerator } from "./intersection/index.js";
export { ReadonlyGenerator } from "./readonly.js";
export { StringGenerator } from "./string/plain.js";
export { CUIDGenerator, CUID2Generator } from "./string/cuid.js";
export { IPv4Generator, IPv6Generator } from "./string/ip.js";
export { UUIDGenerator, GUIDGenerator } from "./string/uuid.js";
export { E164Generator } from "./string/e164.js";
export { EmailGenerator } from "./string/email.js";
export {
	ISODateGenerator,
	ISODateTimeGenerator,
	ISOTimeGenerator,
	ISODurationGenerator
} from "./string/iso.js";
export { NanoIDGenerator } from "./string/nanoid.js";
export { ULIDGenerator } from "./string/ulid.js";
export { CIDRv4Generator, CIDRv6Generator } from "./string/cidr.js";
export { URLGenerator } from "./string/url.js";
export { PipeGenerator } from "./pipe.js";
export { EmojiGenerator } from "./string/emoji.js";
export { Base64Generator, Base64URLGenerator } from "./string/base64.js";
export { KSUIDGenerator } from "./string/ksuid.js";
export { XIDGenerator } from "./string/xid.js";
import { InstanceofGeneratorDefinition } from "../zocker.js";
import { RecursionLimitReachedException } from "../exceptions.js";
import { Generator, generate } from "../generate.js";
import { weighted_random_boolean } from "../utils/random.js";
import {z} from "zod";

export type NullableOptions = {
	null_chance: number;
};

const generator: Generator<z.core.$ZodNullable<z.core.$ZodType>> = (schema, ctx) => {
	const should_be_null = weighted_random_boolean(
		ctx.nullable_options.null_chance
	);

	try {
		return should_be_null ? null : generate(schema._zod.def.innerType, ctx);
	} catch (e) {
		if (e instanceof RecursionLimitReachedException) {
			return null;
		} else {
			throw e;
		}
	}
};

export const NullableGenerator: InstanceofGeneratorDefinition<
	z.core.$ZodNullable<z.core.$ZodType>
> = {
	schema: z.core.$ZodNullable as any,
	generator,
	match: "instanceof"
};
import { Generator, generate } from "../generate.js";
import { InstanceofGeneratorDefinition } from "../zocker.js";
import {z} from "zod";

const generate_readonly: Generator<z.core.$ZodReadonly<any>> = (
	readonly_schema,
	ctx
) => {
	const inner = generate(readonly_schema._zod.def.innerType, ctx);

	if (typeof inner === "object") {
		Object.freeze(inner);
	}

	return inner;
};

export const ReadonlyGenerator: InstanceofGeneratorDefinition<
	z.core.$ZodReadonly<any>
> = {
	schema: z.core.$ZodReadonly as any,
	generator: generate_readonly,
	match: "instanceof"
};
import { InstanceofGeneratorDefinition } from "../zocker.js";
import { RecursionLimitReachedException } from "../exceptions.js";
import { Generator, generate } from "../generate.js";
import { weighted_random_boolean } from "../utils/random.js";
import {z} from "zod";

export type OptionalOptions = {
	undefined_chance: number;
};

const generator: Generator<z.core.$ZodOptional<any>> = (schema, ctx) => {
	const should_be_undefined = weighted_random_boolean(
		ctx.optional_options.undefined_chance
	);

	try {
		return should_be_undefined
			? undefined
			: generate(schema._zod.def.innerType, ctx);
	} catch (e) {
		if (e instanceof RecursionLimitReachedException) {
			return undefined;
		} else {
			throw e;
		}
	}
};

export const OptionalGenerator: InstanceofGeneratorDefinition<
	z.core.$ZodOptional<any>
> = {
	schema: z.core.$ZodOptional as any,
	generator: generator,
	match: "instanceof"
};
import { InstanceofGeneratorDefinition } from "../zocker.js";
import { generate, Generator } from "../generate.js";
import {z} from "zod";

const generate_tuple: Generator<z.core.$ZodTuple> = (schema, generation_context) => {
	const tuple = schema._zod.def.items.map((item) =>
		generate(item, generation_context)
	);
	return tuple as z.infer<typeof schema>;
};

export const TupleGenerator: InstanceofGeneratorDefinition<z.core.$ZodTuple> = {
	schema: z.core.$ZodTuple as any,
	generator: generate_tuple,
	match: "instanceof"
};
import { Generator, generate } from "../generate.js";
import {z} from "zod";
import { InstanceofGeneratorDefinition } from "../zocker.js";

const generate_promise: Generator<z.core.$ZodPromise<any>> = (
	schema,
	generation_context
) => {
	return generate(schema._zod.def.innerType, generation_context);
};

export const PromiseGenerator: InstanceofGeneratorDefinition<
	z.core.$ZodPromise<any>
> = {
	schema: z.core.$ZodPromise as any,
	generator: generate_promise,
	match: "instanceof"
};
import {z} from "zod";
import { GenerationContext, generate, Generator } from "./generate.js";
import { faker } from "@faker-js/faker";
import { default_generators } from "./default_generators.js";
import { NumberGeneratorOptions } from "./generators/numbers.js";
import { OptionalOptions } from "./generators/optional.js";
import { NullableOptions } from "./generators/nullable.js";
import { DefaultOptions } from "./generators/default.js";
import { MapOptions } from "./generators/map.js";
import { RecordOptions } from "./generators/record.js";
import { SetOptions } from "./generators/set.js";
import { AnyOptions } from "./generators/any.js";
import { ArrayOptions } from "./generators/array.js";
import { ObjectOptions } from "./generators/object.js";

export type InstanceofGeneratorDefinition<Z extends z.core.$ZodType> = {
	schema: Z;
	generator: Generator<Z>;
	/** @deprecated No longer used*/
	match?: "instanceof";
};

export type ReferenceGeneratorDefinition<Z extends z.core.$ZodType> = {
	schema: Z;
	generator: Generator<Z>;
	/** @deprecated No longer used*/
	match?: "reference";
};

export function zocker<Z extends z.core.$ZodType>(schema: Z) {
	return new Zocker(schema);
}

export class Zocker<Z extends z.core.$ZodType> {	
	private instanceof_generators: InstanceofGeneratorDefinition<any>[] = [
		...default_generators
	];
	private reference_generators: ReferenceGeneratorDefinition<any>[] = [];
	private seed: number | undefined = undefined;
	private recursion_limit = 5;

	private number_options: NumberGeneratorOptions = {
		extreme_value_chance: 0.3
	};

	private optional_options: OptionalOptions = {
		undefined_chance: 0.3
	};

	private nullable_options: NullableOptions = {
		null_chance: 0.3
	};

	private default_options: DefaultOptions = {
		default_chance: 0.3
	};

	private map_options: MapOptions = {
		max: 10,
		min: 0
	};

	private record_options: RecordOptions = {
		max: 10,
		min: 0
	};

	private set_options: SetOptions = {
		max: 10,
		min: 0
	};

	private any_options: AnyOptions = {
		strategy: "true-any"
	};

	private unknown_options: AnyOptions = {
		strategy: "true-any"
	};

	private array_options: ArrayOptions = {
		min: 0,
		max: 10
	};

	private object_options: ObjectOptions = {
		generate_extra_keys: true
	};

	constructor(public schema: Z) {}

	/**
	 * Supply your own value / function for generating values for a given schema
	 * It will be used whenever the given schema matches an encountered schema by referebce
	 *
	 * @param schema - The schema for which this value will be used
	 * @param generator - A value, or a function that generates a value that matches the schema
	 */
	supply<S extends z.core.$ZodType>(
		schema: S,
		generator: Generator<S> | z.infer<S>
	) {
		const next = this.clone();

		const generator_function =
			typeof generator === "function"
				? (generator as Generator<S>)
				: () => generator;

		next.reference_generators = [
			{
				schema,
				generator: generator_function,
				match: "reference"
			},
			...next.reference_generators
		];

		return next;
	}

	/**
	 * Override one of the built-in generators using your own.
	 * It will be used whenever an encoutntered Schema matches the one specified by **instance**
	 *
	 * @param schema - Which schema to override. E.g: `z.ZodNumber`.
	 * @param generator - A value, or a function that generates a value that matches the schema
	 */
	override<S extends z.core.$ZodTypes | KNOWN_OVERRIDE_NAMES | z.core.$constructor<any>>(
		schema: S,
		generator:
			| Generator<S extends KNOWN_OVERRIDE_NAMES ? OVERRIDE<S> : S extends z.core.$constructor<infer T> ? T : S>
			| z.infer<S extends KNOWN_OVERRIDE_NAMES ? OVERRIDE<S> : S extends z.core.$constructor<infer T> ? T : S>
	) {
		const next = this.clone();
		const generator_function =
			typeof generator === "function" ? generator : () => generator;

		const resolved_schema =
			typeof schema !== "string"
				? schema as z.core.$ZodTypes
				: OVERRIDE_NAMES[schema as KNOWN_OVERRIDE_NAMES]!;
		next.instanceof_generators = [
			{
				schema: resolved_schema,
				generator: generator_function,
				match: "instanceof"
			},
			...next.instanceof_generators
		];

		return next;
	}

	setSeed(seed: number) {
		const next = this.clone();
		next.seed = seed;
		return next;
	}

	setDepthLimit(limit: number) {
		const next = this.clone();
		next.recursion_limit = limit;
		return next;
	}

	number(options: Partial<NumberGeneratorOptions>) {
		const next = this.clone();
		next.number_options = { ...next.number_options, ...options };
		return next;
	}

	optional(options: Partial<OptionalOptions>) {
		const next = this.clone();
		next.optional_options = { ...next.optional_options, ...options };
		return next;
	}

	nullable(options: Partial<NullableOptions>) {
		const next = this.clone();
		next.nullable_options = { ...next.nullable_options, ...options };
		return next;
	}

	default(options: Partial<DefaultOptions>) {
		const next = this.clone();
		next.default_options = { ...next.default_options, ...options };
		return next;
	}

	map(options: Partial<MapOptions>) {
		const next = this.clone();
		next.map_options = { ...next.map_options, ...options };
		return next;
	}

	record(options: Partial<RecordOptions>) {
		const next = this.clone();
		next.record_options = { ...next.record_options, ...options };
		return next;
	}

	set(options: Partial<SetOptions>) {
		const next = this.clone();
		next.set_options = { ...next.set_options, ...options };
		return next;
	}

	any(options: Partial<AnyOptions>) {
		const next = this.clone();
		next.any_options = { ...next.any_options, ...options };
		return next;
	}

	unknown(options: Partial<AnyOptions>) {
		const next = this.clone();
		next.unknown_options = { ...next.unknown_options, ...options };
		return next;
	}

	array(options: Partial<ArrayOptions>) {
		const next = this.clone();
		next.array_options = { ...next.array_options, ...options };
		return next;
	}

	object(options: Partial<ObjectOptions>) {
		const next = this.clone();
		next.object_options = { ...next.object_options, ...options };
		return next;
	}

	generate(): z.infer<Z> {
		const ctx: GenerationContext<Z> = {
			reference_generators: this.reference_generators,
			instanceof_generators: this.instanceof_generators,
			recursion_limit: this.recursion_limit,
			path: [],
			semantic_context: "unspecified",
			parent_schemas: new Map(),
			seed: this.seed ?? Math.random() * 10_000_000,

			number_options: this.number_options,
			optional_options: this.optional_options,
			nullable_options: this.nullable_options,
			default_options: this.default_options,
			map_options: this.map_options,
			record_options: this.record_options,
			set_options: this.set_options,
			any_options: this.any_options,
			unknown_options: this.unknown_options,
			array_options: this.array_options,
			object_options: this.object_options
		};

		faker.seed(ctx.seed);
		return generate(this.schema, ctx);
	}

	generateMany(count: number): z.infer<Z>[] {
		let previous_seed = this.seed;
		const results: z.infer<Z>[] = [];

		for (let i = 0; i < count; i++) {
			if (previous_seed !== undefined) this.seed = previous_seed + i;
			results.push(this.generate());
		}

		this.seed = previous_seed;
		return results;
	}

	private clone(): Zocker<Z> {
		return Object.create(
			Object.getPrototypeOf(this),
			Object.getOwnPropertyDescriptors(this)
		);
	}
}

const OVERRIDE_NAMES = {
	number: z.ZodNumber as any as z.ZodNumber,
	string: z.ZodString as any as z.ZodString,
	boolean: z.ZodBoolean as any as z.ZodBoolean,
	bigint: z.ZodBigInt as any as z.ZodBigInt,
	date: z.ZodDate as any as z.ZodDate,
	undefined: z.ZodUndefined as any as z.ZodUndefined,
	null: z.ZodNull as any as z.ZodNull,
	any: z.ZodAny as any as z.ZodAny,
	unknown: z.ZodUnknown as any as z.ZodUnknown,
	void: z.ZodVoid as any as z.ZodVoid,
	never: z.ZodNever as any as z.ZodNever,
	array: z.ZodArray as any as z.ZodArray<any>,	
	object: z.ZodObject as any as z.ZodObject<any>,
	union: z.ZodUnion as any as z.ZodUnion<any>,
	intersection: z.ZodIntersection as any as z.ZodIntersection<any, any>,
	tuple: z.ZodTuple as any as z.ZodTuple<any>,	
	record: z.ZodRecord as any as z.ZodRecord<any>,
	map: z.ZodMap as any as z.ZodMap<any, any>,
	set: z.ZodSet as any as z.ZodSet<any>,
	lazy: z.ZodLazy as any as z.ZodLazy<any>,				
	literal: z.ZodLiteral as any as z.ZodLiteral<any>,
	enum: z.ZodEnum as any as z.ZodEnum<any>,
	// "nativeEnum": z.$ZodNativeEnum as any as z.$ZodNativeEnum<any>, - removed in zod 4
	promise: z.ZodPromise as any as z.ZodPromise<any>,			
	transformer: z.	ZodTransform as any as z.	ZodTransform<any, any>,			
	optional: z.ZodOptional as any as z.ZodOptional<any>,
	nullable: z.ZodNullable as any as z.ZodNullable<any>
	// "effects": z.ZodEffects as any as z.ZodEffects<any, any>, - Removed in zod 4
} as const satisfies {
	[K: string]: z.core.$ZodTypes;
};

type KNOWN_OVERRIDE_NAMES = keyof typeof OVERRIDE_NAMES;
type OVERRIDE<NAME extends KNOWN_OVERRIDE_NAMES> =
	(typeof OVERRIDE_NAMES)[NAME];
//This file exists as an import-gateway for the library.
//It is the only file that is exported to the outside world.
//Every publicly exposed export is re-exported from here.

import { zocker as zocker4, Zocker } from "./lib/v4/zocker.js";
import { z  } from "zod";

export function zocker<Z extends z.core.$ZodType>(
	schema: Z
): Zocker<Z> {
	return zocker4(schema)
}
