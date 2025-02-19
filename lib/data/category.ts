"use server";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { categories } from "../db/schema";
import * as v from "valibot";
import { revalidatePath } from "next/cache";

export async function getVaults(userId: string) {
	return await db.query.vaults.findMany({
		where: eq(categories.userId, userId),
		with: {
			passwords: true,
		},
	});
}

const NewCategorySchema = v.object({
	name: v.pipe(
		v.string("The title must be a string."),
		v.nonEmpty("Please enter the title."),
	),
	color: v.optional(
		v.pipe(
			v.string("The color must be a string."),
			v.nonEmpty("Please select a color."),
		),
	),
});

export async function createCategory(
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

	const result = v.safeParse(NewCategorySchema, rawFormData);

	if (result.success) {
		await db.insert(categories).values({ ...result.output, userId });
	} else if (result.issues) {
		console.log(v.flatten<typeof NewCategorySchema>(result.issues));
		return {
			errors: v.flatten<typeof NewCategorySchema>(result.issues),
		};
	}

	revalidatePath("/password/manager");
	return { success: true };
}

export async function deleteCategory(vaultId: string) {
	await db.delete(categories).where(eq(categories.id, vaultId));

	revalidatePath("/password/manager");
}
