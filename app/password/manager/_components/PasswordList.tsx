"use client";

import { useState } from "react";
import type { Password, Vault, Category } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import EditPasswordForm from "./EditPasswordForm";
import { deletePassword } from "@/lib/data/passwords";

type PasswordWithMetadata = Password & {
	vaultName: string;
	categoryName?: string;
	categoryColor?: string;
};

export default function PasswordList({
	vaults,
	categories,
	passwords,
}: {
	vaults: Vault[];
	categories: Category[];
	passwords: PasswordWithMetadata[];
}) {
	const [editingPassword, setEditingPassword] = useState<Password | null>(null);

	function handleEditSuccess() {
		setEditingPassword(null);
	}

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-semibold mb-4">Your Passwords</h2>
			{passwords.length === 0 && (
				<p className="text-gray-600">No passwords found.</p>
			)}
			{passwords.map((password) => (
				<PasswordItem
					key={password.id}
					password={password}
					onEdit={() => setEditingPassword(password)}
				/>
			))}
			<Dialog
				open={!!editingPassword}
				onOpenChange={() => setEditingPassword(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Password</DialogTitle>
						<DialogDescription>
							Update the details for your password entry.
						</DialogDescription>
					</DialogHeader>
					{editingPassword && (
						<EditPasswordForm
							password={editingPassword}
							vaults={vaults}
							categories={categories}
							onSuccess={handleEditSuccess}
						/>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

function PasswordItem({
	password,
	onEdit,
}: {
	password: PasswordWithMetadata;
	onEdit: (password: Password) => void;
}) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
			<div>
				<h3 className="text-lg font-semibold">{password.title}</h3>
				<p className="text-gray-600">{password.username}</p>
				<p className="text-gray-600">
					Password: {showPassword ? password.password : "••••••••"}
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setShowPassword(!showPassword)}
						className="ml-2"
					>
						{showPassword ? "Hide" : "Show"}
					</Button>
				</p>
			</div>
			<div className="space-y-2">
				<div className="flex gap-2 items-center justify-end">
					<span className="text-gray-600 text-xs">Vault:</span>
					<span className="bg-gray-800 text-xs py-1 px-3 rounded-full text-zinc-200 font-semibold">
						{password.vaultName}
					</span>
				</div>
				{password.categoryName && (
					<div className="flex items-center justify-end">
						<span className="text-gray-600 text-xs">Category:</span>
						<span
							style={{ textDecorationColor: password.categoryColor }}
							className="text-xs py-1 px-3 rounded-full font-semibold underline decoration-2 underline-offset-2"
						>
							{password.categoryName}
						</span>
					</div>
				)}
				<div className="space-x-2">
					<Button variant="outline" size="sm" onClick={() => onEdit(password)}>
						Edit
					</Button>
					<Button
						variant="destructive"
						size="sm"
						onClick={() => deletePassword(password.id)}
					>
						Delete
					</Button>
				</div>
			</div>
		</div>
	);
}
