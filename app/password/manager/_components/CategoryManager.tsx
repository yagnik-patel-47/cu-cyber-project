"use client";

import { useActionState, useEffect, useState } from "react";
import type { Category } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { createCategory, deleteCategory } from "@/lib/data/category";

export default function CategoryManager({
	initialCategories,
	userId,
}: { initialCategories: Partial<Category>[]; userId: string }) {
	const createVaultWithUserId = createCategory.bind(null, userId);
	const [isAddingCategory, setIsAddingCategory] = useState(false);
	const [state, formAction] = useActionState(createVaultWithUserId, {});

	useEffect(() => {
		if (state?.success) {
			setIsAddingCategory(false);
		}
	}, [state]);

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold">Manage Categories</h2>
			{initialCategories.map((category) => (
				<div key={category.id} className="flex justify-between items-center">
					<span>{category.name}</span>
					<Button
						variant="destructive"
						size="sm"
						onClick={() => deleteCategory(category.id ?? "")}
					>
						Delete
					</Button>
				</div>
			))}
			<Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
				<DialogTrigger asChild>
					<Button>Add New Category</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Category</DialogTitle>
						<DialogDescription>
							Create a new category to organize your passwords.
						</DialogDescription>
					</DialogHeader>
					<form action={formAction} className="space-y-4">
						<Input
							placeholder="Category Name"
							name="name"
							// value={newCategory.name}
							// onChange={(e) =>
							// 	setNewCategory({ ...newCategory, name: e.target.value })
							// }
							required
						/>
						<label htmlFor="theme">Theme color</label>
						<Input
							className="h-12 p-0.5 rounded-none"
							id="theme"
							type="color"
							name="color"
							// value={newCategory.color}
							// onChange={(e) =>
							// 	setNewCategory({ ...newCategory, color: e.target.value })
							// }
						/>
						<Button type="submit">Add Category</Button>
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
