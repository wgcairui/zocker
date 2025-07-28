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
