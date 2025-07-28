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
