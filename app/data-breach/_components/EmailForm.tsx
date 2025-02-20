"use client";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";

export default function EmailForm() {
	const [email, setEmail] = useQueryState("email", { shallow: false });
	function handleSubmit(formData: FormData) {
		const email = formData.get("email");
		if (email) {
			setEmail(email.toString());
		}
	}

	return (
		<form action={handleSubmit}>
			<Input
				required
				type="email"
				name="email"
				placeholder="Enter your email to check data breach..."
				className="max-w-lg"
				defaultValue={email || ""}
			/>
		</form>
	);
}
