"use server";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { passwords } from "../db/schema";
import { revalidatePath } from "next/cache";
import * as v from "valibot";

const NewPasswordSchema = v.object({
	title: v.pipe(
		v.string("The title must be a string."),
		v.nonEmpty("Please enter the title."),
	),
	username: v.pipe(
		v.string("Your username must be a string."),
		v.nonEmpty("Please enter your username."),
	),
	password: v.pipe(
		v.string("Your password must be a string."),
		v.nonEmpty("Please enter your password."),
		v.minLength(8, "Your password must have 8 characters or more."),
	),
	url: v.optional(
		v.pipe(
			v.string("The URL must be a string."),
			v.url("Please enter the valid URL."),
		),
	),
	notes: v.optional(v.string("The notes must be a string.")),
	vaultId: v.pipe(
		v.string("The vault ID must be a string."),
		v.nonEmpty("Please select a vault."),
	),
	categoryId: v.optional(
		v.pipe(
			v.string("The category ID must be a string."),
			v.nonEmpty("Please select a category."),
		),
	),
});

export async function addNewPassword(prevState: any, formData: FormData) {
	const rawFormData = Object.fromEntries(formData);
	for (const [key, _value] of Object.entries(rawFormData)) {
		if (rawFormData[key] === "") {
			delete rawFormData[key];
		}
	}

	const result = v.safeParse(NewPasswordSchema, rawFormData);

	if (result.success) {
		await db.insert(passwords).values(result.output);
	} else if (result.issues) {
		console.log(v.flatten<typeof NewPasswordSchema>(result.issues));
		return {
			errors: v.flatten<typeof NewPasswordSchema>(result.issues),
		};
	}

	revalidatePath("/password/manager");
	return { success: true };
}

export async function deletePassword(passwordId: string) {
	await db.delete(passwords).where(eq(passwords.id, passwordId));
	revalidatePath("/password/manager");
}

const UpdatePasswordSchema = v.optional(NewPasswordSchema);

export async function updatePassword(
	passwordId: string,
	prevState: any,
	formData: FormData,
) {
	const rawFormData = Object.fromEntries(formData);
	for (const [key, _value] of Object.entries(rawFormData)) {
		if (rawFormData[key] === "") {
			delete rawFormData[key];
		}
	}

	const result = v.safeParse(UpdatePasswordSchema, rawFormData);

	if (result.success && result.output) {
		await db
			.update(passwords)
			.set(result.output)
			.where(eq(passwords.id, passwordId));
	} else if (result.issues) {
		console.log(v.flatten<typeof UpdatePasswordSchema>(result.issues));
		return {
			errors: v.flatten<typeof UpdatePasswordSchema>(result.issues),
		};
	}

	revalidatePath("/password/manager");
	return { success: true };
}
