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
