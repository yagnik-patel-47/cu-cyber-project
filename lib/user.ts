import { eq } from "drizzle-orm";
import { db } from "./db";
import { type User, users, vaults } from "./db/schema";

export async function createUser(
	email: string,
	username: string,
): Promise<User> {
	const row = await db
		.insert(users)
		.values({
			email: email,
			name: username,
		})
		.returning();

	if (row[0] === null) {
		throw new Error("Unexpected error");
	}
	await db.insert(vaults).values([
		{
			name: "Personal",
			userId: row[0].id,
			description: "Your personal vault",
		},
		{
			name: "Work",
			userId: row[0].id,
			description: "Your work vault",
		},
		{
			name: "Finance",
			userId: row[0].id,
			description: "Your finance vault",
		},
	]);
	return row[0];
}

export async function getUserFromGitHubEmail(
	email: string,
): Promise<User | undefined> {
	const row = await db.query.users.findFirst({
		where: eq(users.email, email),
	});
	if (row === null) {
		return undefined;
	}
	return row;
}
