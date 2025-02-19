"use client";

import type { Vault } from "@/lib/db/schema";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useQueryState } from "nuqs";

export default function VaultSelector({ vaults }: { vaults: Vault[] }) {
	const [vault, setVault] = useQueryState("vault", { shallow: false });

	const handleVaultChange = (value: string) => {
		if (value === "all") {
			setVault(null);
			return;
		}
		setVault(value);
	};

	return (
		<div>
			<label
				htmlFor="vault-select"
				className="block text-sm font-medium text-gray-700 mb-2"
			>
				Select Vault
			</label>
			<Select onValueChange={handleVaultChange} value={vault ?? "all"}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Select a vault" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Vaults</SelectItem>
					{vaults.map((vault) => (
						<SelectItem key={vault.id} value={vault.id}>
							{vault.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
