"use server";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { vaults } from "../db/schema";
import * as v from "valibot";
import { revalidatePath } from "next/cache";

export async function getVaults(userId: string) {
	return await db.query.vaults.findMany({
		where: eq(vaults.userId, userId),
		with: {
			passwords: true,
		},
	});
}

const NewVaultSchema = v.object({
	name: v.pipe(
		v.string("The title must be a string."),
		v.nonEmpty("Please enter the title."),
	),
	description: v.optional(
		v.pipe(
			v.string("The category ID must be a string."),
			v.nonEmpty("Please select a category."),
		),
	),
});

export async function createVault(
	userId: string,
	prevState: any,
	formData: FormData,
) {
	const rawFormData = Object.fromEntries(formData);
	for (const [key, _value] of Object.entries(rawFormData)) {
		if (rawFormData[key] === "") {
			delete rawFormData[key];
		}
	}

	const result = v.safeParse(NewVaultSchema, rawFormData);

	if (result.success) {
		await db.insert(vaults).values({ ...result.output, userId });
	} else if (result.issues) {
		console.log(v.flatten<typeof NewVaultSchema>(result.issues));
		return {
			errors: v.flatten<typeof NewVaultSchema>(result.issues),
		};
	}

	revalidatePath("/password/manager");
	return { success: true };
}

export async function deleteVault(vaultId: string) {
	await db.delete(vaults).where(eq(vaults.id, vaultId));

	revalidatePath("/password/manager");
}
