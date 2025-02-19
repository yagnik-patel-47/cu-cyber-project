import Link from "next/link";

export default function LoginPage() {
	return (
		<div className="flex justify-center items-center h-svh">
			<Link
				className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-md"
				href="/login/github"
			>
				Login with GitHub
			</Link>
		</div>
	);
}
