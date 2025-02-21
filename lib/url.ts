import punycode from "node:punycode";

export function canonicalizeUrl(url: string): string {
	// Parse the URL
	let parsedUrl: URL;
	try {
		parsedUrl = new URL(url);
	} catch (e) {
		throw new Error("Invalid URL: " + url);
	}

	// Step 1: Canonicalize hostname
	let host = parsedUrl.hostname.toLowerCase();
	if (host) {
		// Remove leading/trailing dots and normalize
		host = host.replace(/^\.+|\.+$/g, "").replace(/\.{2,}/g, ".");
		const parts = host.split(".");
		for (let i = 0; i < parts.length; i++) {
			parts[i] = punycode.toASCII(parts[i]); // Convert IDNs to Punycode
		}
		host = parts.join(".");
	}

	// Step 2: Normalize path (keep slashes literal)
	let path = parsedUrl.pathname || "/";
	// Remove control characters (tab, CR, LF)
	path = path.replace(/[\t\r\n]/g, "");
	// Resolve ./ and ../
	path = path.replace(/\/[.]\/|\/[.]$/g, "/");
	while (path.includes("/../")) {
		path = path.replace(/\/[^\/]+?\/[.]{2}\//g, "/");
	}
	// Collapse multiple slashes
	path = path.replace(/\/+/g, "/");
	if (!path.startsWith("/")) {
		path = "/" + path;
	}

	// Step 3: Handle query parameters
	let query = "";
	if (parsedUrl.search) {
		const rawQuery = parsedUrl.search.substring(1);
		query = sortQueryParameters(rawQuery);
		if (query) {
			query = "?" + query;
		}
	}

	// Step 4: Construct canonical URL (no scheme, no over-encoding)
	let canonical = host + path + query;

	// Step 5: Decode any existing percent-escapes fully
	while (canonical.includes("%")) {
		try {
			canonical = decodeURIComponent(canonical);
		} catch (e) {
			break; // Stop if decoding fails
		}
	}

	// Step 6: Encode only specific characters (not slashes)
	// Encode ASCII <= 32, >= 127, #, %, but leave / as-is
	canonical = canonical
		.split("")
		.map((char) => {
			const code = char.charCodeAt(0);
			if (code <= 32 || code >= 127 || char === "#" || char === "%") {
				return "%" + code.toString(16).toUpperCase().padStart(2, "0");
			}
			return char;
		})
		.join("");

	return canonical;
}

function sortQueryParameters(query: string): string {
	const params = new URLSearchParams(query);
	const sortedParams: Record<string, string[]> = {};

	// Group parameters by key
	for (const [key, value] of params) {
		if (!sortedParams[key]) {
			sortedParams[key] = [];
		}
		sortedParams[key].push(value);
	}

	// Sort keys and values
	const sortedKeys = Object.keys(sortedParams).sort();
	let sortedQuery = "";
	for (const key of sortedKeys) {
		const values = sortedParams[key].sort();
		for (const value of values) {
			if (sortedQuery) {
				sortedQuery += "&";
			}
			// Encode key and value, but not slashes in value
			sortedQuery += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
		}
	}
	return sortedQuery;
}
