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
