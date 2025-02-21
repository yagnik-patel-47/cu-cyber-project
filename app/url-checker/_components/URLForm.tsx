"use client";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";

export default function UrlForm() {
	const [url, setUrl] = useQueryState("url", { shallow: false });
	function handleSubmit(formData: FormData) {
		const u = formData.get("url");
		if (u) {
			setUrl(u.toString());
		}
	}

	return (
		<form action={handleSubmit}>
			<Input
				required
				type="url"
				name="url"
				placeholder="Enter the url to check..."
				className="max-w-lg"
				defaultValue={url || ""}
			/>
		</form>
	);
}
