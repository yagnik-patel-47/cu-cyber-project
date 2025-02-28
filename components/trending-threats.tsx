import { getTrendingThreats, type Vulnerability } from "@/lib/nvd";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Flame } from "lucide-react";

function getSeverityColor(severity?: string) {
	switch (severity?.toLowerCase()) {
		case "critical":
			return "bg-red-600 hover:bg-red-700";
		case "high":
			return "bg-orange-500 hover:bg-orange-600";
		case "medium":
			return "bg-yellow-500 hover:bg-yellow-600";
		case "low":
			return "bg-blue-500 hover:bg-blue-600";
		default:
			return "bg-gray-500 hover:bg-gray-600";
	}
}

function ThreatCard({ vulnerability }: { vulnerability: Vulnerability }) {
	const description =
		vulnerability.descriptions.find((d) => d.lang === "en")?.value ||
		"No description available";

	// Get CVSS data if available (v3.1 preferred, fallback to v3.0)
	const cvssData =
		vulnerability.metrics?.cvssMetricV31?.[0]?.cvssData ||
		vulnerability.metrics?.cvssMetricV30?.[0]?.cvssData;

	const severity = cvssData?.baseSeverity || "Unknown";
	const score = cvssData?.baseScore || null;

	return (
		<Card className="border-2 border-red-200 dark:border-red-900">
			<CardHeader className="pb-2">
				<div className="flex justify-between items-start">
					<div className="flex items-center">
						<Flame className="h-5 w-5 text-red-500 mr-2" />
						<CardTitle className="text-lg">{vulnerability.id}</CardTitle>
					</div>
					<Badge className={getSeverityColor(severity)}>
						{severity} {score !== null && `(${score})`}
					</Badge>
				</div>
				<CardDescription>
					Published{" "}
					{formatDistanceToNow(new Date(vulnerability.published), {
						addSuffix: true,
					})}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-sm line-clamp-3">{description}</p>
				<a
					href={`https://nvd.nist.gov/vuln/detail/${vulnerability.id}`}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-600 hover:underline text-sm mt-2 inline-block"
				>
					View details
				</a>
			</CardContent>
		</Card>
	);
}

export async function TrendingThreats() {
	try {
		const threats = await getTrendingThreats(6);

		if (!threats || threats.length === 0) {
			return (
				<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
					<p className="text-yellow-800">
						No critical threats found at the moment. Please check back later.
					</p>
				</div>
			);
		}

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{threats.map((threat) => (
					<ThreatCard key={threat.id} vulnerability={threat} />
				))}
			</div>
		);
	} catch (error) {
		console.error("Error rendering trending threats:", error);
		return (
			<div className="p-4 bg-red-50 border border-red-200 rounded-md">
				<p className="text-red-800">
					Unable to load trending threats. Please refresh the page or try again
					later.
				</p>
			</div>
		);
	}
}
