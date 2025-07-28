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
