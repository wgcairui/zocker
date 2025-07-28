
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
