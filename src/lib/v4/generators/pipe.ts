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
