"use client";

import type { Category } from "@/lib/db/schema";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useQueryState } from "nuqs";

export default function CategorySelector({
	categories,
}: { categories: Category[] }) {
	const [category, setCategory] = useQueryState("category", { shallow: false });

	const handleVaultChange = (value: string) => {
		if (value === "all") {
			setCategory(null);
			return;
		}
		setCategory(value);
	};

	return (
		<div>
			<label
				htmlFor="category-select"
				className="block text-sm font-medium text-gray-700 mb-2"
			>
				Select Category
			</label>
			<Select onValueChange={handleVaultChange} value={category ?? "all"}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Select a category" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Categories</SelectItem>
					{categories.map((category) => (
						<SelectItem key={category.id} value={category.id}>
							{category.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
