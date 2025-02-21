import UrlForm from "./_components/URLForm";
import Nav from "@/components/site-nav";
import { canonicalizeUrl } from "@/lib/url";
import { safebrowsing } from "@googleapis/safebrowsing";
import crypto from "node:crypto";

const client = safebrowsing({
	version: "v4",
	auth: process.env.GOOGLE_API_KEY,
});

const threatDescription: Record<string, string> = {
	MALWARE: "Harmful software that can damage your device or steal your data",
	SOCIAL_ENGINEERING:
		"Deceptive tactics used to trick users into revealing sensitive information",
	UNWANTED_SOFTWARE:
		"Programs that may be unwanted, intrusive, or affect your browsing experience",
};

export default async function DataBreach({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const url = (await searchParams).url;

	if (!url)
		return (
			<>
				<Nav />
				<div className="container mx-auto py-16 px-4">
					<h1 className="text-3xl font-bold mb-4">URL Checker</h1>
					<UrlForm />
				</div>
			</>
		);

	const canonicalUrl = canonicalizeUrl(url);
	// console.log(canonicalUrl);

	// const hash = crypto.createHash("sha256").update(canonicalUrl).digest();
	// const prefixBuffer = hash.subarray(0, 4);

	// const prefixBase64 = prefixBuffer.toString("base64");

	// const fullHashBase64 = hash.toString("base64");
	// console.log(prefixBase64);
	// console.log(response.data, response.data.fullHashes);

	// if (response.data?.fullHashes && response.data.fullHashes.length > 0) {
	// 	for (const fullHashDetail of response.data.fullHashes) {
	// 		if (fullHashDetail.fullHash === fullHashBase64) {
	// 			console.log("URL is unsafe");
	// 		}
	// 	}
	// }
	// console.log("URL is safe");

	const res = await client.threatMatches.find(
		{},
		{
			body: JSON.stringify({
				threatInfo: {
					threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
					platformTypes: ["ANY_PLATFORM"],
					threatEntryTypes: ["URL"],
					threatEntries: [{ url: canonicalUrl }],
				},
			}),
		},
	);
	const threats = res.data.matches;
	return (
		<>
			<Nav />
			<div className="container mx-auto py-16 px-4">
				<h1 className="text-3xl font-bold mb-4">URL Checker</h1>
				<UrlForm />
				{threats ? (
					<div className="mt-4">
						<p className="text-lg">
							<span className="text-red-500">Unsafe</span>. Threats found.
							Please proceed with caution.
						</p>
						<ul>
							{threats.map(
								(threat) =>
									threat.threatType && (
										<li key={threat.threatType}>
											{threat.threatType} -{" "}
											{threatDescription[threat.threatType as string]}
										</li>
									),
							)}
						</ul>
					</div>
				) : (
					<p className="mt-4 text-lg">
						<span className="text-green-500">Safe</span>. No threats found.
						Happy surfing :)
					</p>
				)}
			</div>
		</>
	);
}
