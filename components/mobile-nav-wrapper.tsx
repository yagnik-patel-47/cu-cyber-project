"use client";

import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function MobileNavWrapper({ session }: { session: any }) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon">
					<Menu className="size-5" />
				</Button>
			</SheetTrigger>
			<SheetContent className="bg-slate-800 border-slate-700 text-zinc-100">
				<SheetTitle className="text-xl text-zinc-100 p-4">Tools</SheetTitle>
				<div className="space-y-3 p-4">
					<Link
						href="/password/manager"
						className="text-zinc-200 hover:text-white block"
						onClick={() => setOpen(false)}
					>
						Password Manager
					</Link>
					<Link
						href="/password/checker"
						className="text-zinc-200 hover:text-white block"
						onClick={() => setOpen(false)}
					>
						Strength Check
					</Link>
					<Link
						href="/news"
						className="text-zinc-200 hover:text-white block"
						onClick={() => setOpen(false)}
					>
						News
					</Link>
					<Link
						href="/url-checker"
						className="text-zinc-200 hover:text-white block"
						onClick={() => setOpen(false)}
					>
						Link Checker
					</Link>
					<Link
						href="/data-breach"
						className="text-zinc-200 hover:text-white block"
						onClick={() => setOpen(false)}
					>
						Data Breach Check
					</Link>
					<Link
						href="/vulnerability-scanner"
						className="text-zinc-200 hover:text-white block"
						onClick={() => setOpen(false)}
					>
						Vulnerability Scanner
					</Link>
					{session.user ? (
						<a
							href="/signout"
							className="block bg-zinc-100/10 text-zinc-200 py-2 px-4 rounded-md"
							onClick={() => setOpen(false)}
						>
							Sign out
						</a>
					) : (
						<Link
							href="/login"
							className="block bg-zinc-100/10 text-zinc-200 py-2 px-4 rounded-md"
							onClick={() => setOpen(false)}
						>
							Login
						</Link>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
