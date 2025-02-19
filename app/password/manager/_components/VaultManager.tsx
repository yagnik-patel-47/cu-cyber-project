"use client";

import { useActionState, useEffect, useState } from "react";
import type { Vault } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { createVault, deleteVault } from "@/lib/data/vault";

export default function VaultManager({
	initialVaults,
	userId,
}: { initialVaults: Vault[]; userId: string }) {
	const createVaultWithUserId = createVault.bind(null, userId);
	const [isAddingVault, setIsAddingVault] = useState(false);
	// @ts-ignore
	const [state, formAction] = useActionState(createVaultWithUserId, {});

	useEffect(() => {
		if (state?.success) {
			setIsAddingVault(false);
		}
	}, [state]);

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold">Manage Vaults</h2>
			{initialVaults.map((vault) => (
				<div key={vault.id} className="flex justify-between items-center">
					<span>{vault.name}</span>
					<Button
						variant="destructive"
						size="sm"
						onClick={() => deleteVault(vault.id)}
					>
						Delete
					</Button>
				</div>
			))}
			<Dialog open={isAddingVault} onOpenChange={setIsAddingVault}>
				<DialogTrigger asChild>
					<Button>Add New Vault</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Vault</DialogTitle>
						<DialogDescription>
							Create a new vault to organize your passwords.
						</DialogDescription>
					</DialogHeader>
					<form action={formAction} className="space-y-4">
						<Input placeholder="Vault Name" name="name" required />
						<Textarea placeholder="Description" name="name" />
						<Button type="submit">Add Vault</Button>
						{state?.errors?.nested && (
							<div className="text-red-500">
								{Object.entries(state.errors.nested).map(([key, value]) => (
									<p key={key}>{value[0]}</p>
								))}
							</div>
						)}
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
