import Nav from "@/components/site-nav";

export default function PasswordLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<>
			<Nav />
			{children}
			{/* <div className="container mx-auto py-16 space-y-2 px-4">
				<h1 className="text-3xl font-bold">Password Tools</h1>
				<p className="lg:text-lg">
					Protect your digital life with Cyber Buddy. Manage passwords, stay
					informed, and keep your data safe.
				</p>
			</div> */}
		</>
	);
}
