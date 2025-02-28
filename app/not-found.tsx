import Nav from "@/components/site-nav";
import Link from "next/link";

export default function NotFound() {
	return (
		<>
			<Nav fixed />
			<div className="h-svh flex flex-col items-center justify-center gap-2">
				<h2 className="text-3xl font-bold">Not Found</h2>
				<p className="text-lg">Could not find requested resource</p>
				<Link className="text-blue-600 underline" href="/">
					Return Home
				</Link>
			</div>
		</>
	);
}
