"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Vault, Category } from "@/lib/db/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { addNewPassword } from "@/lib/data/passwords";

export default function AddPasswordButton({
	vaults,
	categories,
}: { vaults: Vault[]; categories: Category[] }) {
	const [isOpen, setIsOpen] = useState(false);
	const [state, formAction] = useActionState(addNewPassword, {});

	useEffect(() => {
		if (state.success) setIsOpen(false);
	}, [state]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="w-full">Add New Password</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add New Password</DialogTitle>
					<DialogDescription>
						Enter the details for your new password entry.
					</DialogDescription>
				</DialogHeader>
				<form action={formAction} className="space-y-4">
					<Input
						name="title"
						// value={formData.title}
						placeholder="Title"
						required
					/>
					<Input
						name="username"
						// value={formData.username}
						placeholder="Username"
					/>
					<Input
						type="password"
						name="password"
						// value={formData.password}
						placeholder="Password"
						required
					/>
					<Input
						type="url"
						name="url"
						// value={formData.url}
						placeholder="URL"
					/>
					<Textarea
						name="notes"
						// value={formData.notes}
						placeholder="Notes"
					/>
					<Select
						// value={formData.vaultId}
						required
						name="vaultId"
					>
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
						// value={formData.categoryId}
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
						Add Password
					</Button>
					{state?.errors?.nested && (
						<div className="text-red-500">
							{Object.entries(state.errors.nested).map(([key, value]) => (
								<p key={key}>{value[0]}</p>
							))}
						</div>
					)}
				</form>{" "}
			</DialogContent>
		</Dialog>
	);
}
