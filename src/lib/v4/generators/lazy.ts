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
