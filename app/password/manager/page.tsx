import { Suspense } from "react";
import PasswordList from "./_components/PasswordList";
import VaultSelector from "./_components/VaultSelector";
import CategorySelector from "./_components/CategorySelector";
import AddPasswordButton from "./_components/AddPasswordButton";
import VaultManager from "./_components/VaultManager";
import CategoryManager from "./_components/CategoryManager";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getCurrentSession } from "@/lib/session";
import { categories, vaults } from "@/lib/db/schema";
import { redirect } from "next/navigation";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const session = await getCurrentSession();

	if (session.user === null) {
		return redirect("/login");
	}

	const vaultsData = await db.query.vaults.findMany({
		where: eq(vaults.userId, session.user?.id ?? ""),
		with: {
			passwords: {
				orderBy: (p, { asc }) => [asc(p.createdAt)],
			},
		},
	});

	const categoriesData = await db.query.categories.findMany({
		where: eq(categories.userId, session.user?.id ?? ""),
	});

	let allPasswords = vaultsData.flatMap((v) =>
		v.passwords.map((password) => ({
			...password,
			vaultName: v.name,
			categoryName: categoriesData.find((c) => c.id === password.categoryId)
				?.name,
			categoryColor:
				categoriesData.find((c) => c.id === password.categoryId)?.color ??
				undefined,
		})),
	);
	const vaultId = (await searchParams).vault;
	const categoryId = (await searchParams).category;
	if (vaultId) {
		allPasswords = allPasswords.filter((p) => p.vaultId === vaultId);
	}
	if (categoryId) {
		allPasswords = allPasswords.filter((p) => p.categoryId === categoryId);
	}
	allPasswords = allPasswords.sort(
		(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
	);

	return (
		<div className="container mx-auto py-16 px-4">
			<h1 className="text-3xl font-bold mb-8">Password Manager</h1>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="md:col-span-1 space-y-6">
					<VaultSelector vaults={vaultsData} />
					<CategorySelector categories={categoriesData} />
					<AddPasswordButton vaults={vaultsData} categories={categoriesData} />
					<VaultManager userId={session.user.id} initialVaults={vaultsData} />
					<CategoryManager
						userId={session.user.id}
						initialCategories={categoriesData}
					/>
				</div>
				<div className="md:col-span-3">
					<Suspense fallback={<div>Loading passwords...</div>}>
						<PasswordList
							passwords={allPasswords}
							vaults={vaultsData}
							categories={categoriesData}
						/>
					</Suspense>
				</div>
			</div>
		</div>
	);
}
