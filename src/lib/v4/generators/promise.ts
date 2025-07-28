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
