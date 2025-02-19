import PasswordChecker from "@/components/password-checker";
import Nav from "@/components/site-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PasswordTools() {
	return (
		<>
			<Nav />
			<div className="container mx-auto py-16 space-y-2 px-4">
				<h1 className="text-3xl font-bold">Password Tools</h1>
				<p className="lg:text-lg">
					Protect your digital life with Cyber Buddy. Manage passwords, stay
					informed, and keep your data safe.
				</p>
				<Tabs defaultValue="strength" className="container mx-auto mt-8">
					<TabsList className="w-full h-auto flex space-x-4">
						<TabsTrigger className="w-full lg:text-lg" value="strength">
							Strength Checker
						</TabsTrigger>
						<TabsTrigger className="w-full lg:text-lg" value="weak">
							Fix Weak Passwords
						</TabsTrigger>
					</TabsList>
					<TabsContent
						className="grid place-content-center py-4"
						value="strength"
					>
						<PasswordChecker />
					</TabsContent>
					<TabsContent value="weak">Change your password here.</TabsContent>
				</Tabs>
			</div>
		</>
	);
}
