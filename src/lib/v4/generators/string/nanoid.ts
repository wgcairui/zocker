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
