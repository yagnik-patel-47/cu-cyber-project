"use client";

import type React from "react";

import { useActionState, useEffect } from "react";
import type { Password, Vault, Category } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { updatePassword } from "@/lib/data/passwords";

export default function EditPasswordForm({
	password,
	vaults,
	categories,
	onSuccess,
}: {
	password: Password;
	vaults: Vault[];
	categories: Category[];
	onSuccess: () => void;
}) {
	const updatedPasswordWithPasswordId = updatePassword.bind(null, password.id);
	const [state, formAction] = useActionState(updatedPasswordWithPasswordId, {});

	useEffect(() => {
		if (state.success) {
			onSuccess();
		}
	}, [state]);

	return (
		<form action={formAction} className="space-y-4">
			<Input
				defaultValue={password.title}
				name="title"
				placeholder="Title"
				required
			/>
			<Input
				defaultValue={password.username || ""}
				name="username"
				placeholder="Username"
			/>
			<Input
				defaultValue={password.password}
				type="password"
				name="password"
				placeholder="Password"
				required
			/>
			<Input
				defaultValue={password.url || ""}
				type="url"
				name="url"
				placeholder="URL"
			/>
			<Textarea
				defaultValue={password.notes || ""}
				name="notes"
				placeholder="Notes"
			/>
			<Select defaultValue={password.vaultId} name="vaultId">
				<SelectTrigger>
					<SelectValue placeholder="Select Vault" />
				</SelectTrigger>
				<SelectContent>
					{vaults.map((vault) => (
						<SelectItem key={vault.id} value={vault.id}>
							{vault.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				defaultValue={password.categoryId || ""}
				disabled={categories.length === 0}
				name="categoryId"
			>
				<SelectTrigger>
					<SelectValue placeholder="Select Category" />
				</SelectTrigger>
				<SelectContent>
					{categories.map((category) => (
						<SelectItem key={category.id} value={category.id}>
							{category.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Button type="submit" className="w-full">
				Update Password
			</Button>
		</form>
	);
}
